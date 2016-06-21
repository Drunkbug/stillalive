/**
 * Created by leyiqiang on 6/21/16.
 */
module.exports = function () {
    var mongoose = require("mongoose");
    var connectionString = 'mongodb://localhost/stillalive';

    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }
    var connection = mongoose.createConnection(connectionString);

    var UserSchema = require("./user.schema.server")();
    var User = connection.model("User", UserSchema);


    var api = {
        createUser: createUser,
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        findUserById: findUserById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        updateUserDate: updateUserDate
    };

    return api;


    function createUser(user) {
        return User.create(user);
    }

    function updateUserDate(id) {
        return User.update(
            {_id: id},
            {
                $set: {
                    dateUpdated: new Date()
                }

            });
    }
    function findUserByCredentials(username, password) {
        return User.findOne({username: username, password: password});
    }

    function findUserByUsername(username) {
        return User.findOne({username: username});
    }

    function findUserById(userId) {
        // User.find({_id:userId});
        return User.findById(userId);
    }

    function updateUser(id, newUser) {
        return User.update(
            {_id: id},
            {
                $set: {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    phone: newUser.phone,
                    emergencyContact: newUser.emergencyContact,
                    emergencyPhone: newUser.emergencyPhone
                }

            });
    }

    function deleteUser(userId) {
        return User.remove({_id: userId});
    }

    function findFacebookUser(id) {
        return User.findOne({'facebook.id': id});
    }
};