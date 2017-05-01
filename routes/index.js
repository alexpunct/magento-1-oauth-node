var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var currentURL = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.render('index', {
    title: 'Magento oAuth',
    oauthCallback: currentURL + 'authenticate'
  });
});

module.exports = router;
