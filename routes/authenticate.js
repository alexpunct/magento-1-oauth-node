var express = require('express');
var request = require('request');
var OAuth   = require('oauth-1.0a');
var crypto  = require('crypto');

var router = express.Router();

// validate that we have all the necessary data
function validate(reqParams) {
	var required = ['admin_url', 'admin_path', 'client_key', 'client_secret', 'user_type', 'oauth_callback'];
	required.forEach(function(key){
		if (!reqParams[key]) {
			return false;
		}
	});
	return true;
}

// convert a url string to a json object
function paramsToJson(string) {
	var hash;
	var myJson = {};
	var hashes = string.slice(string.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		myJson[hash[0]] = hash[1];
	}
	return myJson;
}

// build authentication request and redirect to the login page
router.post('/', function(req, res, next) {
	if (!validate(req.body)) {
		res.redirect('/error');
		return;
	}
  req.session.clientData = req.body;

	var oauth = OAuth({
		consumer: {
			key: req.body.client_key,
			secret: req.body.client_secret
		},
		signature_method: 'HMAC-SHA1',
		hash_function: function(base_string, key) {
			return crypto.createHmac('sha1', key).update(base_string).digest('base64');
		}
	});
	var request_data = {
		url: req.body.admin_url + 'oauth/initiate',
		method: 'POST',
		data: {
			oauth_callback: req.body.oauth_callback
		}
	};

	request({
		url: request_data.url,
		method: request_data.method,
		form: oauth.authorize(request_data)
	}, function(error, response, body) {
		if (response && response.statusCode === 200) {
			var jsonResponse = paramsToJson(response.body);
			req.session.clientData.secret = jsonResponse.oauth_token_secret;
			if (req.body.user_type === 'admin') {
				res.redirect(req.body.admin_url + req.body.admin_path + '/oauth_authorize?oauth_token=' + jsonResponse.oauth_token);
			} else {
				res.redirect(req.body.admin_url + 'oauth/authorize');
			}
			// res.send(jsonResponse);
 		} else {
			res.redirect('/error');
		}
	});
});

// exchange request token for access token
router.get('/', function(req, res, next) {
	var clientData = req.session.clientData;

	var oauth = OAuth({
		consumer: {
			key: clientData.client_key,
			secret: clientData.client_secret
		},
		signature_method: 'HMAC-SHA1',
		hash_function: function(base_string, key) {
			return crypto.createHmac('sha1', key).update(base_string).digest('base64');
		}
	});
	var request_data = {
		url: clientData.admin_url + 'oauth/token',
		method: 'POST',
		data: {
			oauth_verifier: req.query.oauth_verifier
		}
	};

	var token = {
		'key': req.query.oauth_token,
		'secret': clientData.secret
	};

	var formData = oauth.authorize(request_data, token);

	request({
		url: request_data.url,
		method: request_data.method,
		form: formData
	}, function(error, response, body) {
		if (response && response.statusCode === 200) {
			var jsonResponse = paramsToJson(response.body);
			req.session.api_url = clientData.admin_url;
			req.session.consumer_key = clientData.client_key;
			req.session.consumer_secret = clientData.client_secret;
			req.session.token = jsonResponse.oauth_token;
			req.session.token_secret = jsonResponse.oauth_token_secret;
			delete req.session.clientData;
			res.redirect('/success');
		} else {
			res.redirect('/error');
		}
	});
});

module.exports = router;
