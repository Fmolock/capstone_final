const {
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
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

const isLoggedIn = async(req, res, next)=> {
  try{
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch(ex){
    next(ex);
  }
};


app.post('/api/auth/login', async(req, res, next)=> {
  try {
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/auth/register', async(req, res, next)=> {
  try {
    const user = await createUser(req.body);
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});



app.get('/api/auth/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/businesses', async(req, res, next)=> {
  try {
    res.send(await fetchBusinesses());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/businesses/:id', async(req, res, next)=> {
  try {
    res.send(await fetchBusinessReviews(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users/:id', async(req, res, next)=> {
  try {
    res.send(await fetchUsersReviews(req.params.id));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/reviews', async(req, res, next)=> {
  try {
    res.send(await fetchReviews());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/auth/reviews', async(req, res, next)=> {
  try {
    const user = await createReview(req.body);
    res.send(user);
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async()=> {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');

  const [moe, lucy, ethyl, curly] = await Promise.all([
    createUser({ username: 'moe', password: 'm_pw'}),
    createUser({ username: 'lucy', password: 'l_pw'}),
    createUser({ username: 'ethyl', password: 'e_pw'}),
    createUser({ username: 'curly', password: 'c_pw'})
  ]);
  
   const [walmart, target, kroger] = await Promise.all([
    createBusiness({ name: 'walmart', description: 'cheap'}),
    createBusiness({ name: 'target', description: 'dirty'}),
    createBusiness({ name: 'kroger', description: 'open late'}),
  ]);
  
  const reviews = await Promise.all([
    createReview({ user_id: moe.id, business_id: walmart.id, comment:'cheap', rating:3}),
    createReview({ user_id: curly.id, business_id: target.id, comment:'love it', rating:4}),
    createReview({ user_id: moe.id, business_id: kroger.id, comment:'hated it', rating:1}),
    createReview({ user_id: ethyl.id, business_id: walmart.id, comment:'cheap', rating:2}),
  ]);
  

  console.log(await fetchUsers());

  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();

