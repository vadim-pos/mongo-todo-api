const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // use native js promises
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };