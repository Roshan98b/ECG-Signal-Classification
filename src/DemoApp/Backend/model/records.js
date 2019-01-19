// jshint esversion : 6

var mongoose = require('mongoose');

var ModelSchema = mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	_member_id: {
        type: mongoose.Schema.ObjectId,
		refs: 'member',
		unique: false
    },
    filename: {
		type: String
	},
	date: {
		type: Date,
		required: true
	},
	result: {
        N: Number,
        R: Number,
		P: Number,
		arrhythmia: Boolean
	}
});

var Records = mongoose.model('records', ModelSchema);

module.exports = Records;

// Add record
module.exports.addRecord = (model, callback) => {
	model.save(callback);
};

// All Records
module.exports.getAllRecords = (callback) => {
    Member.find({}, callback);
};

// User Records
module.exports.getUserRecords = (id, callback) => {
    let query = {_member_id: id}
    Member.find(query, callback);
};


