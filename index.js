require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/router')
require('./dbConnection/connection');

const testServer = express();

// Middleware
testServer.use(cors());
testServer.use(express.json());

// Routes placeholder
testServer.use(router)

// testServer.use('/uploads', express.static('./uploads'));

// Port setup
const PORT = process.env.PORT || 3000;

testServer.listen(PORT, () => {
  console.log(`testServer started at port: ${PORT} and waiting for client request!!!`);
});

// Test route
testServer.get('/', (req, res) => {
  res.status(200).send(`<h1 style="color:red;">testServer started and waiting for client request!!!</h1>`);
});
