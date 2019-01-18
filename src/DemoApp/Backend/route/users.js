// jshint esversion : 6

var express = require('express');
var router = express.Router();

var member = require('./member');

// Member route
router.use('', member);

module.exports = router;