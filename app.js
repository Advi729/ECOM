const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
const handlebarsIntl = require('handlebars-intl');
const Handlebars = require('handlebars');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache');
const moment = require('moment');

// earlier v.0.1
// const userRouter = require('./routes/userRoute');
// const productRouter = require('./routes/productRoute');
// const categoryRouter = require('./routes/categoryRoute');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');

const dbConnect = require('./config/db-connection');
const { notFound, errorHandler } = require('./middlewares/error-middleware');

const app = express();
app.use(nocache());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs.engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: `${__dirname}/views/layout/`,
    partialsDir: `${__dirname}/views/partials`,
  })
);

// Helper function for HBS files
Handlebars.registerHelper('first', (array) => array[0]);
Handlebars.registerHelper('second', (array) => array[1]);
Handlebars.registerHelper('inc', (value) => parseInt(value) + 1);
Handlebars.registerHelper('equal', (a, b) => a === b);
Handlebars.registerHelper('notEqual', (a, b) => a !== b);
Handlebars.registerHelper('index', (index) => index + 1);
Handlebars.registerHelper('lt', (a, b) => a < b);
Handlebars.registerHelper('greaterThan', (a, b) => a > b);
// Handlebars.registerHelper(helpers.comparison().lt);
Handlebars.registerHelper('moment', (dateValue, options) => {
  const format = options.hash.format || 'YYYY-MM-DD';
  const locale = options.hash.locale || 'en-in';
  return moment(dateValue).locale(locale).format(format);
});
// Handlebars.registerHelper('any', (array, value) => array.includes(value));
Handlebars.registerHelper('contains', function (array, value, options = {}) {
  console.log('array in helper: ', array);
  console.log('value in helper: ', value);
  if (array && array.indexOf(value) !== -1) {
    if (options.fn) {
      return options.fn(this);
    }
    return true;
  }
  if (options.inverse) {
    return options.inverse(this);
  }
  return false;
});

Handlebars.registerHelper('concat', function () {
  const args = Array.prototype.slice.call(arguments);
  args.pop(); // remove the options argument
  return args.join('');
});

Handlebars.registerHelper('isAfter', function (date1, date2, options = {}) {
  if (moment(date1).isAfter(date2)) {
    if (options.fn) {
      return options.fn(this);
    }
    return true;
  }
  if (options.inverse) {
    return options.inverse(this);
  }
  return false;
});

// Register handlebars-intl with the handlebars instance
handlebarsIntl.registerWith(Handlebars);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'secretkey',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

dbConnect();

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/category', categoryRouter);

// v.0.1
// app.use('/', userRouter);
// app.use('/product', productRouter);
// app.use('/category', categoryRouter);

// Handlebars.registerHelper("inc", function(value, options)
// {
//     return parseInt(value) + 1;
// });

app.use(notFound);
app.use(errorHandler);

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// // error handler
// app.use((err, req, res, next) => {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
