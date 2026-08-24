const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user-route');
const authRoutes = require('./routes/auth-route');

const app = express();

// security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// parse JSON request bodies
app.use(express.json());

// parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Heats api is running',
  });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
