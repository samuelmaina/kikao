const app = require("./app");
const { MONGO_URI, PORT } = require("./config");
const { connectToDb } = require("./models/utils");

let server;

connectToDb(MONGO_URI)
  .then(() => {
    server = app.listen(PORT);
  })
  .catch((err) => console.log(err));

module.exports = server;