const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
// code below as example for deploying. if not -> else block
if (process.env.NODE_ENV) {
    secrets = process.env;
} else {
    secrets = require("../secrets.json");
}

// needed for communication with s3 storage api
const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.uploadS3 = (req, res, next) => {
    if (!req.file) {
        // stuff went wrong
        return res.sendStatus(500);
    } else {
        // all good
        const { filename, mimetype, size, path } = req.file; // information from file object that multer created on request
        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();

        promise
            .then(() => {
                //console.log("img in cloud!");
                next();

                // delete the file from temp storage in uploads directory
                fs.unlink(path, () => {
                    //      console.log("hola Señor!");
                });
            })
            .catch(console.log);
    }
};
