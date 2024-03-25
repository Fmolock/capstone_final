import AuthForm from './AuthForm';

const Home = ({ auth, authAction, logout, businesses, users, reviews })=> {
  return (
    <div>
      <h1>Home</h1>
      <p> 
        Display some interesting information about our { businesses.length } Businesses
        <br />
        Display some interesting information about our { users.length } Users
        <br />
        Display some interesting information about our { reviews.length } Reviews
      </p>
      {
        !auth.id ? <div className='row'>
          <AuthForm authAction={ authAction } mode='login'/>
          <AuthForm authAction={ authAction } mode='register'/>
          </div>
        : null 
      }
    </div>
  );
}


export default Home;
