const express = require('express');
const cors = require('cors');

const app = express();
const contentApi = require('./routes/content');
const productsApi = require('./routes/products');
const authApi = require('./routes/auth');

const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

authApi(app);
contentApi(app);
productsApi(app);

app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(3000, () => {
  console.log('Listen on http://localhost:3000');
});