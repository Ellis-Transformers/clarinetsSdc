const tables = require('./db.js');
const {Sequelize, QueryTypes} = require('sequelize');

const getMeta = async (product) => {
  let rateMetaQuery = ratingMeta(product)
  let recMetaQuery = recMeta(product)
  let charMetaQuery = charMeta(product)

  return Promise.all([rateMetaQuery, recMetaQuery, charMetaQuery]).then((results) => {
    const [rateResults, recResults, charResults] = results;
    let ratingObj = {};
    let recommendObj = {};
    const charsObj = {};
    for (let elem of rateResults) {
      ratingObj[elem.rating] = elem.rating_count;
    }
    for (let elem of recResults) {
      recommendObj[elem.recommend] = elem.count;
    }
    for (const x of charResults) {
      if (x['characteristic.name'] in charsObj) {
        let curr = charsObj[x['characteristic.name']];
        curr.count += 1;
        curr.sum += x.value;
        curr.value = curr.sum/curr.count;
      } else {
        charsObj[x['characteristic.name']] = {
          id: x.characteristic_id,
          value: x.value,
          count: 1,
          sum: x.value
        }
      }
    }
    console.log(charsObj)
    return {
      ratings: ratingObj,
      recommended: recommendObj,
      characteristics: charsObj
    }

  }).catch((error)=>{
    console.log('promise all error', error)
  })
}

const reviewFormat = (obj) => {
  let d = new Date(Number(obj.date));
  return {
    "review_id": obj.id,
    "rating": obj.rating,
    "summary": obj.summary,
    "recommend": obj.recommend,
    "response": obj.response,
    "body": obj.body,
    "date": d,
    "reviewer_name": obj.reviewer_name,
    "helpfulness": obj.helpfulness
  }
}

const getReviews = async (product, page = 1, count = 5) => {

  return tables.reviews.findAll({
    limit: count,
    offset: (page-1)*count,
    where: {
      product_id: product
    }
  }).then((data)=>{
    let resultObj = {
      "product": product,
      "page": (page-1)*count,
      "count": count
    }
    let arr = []
    for (let elem of data) {
      let photoArr = getPhotos(elem.dataValues.id)
      let obj = reviewFormat(elem.dataValues)
      obj.photos = photoArr
      arr.push(obj);
    }
    resultObj.results = arr;
    console.dir(resultObj)
    return resultObj;
  }).catch((err)=>{
    console.log('get reviews err', err)
  })
}

const ratingMeta = async (product) => {
  return tables.sequelize.query(`SELECT rating, COUNT(rating) as rating_count FROM reviews WHERE product_id = ${product} GROUP BY rating`, {type: QueryTypes.SELECT})

}

const recMeta = (product) => {
 return tables.sequelize.query(`SELECT recommend, COUNT(recommend) FROM reviews WHERE product_id = ${product} GROUP BY recommend`, {type: QueryTypes.SELECT})

}

const charMeta = async (product) => {
  return tables.char_reviews.findAll({
    include: [
      {
        model: tables.characteristics,
        attributes: ['product_id', 'name'],
        as: 'characteristic'
      }
    ],
    where: {
      '$characteristic.product_id$': product
    },
    raw: true
  })
}

const getPhotos = async (review) => {
  return await tables.reviews_photos.findAll({
    where: {
      review_id: review
    }
  }).then((data)=>{
    let arr = [];
    data.forEach((elem)=>{
      arr.push({
        id: elem.dataValues.id,
        url: elem.dataValues.url
      })
    })
    return arr
  }).catch((err)=>{console.log('ERR IN GETPHOTOS'); console.log(err)})
}

const newReview = async (obj) => {
  obj.reported = false;
  obj.helpfulness = 0;
  obj.reviewer_name = obj.name;
  obj.reviewer_email = obj.email;

  let newReview = tables.reviews.create(obj).then((data)=>{
    postPhotos(obj.photos, data.id);
    postChara(obj.characteristics, data.id);
  }).catch((err)=>{
    console.log(err)
  })
}

const helpfulReview = async (review) => {
  let helpCount = await tables.reviews.increment({helpfulness: 1}, {where: {id: review}})
}

const reportReview = async (review) => {
  let reported = await tables.reviews.update({reported: true}, {where: {id: review}})
}

const postPhotos = async (arr, review) => {
  for (let elem of arr) {
    elem.review_id = review;
  }
  tables.reviews_photos.bulkCreate(arr)
  .then((data)=>{console.log('post photo success')})
  .catch((err)=>{console.log(err)})
}

const postChara = async (obj, review) => {
  let arr = []
  for (const[key, value] of Object.entries(obj)){
    let curr = {characteristic_id: key, review_id: review, value: value}
    arr.push(curr)
  }

  tables.char_reviews.bulkCreate(arr)
    .then((data)=>{console.log('post chara')})
    .catch((err)=>{console.log(err)})
}

module.exports = {
  getMeta,
  helpfulReview,
  reportReview,
  newReview,
  getReviews
}