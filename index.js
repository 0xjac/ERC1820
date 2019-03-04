const deployment = require('./js/deployment');
const ERC820aRegistry = require('./js/artifacts')().contracts.ERC820aRegistry.ERC820aRegistry;
const { contractAddr } = deployment.generateDeployTx();

module.exports = {
  deploy: deployment.deploy,
  generateDeployTx: deployment.generateDeployTx,
  ERC820aRegistry: (web3, options = {}) => ERC820aRegistry.instance(web3, contractAddr, options)
};
