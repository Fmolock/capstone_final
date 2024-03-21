import { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
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

  useEffect(()=> {
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

  return (
    <>
      <h1>Acme Business Reviews</h1>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/businesses'>Businesses ({ businesses.length })</Link>
        <Link to='/users'>Users ({ users.length })</Link>
        {
          auth.id ? <Link to='/createReview'>Create Review</Link> : <Link to='/'>Register/Login</Link>
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
            businesses = { businesses }
            users = { users }
            reviews = { reviews }
          />
        } />
        <Route path='/businesses' element={<Businesses businesses={ businesses.map((business)=>{
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
        }) } />} />
        <Route path='/businesses/:id' element={<BusinessReviews/>}/>
        <Route path='/users' element={<Users users={ users}/>} />
        <Route path='/users/:id' element={<UsersReviews/>} />
        {
          !!auth.id && <Route path='/createReview' element={<CreateReview businesses={businesses} auth={auth}/>} />
        }
      </Routes>
    </>
  )
}

export default App
