import { useState } from 'react';

const CreateReview = ({ businesses, auth, onCreate })=> {
  const [business_id, setBusinessId] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  
  return (
    <div>
      <form onSubmit={(e)=>onCreate(e, comment, rating, business_id )}>
        <select required onChange={(e)=>setBusinessId(e.target.value)}>
          <option value="">Please Select a Business</option>
          { businesses.map((business)=>{
          return <option value={`${business.id}`} key= {business.id}>{business.name}</option>
          }) }
        </select>
        <textarea placeholder='comments' rows={5} onChange={(e)=>setComment(e.target.value)}/>
        <select required onChange={(e)=>setRating(e.target.value)}>
          <option value="">Please Select a Number</option>
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
