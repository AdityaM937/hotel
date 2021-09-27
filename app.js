const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');

const morganBody = require('morgan-body');
const compression = require('compression');

const bodyParser = require('body-parser');

//const acl = require('express-acl');
const fileUpload = require('express-fileupload');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));
morganBody(app);
// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API 
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({
    type: [
        'application/json',
        'text/plain', // AWS sends this content-type for its messages/notifications
      ],
    limit: '50mb'
}));

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

//use for file uploads 
app.use(fileUpload({
    useTempFiles : true,
    parseNested: true
}));

//use for compress all respose body

app.use(compression());

app.use(express.urlencoded({
    extended: true
}));
const Routes = require('./routes/commonRoute')(app);
module.exports = app;