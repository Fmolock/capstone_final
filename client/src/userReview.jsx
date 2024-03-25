import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const UsersReviews = ({onDelete, auth, reviews})=> {
  const {id} = useParams();
  // const [reviews, setReviews] = useState([]);
  // useEffect(()=>{
  //     async function fetchBusinessReview(){
  //         const response = await fetch('api/users/'+ id)
  //         const data = await response.json();
  //         setReviews(data);
  //         console.log(data);
  //     };
  //     fetchBusinessReview();
  // }, []);
  return (
    <ul>
      { reviews
        .filter((review)=> review.user_id === id)
      .map((review)=>{
        return <li key= {review.id}>
          { review.comment } ({review.rating} rating) { auth.id === review.user_id &&<button onClick= {()=>{onDelete(review.id)}}>X</button>}
        </li>
      }) }
    </ul>
    
  );
}


export default UsersReviews;