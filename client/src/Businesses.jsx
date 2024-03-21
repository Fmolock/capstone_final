import { Link } from 'react-router-dom';

const Businesses = ({ businesses })=> {
  return (
    <ul>
      { businesses.map((business)=>{
        return <li key= {business.id}><Link to={'/businesses/'+business.id}>{ business.name } ({business.avgRating} rating)</Link></li>
      }) }
    </ul>
  );
}


export default Businesses;
