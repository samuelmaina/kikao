const request = require("supertest");
const app = require("../../source/app");
const { connectToTestDb, disconnectFromTestDb } = require("../models/utils");
const { ensureEqual } = require("../utils/matchers");

let server;

exports.startApp = async (PORT) => {
  await connectToTestDb();
  server = app.listen(PORT);
  return server;
};
exports.closeApp = async () => {
  if (!server) {
    throw new Error("Server not started, hence can't close it");
  }
  server.close((err) => {
    if (err) {
      throw new Error(err);
      //although the server unlistened from the current port, it is still running,
      //and jest will warn of some unstopped operations.
    }
  });
  await disconnectFromTestDb();
};

exports.ensureResHasStatusCodeAndFieldData = (res, statusCode, key, value) => {
  ensureEqual(res.status, statusCode);
  expect(res.body).toHaveProperty(key, value);
};

exports.ensureResHasStatusCodeAndProp = (res, status, prop) => {
  ensureHasStatus(res, status);
  expect(res.body).toHaveProperty(prop);
};

exports.ensureHasStatusAndError = (res, status, error) => {
  ensureEqual(res.body.error, error);
  ensureHasStatus(res, status);
};

exports.ensureHasStatusAndMessage = (res, status, msg) => {
  ensureEqual(res.body.message, msg);
  ensureHasStatus(res, status);
};
function ensureHasStatus(res, status) {
  ensureEqual(res.status, status);
}

class Requester {
  constructor(app) {
    this.app = app;
  }
  async makePostRequest(url, body) {
    return await request(this.app).post(url).send(body);
  }
  async makeGetRequest(url) {
    return await request(this.app).get(url);
  }

  async makeAuthorizedPostRequest(url, token, body) {
    return await request(this.app)
      .post(url)
      .set("Authorization", token)
      .send(body);
  }

  async makeAuthorizedGetRequest(url, token) {
    return await request(this.app).get(url).set("Authorization", token);
  }
}

exports.Requester = Requester;