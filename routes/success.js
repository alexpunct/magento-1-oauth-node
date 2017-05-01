var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (!req.session.token || !req.session.token_secret) {
    throw 'Cannot find token and secret :(';
  } else {
	  res.render('success', {
		  title: 'Success!',
		  api_url: req.session.api_url + 'api/rest/',
		  consumer_key: req.session.consumer_key,
		  consumer_secret: req.session.consumer_secret,
		  token: req.session.token,
		  token_secret: req.session.token_secret
	  });
  }
});

module.exports = router;
