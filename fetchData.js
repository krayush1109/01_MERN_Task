console.log("app is working");
const axios = require('axios')

const API_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

async function  fetchData () {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

fetchData();