const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars');
// const Handlebars= require('handlebars');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const nocache = require('nocache');

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
    cookie: { secure: true, maxAge: 1000 * 60 * 60 * 24 },
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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
