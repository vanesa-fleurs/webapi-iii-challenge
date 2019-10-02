const express = require('express');

const server = express();

server.use(express.json());

//middleware
const posts = require('./posts/postRouter.js');
const users = require('./users/userRouter.js');

server.use(express.json());

server.use('/api/posts', posts);
server.use('/api/users', users);


//endpoints
server.get('/', (req, res) => {
    res.send(`
      <h2>Lambda WEP API III Challenge :)</h>
      <p>Blogposts... continued!</p>
    `);
});

module.exports = server;