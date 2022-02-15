const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1",
});

exports.sendEmail = (address, subject, text) => {
    return ses
        .sendEmail({
            Source: "Flunky Chicken <vivacious.camp@spicedling.email>",
            Destination: {
                ToAddresses: [address],
            },
            Message: {
                Body: {
                    Text: {
                        Data: text,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch((err) => console.log(err));
};

// ses.sendEmail({
//     Source: "Flunky Chicken <vivacious.camp@spicedling.email>",
//     Destination: {
//         ToAddresses: ["vivacious.camp+123@spicedling.email"],
//     },
//     Message: {
//         Body: {
//             Text: {
//                 Data: "We can't wait to start working with you! Please arrive on Monday at 9:00 am. Dress code is casual so don't suit up.",
//             },
//         },
//         Subject: {
//             Data: "Your Application Has Been Accepted!",
//         },
//     },
// })
//     .promise()
//     .then(() => console.log("it worked!"))
//     .catch((err) => console.log(err));
