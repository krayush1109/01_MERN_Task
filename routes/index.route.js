var express = require('express');
var router = express.Router();
const axios = require('axios')

const ProductCollection = require('../models/productSchema');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/initialize-database');

  // res.render('index', { title: 'Express' });
});

router.get('/initialize-database', async (req, res) => {

  const API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

  try {
    const response = await axios.get(API_URL);
    const data = response.data;
    console.log(data);

    const productCollection = new ProductCollection();

    productCollection.collection.insertMany(data);

    await productCollection.save();

    // res.status(200).send('Database initialized with seed data');

    res.render('index', { title: "Express" })

  } catch (err) {
    console.log(err);
  }

})


module.exports = router;
