import { Link } from 'react-router-dom';

const Users = ({ users })=> {
  return (
    <ul>
      { users.map((user)=>{
        return <li key= {user.id}><Link to={'/users/'+user.id}>{ user.username } </Link></li>
      }) }
    </ul>
  );
}


export default Users;
