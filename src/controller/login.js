const User = require('./user.js');
const muta = require('../blockchains/muta.js');
const cryptoRandomString = require('crypto-random-string');

exports.requestLogin = (req, res, next) => {
	req.session.challenge = cryptoRandomString({length: 256});
	res.json({
		challenge: req.session.challenge
	});
}

exports.login = async (req, res, next) => {
	if(!req.session.challenge) {
		res.json({"error": 1, "msg": "Challenge is not sent yet"});
		return;
	}

	if(!req.body.signature || !req.body.user_id) {
		res.json({"error": 1, "msg": "No signature"});
		return;
	}

	var user = await User.getUser(req.body.user_id);
	console.log(user);
	if(!user) {
		res.json({"error": 1, "msg": "Invalid user id"});
		return;
	}

	console.log(user);

	req.session.logged_in = user.name;
	console.log(req.session);

	// TODO: verify signature with associated public key
	res.json({
		error: 0
	});
}