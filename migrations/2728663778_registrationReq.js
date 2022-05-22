const RegistrationReq= artifacts.require("RegistrationReq");

module.exports = function(_deployer) {
  _deployer.deploy(RegistrationReq);
};