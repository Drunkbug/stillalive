/**
 * Created by leyiqiang on 6/21/16.
 */
/**
 * Created by leyiqiang on 6/6/16.
 */
module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.disconnect();

    var connectionString = 'mongodb://127.0.0.1:27017/test'; // for local
    if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
       var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
       var password = process.env.MLAB_PASSWORD_WEBDEV;
       connectionString = 'mongodb://' + username + ':' + password;
       connectionString += '@ds249565.mlab.com:49565/heroku_db9n72q4'; 
    }

    mongoose.connect(connectionString);


    var userSaModel = require("./user/user.model.server.js")();
    var willSaModel = require("./will/will.model.server.js")();




    var models = {
        userModel: userSaModel,
        willModel: willSaModel
    };

    return models;
};