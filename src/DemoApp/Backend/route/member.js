// jshint esversion : 9

var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var multer = require('multer');
var request =  require('request-promise');

var Mail = require('../config/mail');
var Member = require('../model/member');
var Records = require('../model/records');
var DevRecords = require('../model/devrecords');
var router = express.Router();
var token = '';

// Multer Config - Set Storage
const storage = multer.diskStorage({
	destination: './uploads',
	filename: (req, file, callback) => {
		const date = new Date();
		callback(null, file.originalname);
	}
});

// Multer Config - Init Upload - All Files
const files = multer({
	storage: storage
}).array('files', 2);

//Login *
router.post('/login', (req, res) => {
	Member.getByEmail(req.body.email, (err, model) => {
		if(err) return res.status(501).json(err);
		if(model == null) return res.status(501).json({message: 'Invalid username!! Please register before trying to login!!'});  
		else {
			var flag;
			if(bcrypt.compareSync(req.body.password, model.password)) {
				token = jwt.sign(model.toJSON(), 'app', {
					expiresIn: 86400
				});
				res.status(200).json(
                    {
                        message: 'Authentication Success',
                        token: 'JWT '+token,
                        user: {
                            _id: model._id,
                            firstname: model.firstname,
                            lastname: model.lastname,
                            dob: model.dob,
                            gender: model.gender,
                            contactno: model.contactno,
                            email: model.email
                        }
                    }
                );
			}
			else res.status(501).json({message: 'Invalid login credentials!!'});
		}
	});	
});

// Register *
router.post('/member', (req, res) => {
	var member = new Member({
		_id: new mongoose.Types.ObjectId(),
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		dob: req.body.dob,
		email: req.body.email,
		gender: req.body.gender,
		contactno: req.body.contactno,
		password: req.body.password,
		securityQuestion: req.body.securityQuestion,
		securityAnswer: req.body.securityAnswer
	});
	Member.addUser(member, (err, model) => {
		if(err) {
			res.status(501).json(err);
			console.log(err);
		}
		else {
			res.status(200).json({message: 'Add Member Success'});
		}
	});
});

//Forgot password *
router.post('/forgotpassword',
	(req, res) => {
		Member.getByEmail(req.body.email, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			} else {
				if(!model){
					res.status(501).json({message: 'Requested account does not exist'});
				}
				else {
					if(req.body.securityQuestion != model.securityQuestion || req.body.securityAnswer != model.securityAnswer) {
						res.status(501).json({message: 'Invalid Security credentials!!!'});
					} else {
						
						const output = `
								<p>Please click on the link provided to reset your password and re-gain access to your account.</p>
								<a href="http://127.0.0.1:4200/resetPassword/${model._id}">http://127.0.0.1:4200/resetPassword</a>
							`;

					    let mailOptions = {
					        from: '"Admin" <aaroncoc0001@gmail.com>', // sender address
					        to: req.body.email, // list of receivers
					        subject: 'Reset your Demo App password', // Subject line
					        text: '', // plain text body
					        html: output // html body
					    };

					    Mail.sendMail(mailOptions, (error, info) => {
					        if (error) {
					            return console.log(error);
					        }
					        console.log('Message sent: %s', info.messageId);
					        res.status(200).json({message: 'Security credentials verified successfully!!'});
					    });
					}
				}
			}
		});
	});

//Reset Password *
router.post('/resetpassword',
	(req, res) => {
		req.body.password = bcrypt.hashSync(req.body.password, 10);
		Member.resetPasswordById(req.body.id, req.body.password, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({message: 'Password has been successfully reset!!'});
			}
		});
	});
// Reset password 1 *
router.post('/resetpassword1',
  passport.authenticate('jwt', {session: false}),
	(req, res) => {
		req.body.password = bcrypt.hashSync(req.body.password, 10);
		Member.resetPasswordById(req.body.id, req.body.password, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({message: 'Password has been successfully reset!!'});
			}
		});
	});

//Reset Security Credentials *
router.post('/resetSecurityCredentials',
  passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Member.resetSecurityCredentialsById(req.body.id, req.body.question, req.body.answer, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({message: 'Security Credentials have been successfully reset!!'});
			}
		});
	});

//Edit profile *
router.post('/editedprofile',
	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		Member.updateByEmail(req.body.email, req.body.firstname, req.body.lastname, req.body.dob, req.body.gender, req.body.contactno, (err, model) => {
			if(err) {
				res.status(501).json(err);
				console.log(err);
			}
			else {
				res.status(200).json({
					message: 'Member profile has been updated!!',
					token: 'JWT '+token,
					user: {
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						dob: req.body.dob,
						gender: req.body.gender,
						contactno: req.body.contactno
					}
				});
			}
	});
});

//Check password before allowing access to change password *
router.post('/checkPassword',
	passport.authenticate('jwt', {session: false}),
 		async (req, res) => {
			try {
				let model = await Member.getById(req.body.id);
				if(bcrypt.compareSync(req.body.password, model.password))
					res.status(200).json({message: 'Password verified successfully!!'});
				else
					res.status(501).json({message: 'Incorrect password!!'});
			} catch(err) {
				res.status(501).json({message: 'Member not found!!'});
			}
		}
);

// Upload
router.post('/upload', (req, res) => {
	files(req, res, (err) => {
		if(err) {
			console.log(err);
			res.status(501).json({error: err});
		}
		else {
			const obj = {filename: req.body.name};
			req.body.date = new Date(req.body.date);

			var options = {
				method: 'POST',
				url: 'http://127.0.0.1:5000/classify',
				headers: {
					'Content-Type': 'application/json'
				},
				json: obj
			};
			let result =  {
				N: 0,
				V: 0,
				L: 0,
				R: 0,
				P: 0
			};
			request(options).then((body) => {
				const classes = body.classes;

				for (let i of classes) {
					if (i == 0) result.N++;
					else if (i == 1) result.P++;
					else if (i == 2) result.L++;
					else if (i == 3) result.V++;
					else result.R++;							
				}
				
				if (result.V === 0 && result.L === 0 && result.R === 0 && result.P === 0) {
					result.arrhythmia = false;
				} else {
					result.arrhythmia = true;
				}
	
				var record = new Records({
					_id: new mongoose.Types.ObjectId(),
					_member_id: req.body._id,
					filename: req.body.name,
					date: req.body.date,
					result: result
				});
	
				return Records.addRecord(record);
			}).then((model) => {
				res.status(200).json(result);
			}).catch((err) => {
				console.log(err);
				res.status(501).json(err);
			});
		}
	});
});

// User Records
router.post('/userrecords', async (req, res) => {
	try {
		let model = await Records.getUserRecords(req.body._id);
		res.status(200).json(model);
	} catch(err) {
		console.log(err);
		res.status(500).json(err);
	}
});

// Device Records
router.post('/devrecords', async (req, res) => {
	try {
		let model = await DevRecords.getDevRecords(req.body._id);
		res.status(200).json(model);
	} catch(err) {
		console.log(err);
		res.status(500).json(err);
	}
});

// All Records
router.get('/allrecords', async (req, res) => {
	let record = await Records.getAllRecords();
	let display = [];
	for (let i of record) {
		try {
			let model = await Member.getById(i._member_id);
			let obj = {
					_id: i._id,
					_member_id: i._member_id,
					filename: i.filename,
					date: i.date,
					result: i.result,
					username: model.firstname + ' ' + model.lastname  
				};
			display.push(obj);
		} catch(err) {
			console.log(err);
			res.status(501).json(err);
		}
	}
	res.status(200).json(display);
});

// All Device Records
router.get('/alldevrecords', async (req, res) => {
	let record = await DevRecords.getAllDevRecords();
	let display = [];
	for (let i of record) {
		try {
			let model = await Member.getById(i._member_id);
			let obj = {
					_id: i._id,
					_member_id: i._member_id,
					date: i.date,
					result: i.result,
					ecg: i.ecg,
					username: model.firstname + ' ' + model.lastname  
				};
			display.push(obj);
		} catch(err) {
			console.log(err);
			res.status(501).json(err);
		}
	}
	res.status(200).json(display);
});

// Signal Acquisition
router.post('/signalAcquisition', async (req, res) => {
	try {
		var options; 
		options = {
			method: 'GET',
			url: `http://${req.body.ip}:5000/acquire_ecg`
		};
		let values = await request(options);
		values = JSON.parse(values);		
		options = {
			method: 'POST',
			url: 'http://127.0.0.1:5000/devclassify',
			headers: {
				'Content-Type': 'application/json'
			},
			json: values
		};
		let body = await request(options);
		if (typeof(body) !== 'object' ) {
			body = JSON.parse(body);
		}
		const classes = body.classes;
		if (classes.length === 0) {
			res.status(200).json({result: []});
		} else {
			let result =  {
				N: 0,
				V: 0,
				L: 0,
				R: 0,
				P: 0
			};
			for (let i of classes) {
				if (i == 0) result.N++;
				else if (i == 1) result.V++;
				else if (i == 2) result.L++;
				else if (i == 3) result.R++;
				else result.P++;							
			}
			if (result.V === 0 && result.L === 0 && result.R === 0 && result.P === 0) {
				result.arrhythmia = false;
			} else {
				result.arrhythmia = true;
			}
			var devrecord = new DevRecords({
				_id: new mongoose.Types.ObjectId(),
				_member_id: req.body._id,
				ecg: values.ecg,
				date: req.body.date,
				result: result
			});
			await DevRecords.addDevRecord(devrecord);
			res.status(200).json({result: result, ecg: values.ecg});
		}
	} catch(err) {
		console.log(err);
		res.status(501).json(err);
	}
});

module.exports = router;