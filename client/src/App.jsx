import { useState, useEffect } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import Users from './Users';
import Businesses from './Businesses';
import CreateReview from './CreateReview';
import Home from './Home';
import BusinessReviews from './BusinessReviews';
import UsersReviews from './userReview';

function App() {
  const [auth, setAuth] = useState({});
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  
const attemptLoginWithToken = async()=> {
      const token = window.localStorage.getItem('token');
      if(token){
        const response = await fetch(`/api/auth/me`, {
          headers: {
            authorization: token
          }
        });
        const json = await response.json();
        if(response.ok){
          setAuth(json);
        }
        else {
          window.localStorage.removeItem('token');
        }
      }
    };
  
  useEffect(()=> {
    
    attemptLoginWithToken();
  }, []);
  
  useEffect(() => {
    const fetchBusinesses = async() => {
      const response = await fetch(`/api/businesses`)
        const json = await response.json();
        setBusinesses(json);
    };
    fetchBusinesses();
  }, []);
  
    useEffect(() => {
    const fetchUsers = async() => {
      const response = await fetch(`/api/users`)
        const json = await response.json();
        setUsers(json);
    };
    fetchUsers();
  }, []);
  
    useEffect(() => {
    const fetchReviews = async() => {
      const response = await fetch(`/api/reviews`)
        const json = await response.json();
        setReviews(json);
    };
    fetchReviews();
  }, []);



  const authAction = async(credentials, mode)=> {
    const response = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if(response.ok){
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else {
      throw json;
    }
  };

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  };
  
  const handleDeleteReview = async (reviewId)=>{
    console.log(reviewId);
    const response = await fetch('/api/reviews/' + reviewId, {
      method: "DELETE"
    })
    const json = await response.json();
    if(response.ok){
      setReviews((prev)=>prev.filter((review)=>review.id !== reviewId));
    }
    else {
      throw json;
    }
  };
  
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
    const json = await response.json();
    console.log(json);
    if(response.ok){
      const review = json[0];
      setReviews((prev)=>prev.concat(review));
      navigate(`/businesses/${review.business_id}`);
    }
    else {
      throw json;
    }
  };
  
 const fullBusinesses =  businesses.map((business)=>{
          let total = 0;
          let count = 0;
          for(const review of reviews){
            if(review.business_id===business.id){
              total += review.rating
              count ++ 
            }
          }
          return {
            ...business,
            avgRating:  count > 0 ?  total / count : 0
          }
        }) 

  return (
    <>
      <h1>Acme Business Reviews</h1>
      <nav>
        <NavLink end to='/'>Home</NavLink>
        <NavLink to='/businesses'>Businesses ({ businesses.length })</NavLink>
        <NavLink to='/users'>Users ({ users.length })</NavLink>
        {
          auth.id ? <NavLink to='/createReview'>Create Review</NavLink> : <NavLink end to='/'>Register/Login</NavLink>
        }
     </nav>
    {
      auth.id && <button onClick={ logout }>Logout { auth.username }</button>
    }
      <Routes>
        <Route path='/' element={
          <Home
            authAction = { authAction }
            auth = { auth }
            businesses = { fullBusinesses }
            users = { users }
            reviews = { reviews }
            
          />
        } />
        <Route path='/businesses' element={<Businesses businesses={ fullBusinesses } />} />
        <Route path='/businesses/:id' element={<BusinessReviews reviews={reviews} auth={ auth } onDelete={handleDeleteReview}/>}/>
        <Route path='/users' element={<Users users={ users}/>} />
        <Route path='/users/:id' element={<UsersReviews reviews={reviews} auth={ auth } onDelete={handleDeleteReview}/>} />
        {
          !!auth.id && <Route path='/createReview' element={<CreateReview onCreate={createReview} businesses={businesses} auth={auth}/>} />
        }
      </Routes>
    </>
  )
}

export default App
