const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
// const type = require('../data/type.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this protected route, we get the user's id like so: ${req.dessertsId}`
  });
});

app.get('/desserts', async (req, res)=>{
  try{
    const data = await client.query('SELECT * from desserts;');
    res.json(data.rows);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/desserts', async (req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO desserts 
    (name, icing, type_id) 
    VALUES ($1, $2, $3)
    RETURNING * `, [
      req.body.name,
      req.body.icing,
      req.body.type_id
    ]);
    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/types', async (req, res) => {
  try {
    const data = await client.query('SELECT * from types;');
    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/desserts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const data = await client.query(`SELECT desserts.id,
        desserts.name,
        desserts.icing,
        desserts.type_id
        FROM desserts INNER JOIN types
        ON desserts.type_id=types.id
        WHERE desserts.id = $1
        ORDER BY types.id;`, [id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.put('/desserts', async (req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO desserts 
    (name, icing, type_id) 
    VALUES ($1, $2, $3)
    RETURNING * `, [
      req.body.name,
      req.body.icing,
      req.body.type_id
    ]);
    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.post('/desserts/:id', async (req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO desserts 
    (name, icing, type_id) 
    VALUES ($1, $2, $3)
    RETURNING * `, [
      req.body.name,
      req.body.icing,
      req.body.type_id
    ]);
    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.delete('/desserts/:id', async (req, res) => {
  try {
    const data = await client.query(`
    DELETE FROM desserts WHERE id=$1
    RETURNING *`, [
      req.params.id
    ]
    );
    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));
module.exports = app;
