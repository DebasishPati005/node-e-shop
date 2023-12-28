import mongoose = require('mongoose');
import http = require('http');
import app from './src/app';

const MONGO_DB_URI = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@nodelearningcluster.fbds7im.mongodb.net/${process.env.DB_NAME}`;

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    const server = http.createServer(app);
    server.listen(process.env.PORT);
    console.log('DB is Connected and app is listening');
  })
  .catch((error) => {
    console.log(error);
  });
