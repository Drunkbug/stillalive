/**
 * Created by leyiqiang on 6/21/16.
 */
var mongoose = require("mongoose");
module.exports = function () {
    var WillSchema = require("./will.schema.server")();
    var connectionString = 'mongodb://localhost/stillalive';

    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }
    var connection = mongoose.createConnection(connectionString);
    var Will = connection.model("Will", WillSchema);


    var api = {
        createWill: createWill,
        findWillsByUserId: findWillsByUserId,
        findWillById: findWillById,
        updateWill: updateWill,
        deleteWill: deleteWill,
        reorderWill: reorderWill
    };

    return api;

    function createWill(userId, will) {
        will._client = userId;
        return Will.create(will);

    }

    function findWillsByUserId(userId) {
        return Will.find({_page: userId});
    }

    function findWillById(willId) {
        return Will.findOne({_id: willId});

    }

    function updateWill(willId, will) {
        delete will._id;
        return Will.findOneAndUpdate({_id: willId}, will);
    }

    function deleteWill(willId) {
        return Will.remove({_id: willId});
    }

    function reorderWill(userId, start, end) {
        start = parseInt(start);
        end = parseInt(end);
        return Will
            .find({_client: userId}, function (err, wills) {
                wills.forEach(function (will) {
                    if (start < end) {
                        if (will.order > start && will.order <= end) {
                            will.order--;
                            will.save();
                            console.log("1changed from " + (will.order + 1) + "to --")
                        } else if (will.order === start) {
                            will.order = end;
                            will.save();
                            console.log("2changed from " + (start) + "to" + end)

                        }
                    } else if (start > end) {
                        if (will.order >= end && will.order < start) {
                            will.order++;
                            will.save();
                            console.log("3changed from " + (will.order - 1) + "to ++")

                        }
                        else if (will.order === start) {
                            will.order = end;
                            will.save();
                            console.log("4changed from " + (start) + "to" + end)

                        }
                    }
                })
            });
    }

};