// jshint esversion : 6

var passport = require('passport');
var Strategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

var Member = require('../model/member');

var options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
	secretOrKey: 'app'
};

// Strategy
passport.use(new Strategy(options, (payload, done) => {
	Member.getById(payload._id, (err, model) => {
		if(err) return done(err, false);
		if(model) return done(null, model);
		else return done(null, false);
	});
}));