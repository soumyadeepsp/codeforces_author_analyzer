var express = require('express');
var port = 8080;
var app = express();
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));
app.use('/', require('./routes'));

app.listen(port, function(err) {
    console.log('server is running');
    if (err) {
        console.log(err);
    }
})