const deployment = require('./js/deployment');
const ERC1820Registry = require('./js/artifacts')().contracts.ERC1820Registry.ERC1820Registry;
const { contractAddr } = deployment.generateDeployTx();

module.exports = {
  deploy: deployment.deploy,
  generateDeployTx: deployment.generateDeployTx,
  ERC1820Registry: (web3, options = {}) => ERC1820Registry.instance(web3, contractAddr, options)
};
