
const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config');
const { loginUser, addUser } = require('./controllers/userController');
const app = express();

app.use(bodyParser.json());

app.post('/users/login', loginUser);


app.post('/users', addUser);

app.listen(PORT, () => {
  console.log(`User service listening at http://localhost:${PORT}`);
});
