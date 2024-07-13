const { onRequest } = require("firebase-functions/v2/https");

exports.sayHello = onRequest(
  { cors: true },
  (req, res) => {
    res.status(200).send("Hello world!");
  }
);