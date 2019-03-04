
const ERC1820 = require('../index.js');

const res = ERC1820.generateDeployTx();

console.log("RawTx: ", res.rawTx);
console.log("Sender: ", res.sender);
console.log("Contract:", res.contractAddr);

setTimeout(() => {}, 200 );
