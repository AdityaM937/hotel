const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');
const jwt=require('./utils/jwtToken');
const bcryptjs = require('bcryptjs');
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
morganBody(app);
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

// var verifyjwtToken = (req, res, next) => {
//     var token = req.headers['authorization'];
//     jwt.verifyWebToken(token).then((data)=>{
//         req.decoded = data;
//         console.log(data);
//         next();
//     }).catch(err => {
//         res.statuscode = 401
//         return res.send('UNAUTHORIZED!!!');
//     });
// }

var verifyjwtToken = async (req,res,next) => {

    const token = req.headers['authorization'];
    jwt.jwtVerifyToken(token).then(function(data){
        req.decoded = data;
        console.log(data);
        next();
    }).catch(function(err){
        res.statusCode = 401;
        return res.send('UNAUTHORIZED!');
    });
}

const Routes = require('./routes/commonRoute')(app,verifyjwtToken);
module.exports = app;


process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});


process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

