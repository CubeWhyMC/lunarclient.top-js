let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let apiRouter = require('./routes/api');
let userRouter = require('./routes/users');
const {websiteConfig} = require("./config");

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger("[:date[clf]] :method :url :status :response-time ms - :res[content-length]"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(websiteConfig.users.secret));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/api', apiRouter);

app.options('*', (req, res, next) => {
    // 允许所有来源（跨域请求）
    res.setHeader('Access-Control-Allow-Origin', '*')
    // 允许携带的请求头
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    next()
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    if (req.method !== "GET") {
        res.json(err)
        return
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
