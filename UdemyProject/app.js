const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin.route');
const shopRoute = require('./routes/shop.route');
const authRoute = require('./routes/auth.route');
const errorRoute = require('./routes/error.route');
const path = require('path');
const User = require('./models/user.model');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoSessionConnect = require('connect-mongodb-session');
const MongoDBSessionStore = mongoSessionConnect(session);
const csrf = require('csurf');
const flashMessage = require('connect-flash');
const errorController = require('./controllers/error.controller');
const multer = require('multer');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const fileStorageInformation = multer.diskStorage({
  destination: (err, file, cb) => {
    cb(null, '/images');
  },
  filename: (err, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  multer({
    storage: fileStorageInformation,
    fileFilter: (err, file, cb) => {
      if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
  }).single('image')
);
app.use(express.static(path.join(__dirname, './public/css')));
app.use(
  '/images',
  express.static(path.join(__dirname, './images'))
);

const MONGO_DB_URI =
  `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.yvpr5b1.mongodb.net/${process.env.DB_NAME}`;

const mongoStore = MongoDBSessionStore({
  uri: MONGO_DB_URI,
  collection: 'sessions',
});

const csrfProtection = csrf();
app.use(
  session({
    secret: 'user authentication',
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);
app.use(csrfProtection);
// used to store error object
app.use(flashMessage());
// used to compress the response 
app.use(compression());
// used to add security protection to response header
app.use(helmet());
// used to log information of the request type response code etc
app.use(morgan("common"));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id).then((user) => {
    req.user = user;
    next();
  });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrf = req.csrfToken();
  next();
});

app.set('view engines', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));

app.use('/shop', shopRoute);
app.use('/admin', adminRoute);
app.use('/auth', authRoute);
app.use('/', errorRoute);

app.get('/', (req, res, next) => {
  const successFlash = req.flash('success');

  res.render('home.ejs', {
    path: '/',
    pageTitle: 'Main Page',
    successMessage: successFlash[0],
  });
});

app.get(errorController.get404);

app.use((err, req, res, next) => {
  console.log(err);
  res.redirect('/500');
});

mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log('db connected successfully');
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.log(error);
  });
