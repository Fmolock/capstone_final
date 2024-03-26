import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BusinessReviews = ( {auth, onDelete, reviews } )=> {
  const {id} = useParams();
  //finsihed
  //const [reviews, setReviews] = useState([]);
  // useEffect(()=>{
  //     async function fetchBusinessReview(){
  //         const response = await fetch('api/businesses/'+ id)
  //         const data = await response.json();
  //         setReviews(data);
  //         console.log(data);
  //     };
  //     fetchBusinessReview();
  // }, []);
  return (
    <ul>
      { reviews
        .filter((review)=> review.business_id === id)
      .map((review)=>{
        return <li key= {review.id}>
        { review.comment } ({review.rating} rating) { auth.id === review.user_id &&<button onClick= {()=>{onDelete(review.id)}}>X</button>}
        </li>
      }) }
    </ul>
    
  );
}


export default BusinessReviews;