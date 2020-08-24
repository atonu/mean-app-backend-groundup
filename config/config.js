const config = require('./config.json');
var env = process.env.NODE_ENV || 'development';
var currentEnv = config[env];

Object.keys(currentEnv).forEach(key => process.env[key] = currentEnv[key]);
