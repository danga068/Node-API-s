var express = require('express');
var router = express.Router();
var fs = require('fs');


var isValidToken = function(email, accessToken) {
	var content = fs.readFileSync("./credential.json", "utf8");
	var creds = JSON.parse(content);

	var isValid = false;

	for (var i = 0; i < creds.users.length; i++) {
		if(creds.users[i].email === email && accessToken !== null && creds.users[i].access_token === accessToken) {
			isValid = true;
			break;
		}
	}
	return isValid;
}

var unauthorisedJson = {
	code: 401,
	success: false,
	message: "not authorised"
}

router.get('/products', function(req, res) {
	var token = req.headers.access_token || null;
	var email = req.headers.email || null;

	if (!isValidToken(email, token)) {
		res.end(JSON.stringify(unauthorisedJson));
		return unauthorisedJson;
	}

	var result = {
		code: 200,
		success: true,
		message: "List of products",
		products: null
	}

	var content = fs.readFileSync("./products.json", "utf8");
	result.products = JSON.parse(content).products;

	res.end(JSON.stringify(result));
	return result;
});

router.get('/search', function(req, res) {

	var token = req.headers.access_token || null;
	var email = req.headers.email || null;

	var productName = req.query.name || null;
	var productCategory = req.query.category || null;

	if (!isValidToken(email, token)) {
		res.end(JSON.stringify(unauthorisedJson));
		return unauthorisedJson;
	}

	var content = fs.readFileSync("./products.json", "utf8");
	var productsList = JSON.parse(content).products;

	var result = {
		code: 200,
		success: true,
		message: "List of product/category",
		products: []
	};

	for (var i = 0; i < productsList.length; i++) {
		if (productName && productCategory) {
			if(productsList[i].name === productName && productsList[i].category === productCategory) {
				result.products.push(productsList[i]);
			}
		} else if(productName) {
			if(productsList[i].name === productName) {
				result.products.push(productsList[i]);
			}
		} else if(productCategory) {
			if(productsList[i].category === productCategory) {
				result.products.push(productsList[i]);
			}
		}
	}

	if (!result.products.length) {
		result.code = 404;
		result.success = false;
		result.message = "product/category not found";
		res.end(JSON.stringify(result));
		return result;
	}

	res.end(JSON.stringify(result));
});

router.post('/add', function(req, res, next) {

	var token = req.headers.access_token || null;
	var email = req.headers.email || null;

	var name = req.body.name || null;
	var category = req.body.category || null;
	var price = req.body.price || null;
	
	if (!isValidToken(email, token)) {
		res.end(JSON.stringify(unauthorisedJson));
		return unauthorisedJson;
	}

	if(!name || !category || !price) {
		result.success = false;
		result.message = "Invalid Body parameters";
		res.end(JSON.stringify(result));
		return result;
	}

	var result = {
		code: 200,
		success: true,
		message: "product " + name +" added to category " + category + " successfully"
	}

	var content = fs.readFileSync("./products.json", "utf8");
	var data = JSON.parse(content);

	var newProduct = {
		name: name,
		category: category,
		price: Number(price)
	}

	newProduct.id = data.products[data.products.length-1].id + 1

	data.products.push(newProduct);

	fs.writeFileSync('./products.json', JSON.stringify(data, null, 4));
	res.end(JSON.stringify(result));
	return result;
});

router.put('/:id', function(req, res, next) {
	var token = req.headers.access_token || null;
	var email = req.headers.email || null;

	var productID = Number(req.params.id) || null;
	var name = req.body.name || null;
	var category = req.body.category || null;
	var price = Number(req.body.price) || null;

	if (!isValidToken(email, token)) {
		res.end(JSON.stringify(unauthorisedJson));
		return unauthorisedJson;
	}

	result = {
		code: 200,
		success: true,
		message: "product update successfully"
	}

	if (!name && !category && !price) {
		result.code = 402;
		result.success = false;
		result.message = "Invalid body parameters";
		res.end(JSON.stringify(result));
	}

	var content = fs.readFileSync("./products.json", "utf8");
	var data = JSON.parse(content);

	var isItemExist = false;
	for (var i = 0; i < data.products.length; i++) {
		if(data.products[i].id === productID) {
			var product = data.products[i];
			product.name = name ? name : product.name;
			product.price = price ? price : product.price;
			data.products[i] = product;
			isItemExist = true;
			break;
		}
	}

	if( !isItemExist ) {
		result.code = 404;
		result.success = false;
		result.message = "Item not found";
		res.end(JSON.stringify(result));	
		return result;
	}

	fs.writeFileSync('./products.json', JSON.stringify(data, null, 4));
	res.end(JSON.stringify(result));
});

router.delete('/:id', function(req, res, next) {
	var token = req.headers.access_token || null;
	var email = req.headers.email || null;

	var productID = req.params.id || null;

	if (!isValidToken(email, token)) {
		res.end(JSON.stringify(unauthorisedJson));
		return unauthorisedJson;
	}

	var result = {
		code: 404,
		success: false,
		message: "Invalid product id"
	}

	if (!productID) {
		res.end(JSON.stringify(result));
		return result;
	}

	productID = Number(productID);
	var content = fs.readFileSync("./products.json", "utf8");
	var data = JSON.parse(content);

	var isProductExist = false;
	for (var i = 0; i < data.products.length; i++) {
		if(data.products[i].id === Number(productID)) {
			data.products.splice(i, 1);
			isProductExist = true;
			break;
		}
	}

	if (!isProductExist) {
		result.message = "Product doesn't exist";
		res.end(JSON.stringify(result));
		return result;
	}

	fs.writeFileSync('./products.json', JSON.stringify(data, null, 4));

	result.code = 200;
	result.message = "Product deleted successfully";
	res.end(JSON.stringify(result));
	return result;
});

module.exports = router;

