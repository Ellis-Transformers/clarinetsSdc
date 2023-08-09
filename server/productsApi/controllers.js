const {getProductById, getProducts, getStylesOfProduct, getRelatedProductIds} = require('./models.js');
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient();



redisClient.connect().then((response) => {
  console.log('Connected to redis');
});

const defaultExpiration = 600;//seconds


const checkCache = (req, res, next) => {
  const cacheKey = req.url;
  redisClient.get(cacheKey)
    .then((cachedData) => {
      if (cachedData !== null) {
        const parsedData = JSON.parse(cachedData);
        console.log(`Loaded from cache : ${req.url}`);
        return res.json(parsedData);
      }
      next();
    })
    .catch((error) => {
      console.error('Error in checkCache:', error);
      next();
    });
};

let cacheForMe = (key, whatToCatche) => {
  redisClient.set(key, JSON.stringify(whatToCatche), 'EX', defaultExpiration).then((response) => {
    console.log(`Cached ${key}`);
  }).catch((error) => {
    console.log(error);
  });
};

let Products = async (req, res) => {
    try {
      const products = await getProducts(req.query.page, req.query.count);
      res.send(products);
      cacheForMe(req.url, products);           

    } catch (error) {
      console.error('Error:', error);
      res.send('');
    }

};

let ProductInfo = async (req, res) => {
    try {
      const products = await getProductById(req.params.id);
      res.send(products);
      cacheForMe(req.url, products)   
    } catch (error) {
      console.error('Error:', error);
      res.send('');
    }

  };
let ProductStyles = async (req, res) => {
    try {
      const products = await getStylesOfProduct(req.params.id);
      res.send(products);
      cacheForMe(req.url, products)    
    } catch (error) {
      console.error('Error:', error);
      res.send('');
    }

  };

let ProductRelated = async (req, res) => {
    try {
      const products = await getRelatedProductIds(req.params.id);
      res.send(products);
      cacheForMe(req.url, products)      
    } catch (error) {
      console.error('Error:', error);
      res.send('');
    }
  };

module.exports = {
    Products,
    ProductInfo,
    ProductStyles,
    ProductRelated,
    checkCache

}