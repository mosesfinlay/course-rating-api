const chai = require("chai");
const expect = chai.expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

describe("User Routes", () => {
  const userRoutes = require("../src/routes/user");

  it("Should return the corresponding user document when a GET request is made to /api/users with correct credentials", done => {
    chai.request("http://localhost:5000")
      .get("/api/users")
      .set("Authorization", "Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==")
      .end((err, res) => {
        expect(res.body).to.have.own.property("_id");
        expect(res.body).to.have.own.property("fullName");
        expect(res.body).to.have.own.property("emailAddress");
        expect(res.body).to.have.own.property("password");
        expect(err).to.be.null;
        expect(res.unauthorized).to.be.false;
        done();
      });
  });

  it("Should return a 401 status error when a GET request is made to /api/users with invalid credentials", done => {
    chai.request("http://localhost:5000")
      .get("/api/users")
      .set("Authorization", "Basic badauth=")
      .end((err, res) => {
        expect(res.unauthorized).to.be.true;
        expect(res.statusCode).to.equal(401);
        done();
      });
  });
});