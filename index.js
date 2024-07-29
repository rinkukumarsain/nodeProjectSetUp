const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
require('dotenv').config();
const devConfig = require('./src/config/dev.config');
require('./src/config/db.config');
global.c = console.log.bind(console);

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use((req, res, next) => {
    console.log(req.method, req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log('body :', req.body, 'query :', req.query);
    req.date = new Date();
    next();
});
/* version V1 Routes */
require('./src/app/routes')(app);
// require('./src/admin/routes')(app);

// set port, listen for request s
const PORT = devConfig.PORT || 6262;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});