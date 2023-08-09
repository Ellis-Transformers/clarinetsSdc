const model = require('../db/model.js');

exports.getMetaData = async (req,res) => {
  let result = await model.getMeta(req.query.product_id);
  res.status(200)
  res.send(result)
}

exports.putHelpful = (req,res) => {
  model.helpfulReview(req.params.review_id).then(()=>{
    res.status(204)
    res.send()
  }).catch((err)=>{
    console.log(err)
  })
}

exports.putReport = (req,res) => {
  model.reportReview(req.params.review_id).then(()=>{
    res.status(204)
    res.send()
  }).catch((err)=>{
    console.log(err)
  })
}

exports.postReview = (req,res) => {
  model.newReview(req.body);
  res.status(201)
  res.send()
}

exports.getReviewsData = async (req,res) => {
  let result = await model.getReviews(req.query.product_id, req.query.page, req.query.count);
  res.status(200)
  res.send(result)
}
