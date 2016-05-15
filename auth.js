var express = require('express');
var router = express.Router();
var fs = require('fs');
var uid = require('rand-token').uid;


router.post('/register', function(req, res) {
	var name = req.query.name || req.body.name || null;
	var email = req.query.email || req.body.email || null;
	var pass = req.query.password || req.body.password || null;
	var confirmPass = req.query.confirm_password || req.body.confirm_password || null;

	result = {
		success: true,
		access_token: null,
		message: "Account created successfully",
		developerMessage: null
	}

	if(!email || !pass || !confirmPass) {
		result.success = false;
		result.message = "Invalid email or password";
		res.end(JSON.stringify(result));
		return result;
	}

	if(pass !== confirmPass) {
		result.success = false;
		result.message = "confirm password not matched with password";
		res.end(JSON.stringify(result));
		return result;
	}

	var content = fs.readFileSync("./credential.json", "utf8");
	var data = JSON.parse(content);

	for (var i = 0; i < data.users.length; i++) {
		if( data.users[i].email === email) {
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

router.get('/login', function(req, res) {
	var email = req.query.email || null;
	var pass = req.query.password || null;

	var result = {
		success: true,
		message: "Login successful",
		access_token: null
	}

	if (!email || !pass) {
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
				result.message = "You are already Login";
			}
			isUserExist = true;
			
			break;
		}
	}

	if (!isUserExist) {
		result.message = "user not exist";
	} 

	res.end(JSON.stringify(result));
	fs.writeFileSync('./credential.json', JSON.stringify(data, null, 4));
	return result;
});

router.get('/logout', function(req, res) {
	var email = req.query.email;
	var access_token = req.query.access_token;

	result = {
		success: true,
		message: "logout successfully"
	}

	if(!email || !access_token) {
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
		result.success = false;
		result.message = "Wrong credentional";
	}

	res.end(JSON.stringify(result));
	fs.writeFileSync('./credential.json', JSON.stringify(data, null, 10));
	return result;
});

module.exports = router;