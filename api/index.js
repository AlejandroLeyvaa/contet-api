const express = require('express');
const app = express();

const contentApi = require('./routes/content')

app.use(express.json());

contentApi(app);

app.listen(3000, () => {
  console.log('Listen on http://localhost:3000');
});