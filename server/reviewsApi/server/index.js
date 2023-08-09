const express = require("express");
const path = require("path");
const controller = require('./controller.js');

const app = express();
app.use(express.json());

app.post('/reviews/', controller.postReview)
app.get('/reviews/meta', controller.getMetaData)
app.get('/reviews/', controller.getReviewsData)
app.put('/reviews/:review_id/report', controller.putReport)
app.put('/reviews/:review_id/helpful', (controller.putHelpful))

// })

app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});