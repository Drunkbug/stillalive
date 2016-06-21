/**
 * Created by leyiqiang on 6/6/16.
 */
module.exports = function (app, models) {
    var willModel = models.willModel;

    var multer = require('multer'); // npm install multer --save
    var upload = multer({dest: __dirname + '/../../public/uploads'});

    app.post("/api/upload", upload.single('myFile'), uploadImage);
    app.post("/api/sa/:userId/will", createWill);
    app.get("/api/sa/:userId/will", findWillsByUserId);
    app.get("/api/will/:willId", findWillById);
    app.put("/api/will/:willId", updateWill);
    app.put("/api/will/:userId/will", reorderWill);
    app.delete("/api/will/:willId", deleteWill);

    function uploadImage(req, res) {
        var willId = req.body.willId;
        var userId = req.body.userId;
        var width = req.body.width;
        var myFile = req.file;
        if (myFile == null) {
            res.redirect("/assignment/index.html#/user/" + userId + "/will/" + willId);
            return;
        }
        var originalname = myFile.originalname; // file name on user's computer
        var filename = myFile.filename;     // new file name in upload folder
        var path = myFile.path;         // full path of uploaded file
        var destination = myFile.destination;  // folder where file is saved to
        var size = myFile.size;
        var mimetype = myFile.mimetype;
        for (var i in wills) {
            if (wills[i]._id == willId) {
                wills[i].url = "/uploads/" + filename;
            }
        }
        res.redirect("/assignment/index.html#/user/" + userId + "/will/" + willId);

    }

    function createWill(req, res) {
        var userId = req.body.userId;
        var will = req.body.will;
        willModel
            .createWill(userId, will)
            .then(
                function (will) {
                    res.json(will);
                },
                function (err) {
                    res.status(400).send(err);
                }
            );

    }

    function findWillsByUserId(req, res) {
        var userId = req.params.userId;
        willModel
            .findWillsByUserId(userId)
            .then(
                function (wills) {
                    res.json(wills);
                },
                function (err) {
                    res.status(404).send(err);
                }
            );
    }

    function findWillById(req, res) {
        var willId = req.params.willId;
        willModel
            .findWillById(willId)
            .then(
                function (will) {
                    res.json(will);
                },
                function (err) {
                    res.status(404).send(err);
                }
            );
    }

    function updateWill(req, res) {
        var willId = req.body.willId;
        var will = req.body.will;
        willModel
            .updateWill(willId, will)
            .then(
                function (will) {
                    res.json(will);
                },
                function (err) {
                    res.status(404).send(err);
                }
            )
    }

    function reorderWill(req, res) {
        var start = req.query["start"];
        var end = req.query["end"];
        var userId = req.params["userId"];

        willModel
            .reorderWill(userId, start, end)
            .then(
                function (will) {
                    res.send(will);
                },
                function (Err) {
                    res.status(400).send(err);
                }
            );
    }


    function deleteWill(req, res) {
        var willId = req.params.willId;
        willModel
            .deleteWill(willId)
            .then(
                function (status) {
                    res.json(200);
                },
                function (err) {
                    res.status(404).send(err);
                }
            );

    }

};