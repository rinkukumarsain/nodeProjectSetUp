const devConfig = require('./dev.config');
const mongoose = require('mongoose');
mongoose.connect(devConfig.DB_URL).then(() => {
    console.log('database connected successfully');
}).catch((error) => {
    console.log('database connection failed', error);
});
