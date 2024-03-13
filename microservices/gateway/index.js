const express = require('express');
const bodyParser = require('body-parser');
const TokenVerifier = require('./middleware/TokenVerifier');
const RequestForwarder = require('./middleware/RequestForwarder');
const { PORT } = require('./config');
const app = express();

app.use(bodyParser.json());

const tokenVerifier = new TokenVerifier();
const requestForwarder = new RequestForwarder();

app.use('/notes', tokenVerifier.verify(true), requestForwarder.forward.bind(requestForwarder));

app.use('/users', requestForwarder.forward.bind(requestForwarder));

app.listen(PORT, () => {
  console.log(`Gateway service listening at http://localhost:${PORT}`);
});