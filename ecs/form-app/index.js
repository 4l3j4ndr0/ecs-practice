const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
const AWS = require('aws-sdk');
const app = express();
const s3 = new AWS.S3();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/health", (req, res) => {
    res.status(200).send('Service runing ok.')
});

app.post('/student', (req, res) => {
    const data = JSON.stringify(req.body);
    const params = {
        Bucket: process.env.BUCKET,
        Key: `${req.body.name}.json`,
        Body: data
    };
    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send(`Error saving data to S3: ${JSON.stringify(err)}`);
        } else {
            console.log(`Data saved to S3: ${JSON.stringify(data.Location)}`);
            res.send(`Data saved to S3 review the AWS console: ${JSON.stringify(data)}`);
        }
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on 3000");
});
