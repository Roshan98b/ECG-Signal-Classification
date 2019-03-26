// jshint esversion : 6

var mongoose = require('mongoose');

var ModelSchema = mongoose.Schema({
	_id: mongoose.Schema.ObjectId,
	_member_id: {
        type: mongoose.Schema.ObjectId,
		refs: 'member',
		unique: false
    },
    ecg: {
        type: Array,
    },
	date: {
		type: Date,
		required: true
	},
	result: {
		N: Number,
		V: Number,
		L: Number,
		R: Number,
		P: Number,
		arrhythmia: Boolean
	}
});

var DevRecords = mongoose.model('devrecords', ModelSchema);

module.exports = DevRecords;

// Add record
module.exports.addDevRecord = (model, callback) => {
	model.save(callback);
};

// All Records
module.exports.getAllDevRecords = (callback) => {
    return DevRecords.find({}, callback);
};

// User Records
module.exports.getDevRecords = (id, callback) => {
    let query = {_member_id: id};
    return DevRecords.find(query, callback);
};

