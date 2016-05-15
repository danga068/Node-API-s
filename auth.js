var express = require('express');
var router = express.Router();
var fs = require('fs');
var uid = require('rand-token').uid;


router.post('/register', function(req, res) {
	var name = req.body.name || null;
	var email = req.body.email || null;
	var pass = req.body.password || null;
	var confirmPass = req.body.confirm_password || null;

	result = {
		code: 200,
		success: true,
		access_token: null,
		message: "Account created successfully",
		developerMessage: null
	}

	if(!email || !pass || !confirmPass) {
		result.code = 401;
		result.success = false;
		result.message = "Invalid email or password";
		res.end(JSON.stringify(result));
		return result;
	}

	if(pass !== confirmPass) {
		result.code = 401;
		result.success = false;
		result.message = "confirm password not matched with password";
		res.end(JSON.stringify(result));
		return result;
	}

	var content = fs.readFileSync("./credential.json", "utf8");
	var data = JSON.parse(content);

	for (var i = 0; i < data.users.length; i++) {
		if( data.users[i].email === email) {
			result.code = 409;
			result.success = false;
			result.message = "user already exist";
			res.end(JSON.stringify(result));
			return result;
		}
	}

	var access_token = uid(32);
	result.success = true;
	result.access_token = access_token;
	
	newUser = {
		name: name,
		email: email,
		pass: pass,
		confirm_pass: confirmPass,
		access_token: access_token
	}

	newUser.id = data.users[data.users.length-1].id + 1;

	data.users.push(newUser);

	fs.writeFileSync('./credential.json', JSON.stringify(data, null, 4));

	res.end(JSON.stringify(result));
	return result;
});	

router.post('/login', function(req, res) {
	var email = req.body.email || null;
	var pass = req.body.password || null;

	var result = {
		code: 200,
		success: true,
		message: "Login successful",
		access_token: null
	}

	if (!email || !pass) {
		result.code = 401;
		result.success = false;
		result.message = "Invalid username/password";
		res.end(JSON.stringify(result));
		return result;
	}

	var content = fs.readFileSync("./credential.json", "utf8");
	var data = JSON.parse(content);

	var isUserExist = false;
	for (var i = 0; i < data.users.length; i++) {
		if(data.users[i].email === email && data.users[i].pass === pass) {
			if(data.users[i].access_token === null) {
				data.users[i].access_token = uid(32);
				result.access_token = data.users[i].access_token;
			} else {
				result.access_token = data.users[i].access_token;
				result.success = false;
				result.code = 409;
				result.message = "You are already Login";
			}
			isUserExist = true;
			break;
		}
	}

	if (!isUserExist) {
		result.code = 404;
		result.success = false;
		result.message = "Invalid username/password";
	} 

	res.end(JSON.stringify(result));
	fs.writeFileSync('./credential.json', JSON.stringify(data, null, 4));
	return result;
});

router.post('/logout', function(req, res) {
	var email = req.headers.email || null;
	var access_token = req.headers.access_token || null;

	result = {
		code: 200,
		success: true,
		message: "logout successfully"
	}

	if(!email || !access_token) {
		result.code = 401;
		result.success = false;
		result.message = "email/access_token not found";
		res.end(JSON.stringify(result));
		return result;
	}

	var content = fs.readFileSync("./credential.json", "utf8");
	var data = JSON.parse(content);

	var isCredentialExist = false;
	for (var i = 0; i < data.users.length; i++) {
		if (data.users[i].email === email && data.users[i].access_token === access_token) {
			isCredentialExist = true;
			data.users[i].access_token = null;
			break;
		} 
	}

	if (!isCredentialExist) {
		result.code = 401;
		result.success = false;
		result.message = "Wrong credentional";
	}

	res.end(JSON.stringify(result));
	fs.writeFileSync('./credential.json', JSON.stringify(data, null, 4));
	return result;
});

module.exports = router;