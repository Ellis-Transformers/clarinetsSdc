import React, {useState, useEffect} from 'react';
import Rating from '@mui/material/Rating';
import API from '../../helpers/API.js';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


let RatingEntry = ({i, rating, totalRatings, addFilter, removeFilter, filter}) => {

  const [hovering, setHovering] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  const handleClick = (e) => {
    if (!clicked) {
      addFilter(i);
      setClicked(true);
    } else {
      removeFilter(i);
      setClicked(false);
    }
  }


  useEffect(() => {
    console.log('filter now', filter);
  }, [filter]);
  



  return (
    <div style={{display: 'flex', width: '20%', backgroundColor: filter.includes(i) ? 'silver' : 'white', cursor: 'pointer'}} onClick={handleClick} onMouseLeave={() => setHovering(false)} onMouseEnter={() => setHovering(true)}>{i} stars: <LinearProgress variant="determinate" value={rating/totalRatings*100} sx={{width:'30%'}} />
      ({rating})
    </div>
  )
}

export default RatingEntry;