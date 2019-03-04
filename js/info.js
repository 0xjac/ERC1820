
const ERC820a = require('../index.js');

const res = ERC820a.generateDeployTx();

console.log("RawTx: ", res.rawTx);
console.log("Sender: ", res.sender);
console.log("Contract:", res.contractAddr);

setTimeout(() => {}, 200 );
