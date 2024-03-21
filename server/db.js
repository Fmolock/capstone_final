const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/fsa_app_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
if(JWT === 'shhh'){
  console.log('If deployed, set process.env.JWT to something other than shhh');
}

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    DROP TABLE IF EXISTS businesses;
    CREATE TABLE businesses(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(20) UNIQUE NOT NULL,
      description VARCHAR(255) NOT NULL
    );
    
    DROP TABLE IF EXISTS reviews;
    CREATE TABLE reviews(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      comment VARCHAR(255) NOT NULL,
      rating INTEGER NOT NULL,
      user_id UUID NOT NULL,
      business_id UUID NOT NULL
    );
  `;
  await client.query(SQL);
};

const createUser = async({ username, password})=> {
  if(!username || !password){
    const error = Error('username and password required!');
    error.status = 401;
    throw error;
  }
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};

const createBusiness = async({ name, description })=> {
  
  const SQL = `
    INSERT INTO businesses(name, description) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [ name, description]);
  return response.rows[0];
};


const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, username, password FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token };
};

const findUserWithToken = async(token)=> {
  let id;
  try{
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }
  catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchBusinesses = async()=> {
  const SQL = `
    SELECT id, name, description FROM businesses;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchBusinessReviews = async(id)=> {
  const SQL = `
    SELECT * FROM reviews WHERE business_id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

const fetchUsersReviews = async(id)=> {
  const SQL = `
    SELECT * FROM reviews WHERE user_id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

const createReview = async({comment, rating, user_id, business_id})=> {
  const SQL = `
    INSERT INTO reviews(id, comment, rating, user_id, business_id) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), comment, rating, user_id, business_id]);
  return response.rows;
};

const fetchReviews = async()=> {
  const SQL = `
    SELECT * FROM reviews;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  authenticate,
  findUserWithToken,
  fetchBusinesses,
  fetchReviews,
  createBusiness,
  createReview,
  fetchBusinessReviews,
  fetchUsersReviews
};
