import React, {useState, useEffect} from 'react';
import git_api from '../../../../config.js';
import ReviewsList from './ReviewsList.jsx';
import SortOptions from './SortOptions.jsx';
import RatingBreakdown from './RatingBreakdown.jsx';
import API from '../../helpers/API.js';

let RatingsReviews = ({product}) => {
  const [allReviews, setAllReviews] = useState([]);
  const [shownReviews, setShownReviews] = useState([]);
  const [reviewAmount, setReviewAmount] = useState(2);
  const [sortBy, setSortBy] = useState('relevant');
  const [ratings, setRatings] = useState({});
  const [filter, setFilter] = useState([]);

  const getReviews = () => {
    API.GET_REVIEWS(product.id, 1, 1000, sortBy).then((response) => {
      let reviews = response.data.results;
      if (filter.length > 0) {
        reviews = reviews.filter(review => filter.includes(review.rating));
      }
      setAllReviews(reviews);
      setShownReviews(reviews.slice(0, reviewAmount));
    }).catch((error) => {
      console.log(error);
    });
  }

  const getRatings = () => {
    API.GET_REVIEWS_META(product.id).then((response) => {
      setRatings(response.data);
    }).catch((error) => {
      console.log(error);
    })
  }

  const showMoreReviews = () => {
    setReviewAmount(reviewAmount+2);
  }

  const changeSortOrder = (value) => {
    setSortBy(value);
  }

  const addFilter = (star) => {
    if (!filter.includes(star)) {
      setFilter(filter => [...filter, star]);
    }
  }

  const removeFilter = (star) => {
    if (star === -1) {
      setFilter([]);
    } else if (filter.includes(star)) {
      let array = [...filter]; // make a separate copy of the array
      let index = array.indexOf(star)
      if (index !== -1) {
        array.splice(index, 1);
        setFilter(array);
      }
    }
  }

  useEffect(() => {
    getRatings();
  }, []);

  useEffect(() => {
    getReviews();
  }, [sortBy, filter]);

  useEffect(() => {
    setShownReviews(allReviews.slice(0, reviewAmount));
  }, [reviewAmount]);

  console.log('reviews parent', allReviews);

  console.log('ratings parent',ratings);


  return (
    <div style={{border: 'solid red'}}>
      <h1>Ratings & Reviews</h1>
      {ratings ? <RatingBreakdown ratings={ratings} addFilter={addFilter} removeFilter={removeFilter} filter={filter}/> 
      : <div></div>}
      <h3>Reviews for {product.name}</h3>
      <SortOptions sortBy={sortBy} changeSortOrder={changeSortOrder} />
      <ReviewsList shownReviews={shownReviews}/>

      {(reviewAmount < allReviews.length && allReviews.length > 2) ?
      <button onClick={showMoreReviews}>More reviews</button>
      : <div> All reviews displayed </div>}
    </div>);
};

export default RatingsReviews;