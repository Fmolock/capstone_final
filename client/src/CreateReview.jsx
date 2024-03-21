import { useState } from 'react';

const CreateReview = ({ businesses, auth })=> {
  const [business_id, setBusinessId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const createReview = async (e, comment, rating, business_id)=>{
    e.preventDefault();
    const response = await fetch('/api/auth/reviews', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        comment, 
        rating, 
        user_id:auth.id, 
        business_id
      })
    })
  };
  return (
    <div>
      <form onSubmit={(e)=>createReview(e, comment, rating, business_id )}>
        <select onChange={(e)=>setBusinessId(e.target.value)}>
          { businesses.map((business)=>{
          return <option value={`${business.id}`} key= {business.id}>{business.name}</option>
          }) }
        </select>
        <textarea placeholder='comments' rows={5} onChange={(e)=>setComment(e.target.value)}/>
        <select onChange={(e)=>setRating(e.target.value)}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
        <button>Create Review</button>
      </form>
    </div>
  );
}


export default CreateReview;
