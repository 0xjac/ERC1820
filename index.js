const deployment = require('./js/deployment');
const ERC1820Registry = require('./artifacts/contracts/js/ERC1820Registry');
const { contractAddr } = deployment.generateDeployTx();

module.exports = {
  deploy: deployment.deploy,
  generateDeployTx: deployment.generateDeployTx,
  ERC1820Registry: (eth) => new ERC1820Registry.instance(eth, contractAddr)
};
