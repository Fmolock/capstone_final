import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const UsersReviews = ()=> {
  const {id} = useParams();
  const [reviews, setReviews] = useState([]);
  useEffect(()=>{
      async function fetchBusinessReview(){
          const response = await fetch('api/users/'+ id)
          const data = await response.json();
          setReviews(data);
          console.log(data);
      };
      fetchBusinessReview();
  }, []);
  return (
    <ul>
      { reviews.map((review)=>{
        return <li key= {review.id}>{ review.comment } ({review.rating} rating)</li>
      }) }
    </ul>
    
  );
}


export default UsersReviews;