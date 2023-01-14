const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('express-handlebars'); 
// const Handlebars= require('handlebars');  
const dotenv = require('dotenv').config();  
     
const userRouter = require('./routes/userRoute'); 
const productRouter = require('./routes/productRoute');
const categoryRouter = require('./routes/categoryRoute');

// const indexRouter = require('./routes/index');


const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
   
const app = express();  
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

dbConnect(); 

// app.use('/', indexRouter);

// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/category', categoryRouter);

app.use('/', userRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
 

// Handlebars.registerHelper("inc", function(value, options)
// {
//     return parseInt(value) + 1;
// });

app.use(notFound); 
app.use(errorHandler); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
