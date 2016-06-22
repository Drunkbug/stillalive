/**
 * Created by leyiqiang on 6/21/16.
 */
var mongoose = require("mongoose");

module.exports = function () {
    var WillSchema = mongoose.Schema({
        _client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
        order: Number,
        name: String,
        toWhom: String,
        toContact: String,
        description: String,
        accountName: String,
        account: String,
        accountPwd:String,
        itemName: String,
        itemNumber: Number,
        itemWeight: Number,
        letterName: String,
        letterContent: String,
        pictureName: String,
        pictureUrl: String,
        textName: String,
        textContent: String,
        otherName: String,
        otherContent: String,
        willType: {
            type: String,
            enum: ['ACCOUNT', 'ITEM', 'LETTER', 'PICTURE', 'TEXT', 'OTHER']
        },
        dateCreated: {type: Date, default: Date.now}
    }, {collection: "stillalive.will"});

    return WillSchema;
};