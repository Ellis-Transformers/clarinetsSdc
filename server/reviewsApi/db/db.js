require("dotenv").config();
const postgres = require('pg');
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: 'postgresql',
    host: process.env.DB_HOST,
    port: 5432
  }
)

const testDbConnection = async () => {
  console.log(
    'user is', process.env.DB_USER)
};

const reviews = sequelize.define('reviews',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {type: Sequelize.INTEGER},
  rating: {type: Sequelize.INTEGER},
  date : {type: Sequelize.BIGINT},
  summary: {type: Sequelize.TEXT},
  body: {type: Sequelize.TEXT},
  recommend: {type: Sequelize.BOOLEAN},
  reported: {type: Sequelize.BOOLEAN},
  reviewer_name: {type: Sequelize.TEXT},
  reviewer_email: {type: Sequelize.TEXT},
  response: {type: Sequelize.TEXT, allowNull: true},
  helpfulness: {type: Sequelize.INTEGER},

},{timestamps: false,
  indexes: [
    {
      fields: ['product_id']
    }
  ]});

const reviews_photos = sequelize.define('reviews_photos',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  review_id: {
    type: Sequelize.INTEGER,
    references: {
      model: reviews,
      key: 'id'
    }
  },
  url: {type: Sequelize.TEXT}
},{tableName: 'reviews_photos', timestamps: false});

const characteristics = sequelize.define('characteristics', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.TEXT
  }
}, { timestamps: false,
  indexes: [
  {
    fields: ['product_id']
  }
]});

const char_reviews = sequelize.define('characteristic_reviews', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  characteristic_id: {
    type: Sequelize.INTEGER,
    references: {
      model: characteristics,
      key: 'id'
    }
  },
  review_id: {
    type: Sequelize.INTEGER
  },
  value: {
    type: Sequelize.INTEGER
  }
}, { tableName: 'characteristic_reviews', timestamps: false });

characteristics.hasMany(char_reviews, { foreignKey: 'id'});
char_reviews.belongsTo(characteristics, { foreignKey: 'characteristic_id', as : 'characteristic' });

const testChar = () => {
  return characteristics.findOne({
    where: {
      id: 18
    }
  }
  )
  //18 6 size
}
const testCharReview = () => {
  return char_reviews.findOne(
    {
      where: {
        id: 84
      }
    }
  )
  //84, 45, 25, 2
}
const testReviews = () => {
  return reviews.findOne(
    {
      where: {
        id: 70
      }
    }
  )
  //70 21 3 1599633180654 Quia velit ... consectetur ad id
}
const testPhotos = () => {
  return reviews_photos.findOne(
    {
      where: {
        id: 57
      }
    }
  )
}
  //57 103, 1548... 664&q-80

// testCharReview()
//   .then((data)=>{
//     console.log('IN TESTCHAR REVIEW');
//     console.log(data);
//   })
//   .catch((err)=>{
//     console.log('caught ERROR testChar REVIEW');
//     console.log(err);
//   })

// testDbConnection();
module.exports = {
  sequelize,
  char_reviews,
  characteristics,
  reviews,
  reviews_photos
}