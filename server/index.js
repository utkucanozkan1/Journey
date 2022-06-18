const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');

const app = express();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('mongo connected'))
  .catch((err) => console.log(err));
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

// ROUTES
app.use('/api/pins', pinRoute);
app.use('/api/users', userRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on  http://localhost:${port}`);
});
