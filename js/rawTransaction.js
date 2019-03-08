const fs = require('fs');
const ERC1820RegistryBin = fs.readFileSync(require('../contracts.json').contracts.ERC1820Registry.initDataFile);

const rawTransaction = {
  nonce: 0,
  gasPrice: 100000000000,
  value: 0,
  data: `0x${ERC1820RegistryBin}`,
  gasLimit: 800000,
  v: 27,
  r: '0x1820182018201820182018201820182018201820182018201820182018201820',
  s: '0x1820182018201820182018201820182018201820182018201820182018201820'
};

module.exports = rawTransaction;
