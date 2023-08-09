const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const {Products, ProductInfo, ProductStyles, ProductRelated, checkCache} = require('./controllers.js');



app.use(express.json());
//just use checkCache here within .use? come back to refactor

app.get('/api/products', checkCache, Products);
app.get('/api/products/:id', checkCache, ProductInfo);
app.get('/api/products/:id/styles', checkCache, ProductStyles);
app.get('/api/products/:id/related', checkCache, ProductRelated);

app.listen(process.env.PORT, () => {
  console.log(`Server hosted on PORT : ${process.env.PORT}`);
});







