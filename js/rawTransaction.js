const contracts = require('./artifacts')().contracts;

const rawTransaction = {
  nonce: 0,
  gasPrice: 100000000000,
  value: 0,
  data: '0x' + contracts.ERC820aRegistry.ERC820aRegistry.bin,
  gasLimit: 800000,
  v: 27,
  r: '0x8208208208208208208208208208208208208208208208208208208208208200',
  s: '0x0820820820820820820820820820820820820820820820820820820820820820'
};

module.exports = rawTransaction;
