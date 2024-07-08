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


// API to list all transactions with search and pagination
router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const search = req.query.search || '';

    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          // Handle price as numeric search (if needed)          
        ]
      };
    }

    const totalCount = await ProductCollection.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);

    const transactions = await ProductCollection.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.json({
      transactions,
      page,
      perPage,
      totalPages,
      totalCount
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).send('Error fetching transactions');
  }
});


// API to fetch statistics for a selected month
router.get('/statistics/:month', async (req, res) => {
  const month = req.params.month;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthIndex = monthNames.indexOf(month);

  if (monthIndex === -1) {
    return res.status(400).send('Invalid month');
  }

  try {
    // Total sale amount of selected month
    const totalSaleAmount = await ProductCollection.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$dateOfSale" }, monthIndex + 1] }, // MongoDB month is 1-indexed
              // { $eq: [{ $year: "$dateOfSale" }, new Date().getFullYear()] } // Match current year
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $multiply: ["$quantity", "$price"] } }
        }
      }
    ]);

    // Total number of sold items of selected month
    const totalSoldItems = await ProductCollection.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$dateOfSale" }, monthIndex + 1] }, // MongoDB month is 1-indexed
              // { $eq: [{ $year: "$dateOfSale" }, new Date().getFullYear()] } // Match current year
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSold: { $sum: "$quantity" }
        }
      }
    ]);

    // Total number of not sold items of selected month
    const totalNotSoldItems = await ProductCollection.aggregate([
      {
        $match: {
          $or: [
            { dateOfSale: { $exists: false } }, // Products without a dateOfSale
            { dateOfSale: null },              // Products with null dateOfSale
            {
              $and: [
                { $ne: [{ $month: "$dateOfSale" }, monthIndex + 1] }, // MongoDB month is 1-indexed
                { $eq: [{ $year: "$dateOfSale" }, new Date().getFullYear()] } // Match current year
              ]
            }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalNotSold: { $sum: "$quantity" }
        }
      }
    ]);

    res.json({
      month: month,
      totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
      totalSoldItems: totalSoldItems.length > 0 ? totalSoldItems[0].totalSold : 0,
      totalNotSoldItems: totalNotSoldItems.length > 0 ? totalNotSoldItems[0].totalNotSold : 0
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).send('Error fetching statistics');
  }
});

module.exports = router;
