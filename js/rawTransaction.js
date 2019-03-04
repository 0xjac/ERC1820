const contracts = require('./artifacts')().contracts;

const rawTransaction = {
  nonce: 0,
  gasPrice: 100000000000,
  value: 0,
  data: '0x' + contracts.ERC1820Registry.ERC1820Registry.bin,
  gasLimit: 800000,
  v: 27,
  r: '0x1820182018201820182018201820182018201820182018201820182018201820',
  s: '0x1820182018201820182018201820182018201820182018201820182018201820'
};

module.exports = rawTransaction;
