var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/products', function(req, res) {
	fs.readFile("./data.json", 'utf8', function(err, data) {
		var products = JSON.parse(data).products;
		res.end(JSON.stringify(products));
	});
});

router.get('/searchProduct', function(req, res) {
	var productName = req.query.name || req.body.name || null;
	var productCategory = req.query.category || req.body.category || null;

	var content = fs.readFileSync("./data.json", "utf8");
	var data = JSON.parse(content);

	var result = [];

	for (var i = 0; i < data.products.length; i++) {
		if (productName && productCategory) {
			if(data.products[i].name === productName && data.products[i].category === productCategory) {
				result.push(data.products[i]);
			}
		} else if(productName) {
			if(data.products[i].name === productName) {
				result.push(data.products[i]);
			}
		} else if(productCategory) {
			if(data.products[i].category === productCategory) {
				result.push(data.products[i]);
			}
		}
	}

	if(!result.length) {
		result.push({sucess: false, msg: "product/category not found"});
	}

	res.end(JSON.stringify({results: result}));
});

router.post('/add', function(req, res, next) {
	var content = fs.readFileSync("./data.json", "utf8");
	var data = JSON.parse(content);

	var result = {
		success: true,
		message: "product added to list successfully"
	}
	
	var name = req.query.name || req.body.name || null;
	var category = req.query.category || req.body.category || null;
	var price = req.query.price || req.body.price || null;

	if(!name || !category || !price) {
		result.success = false;
		result.message = "Invalid Params";
		res.end(JSON.stringify(result));
		return result;
	}

	var newProduct = {
		name: name,
		category: category,
		price: Number(price)
	}

	newProduct.id = data.products[data.products.length-1].id + 1

	data.products.push(newProduct);

	fs.writeFileSync('./data.json', JSON.stringify(data, null, 4));
	res.end(JSON.stringify(result));
});

router.put('/edit/:id', function(req, res, next) {
	
	var productID = Number(req.query.id) || Number(req.body.id) || null;
	var name = req.query.name || req.body.name || null;
	var price = Number(req.query.price) || Number(req.body.price) || null;

	result = {
		success: true,
		message: "Item update successfully"
	}

	var content = fs.readFileSync("./data.json", "utf8");
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
		result.success = false;
		result.message = "Item not found";
		res.end(JSON.stringify(result));	
		return result;
	}

	fs.writeFileSync('./data.json', JSON.stringify(data, null, 4));
	res.end(JSON.stringify(result));
});

router.delete('/deleteProduct/:id', function(req, res, next) {
	var productID = req.params.id;
	var content = fs.readFileSync("./data.json", "utf8");
	var data = JSON.parse(content);

	for (var i = 0; i < data.products.length; i++) {
		if(data.products[i].id === Number(productID)) {
			data.products.splice(i, 1);
			break;
		}
	}

	fs.writeFileSync('./data.json', JSON.stringify(data, null, 4));
});

module.exports = router;

/*var server = app.listen(8081, 'localhost', function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Host - ', host, ' Port - ', port);
});*/


