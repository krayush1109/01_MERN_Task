var express = require('express');
var router = express.Router();
const axios = require('axios')

const ProductCollection = require('../models/productSchema');

/* GET home page. */
router.get('/', function (req, res, next) {  
  res.render('index', { title: 'Express' });
});

router.get('/initialize-db', async (req, res) => {

  const API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

  try {
    const response = await axios.get(API_URL);
    const data = response.data;
    console.log(data);

    const db = new ProductCollection();

    await db.collection.deleteMany({})	

    await db.collection.insertMany(data);

    await db.save();

    res.status(200).send('Database initialized with seed data');   
  } catch (err) {
    console.log(err);
    res.render(err);
  }

})

router.get('/fetchParticular', async (req, res) => {
  try {    
    const products = await ProductCollection.find({ dateOfSale: { $exists: true } });

    products.map((item) => {
      const date = new Date(item.dateOfSale);
      const result = date.getMonth() + 1;

      console.log(item.dateOfSale, " ", result);
    })


    // res.send(200).send("Data Fetched Successfully");
    res.json(products);
  } catch (err) {
    console.log(err);
    // res.status(500).send('Error fetching data');
    res.send(err);
  }
})

// Fetch data based on the month
router.get('/products/:month', async (req, res) => {
  const month_inp = req.params.month;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthIndex_inp = monthNames.indexOf(month_inp) + 1;
  console.log("monthIndex_inp: ", monthIndex_inp);

  if (monthIndex_inp === -1) {
    return res.status(400).send('Invalid month');
  }

  try {
    const products = await ProductCollection.find({ dateOfSale: { $exists: true } });

    const month_products = products.filter((item) => {
      let date = new Date(item.dateOfSale);
      let monthOfSale = date.getMonth() + 1;

      if (monthOfSale == monthIndex_inp) {
        console.log("item.dateOfSale ", " ", item);        
        return item;
      }     

    })
    
    res.json(month_products);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching data');
  }
});

module.exports = router;
