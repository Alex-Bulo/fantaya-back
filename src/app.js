const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const getRouter = require('./routes/apiRoutes');



const app = express();

const allowedOrigins =['http://localhost:3000', 'http://fantaya.duckdns.org', 'http://proyecto-fantaya.duckdns.org']

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowedOrigins list or if it's undefined (e.g., a same-origin request)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,  // Enable credentials (cookies, authorization headers, etc.)
};

// Use the cors middleware with the configured options
app.use(cors(corsOptions));


app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 5000000 }));
app.use(cookieParser('Secret Cookies'));
app.use(express.static(path.join(__dirname, '../public')));



//routes
// app.use('/', getRouter);
app.use('/api', getRouter);



module.exports = app;
