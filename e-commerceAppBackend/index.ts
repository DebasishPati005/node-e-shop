import mongoose = require('mongoose');
import http = require('http');
import app from './src/app';

const MONGO_DB_URI = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@nodelearningcluster.fbds7im.mongodb.net/${process.env.DB_NAME}`;

console.log(MONGO_DB_URI);

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log(`DB connected successfully!.\nServer is listening at ${process.env.PORT}`);
    const server = http.createServer(app);
    server.listen(process.env.PORT);
  })
  .catch((error) => {
    console.log(error);
  });
