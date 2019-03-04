const ethTx = require('ethereumjs-tx');
const ethUtils = require('ethereumjs-util');
const rawTransaction = require('../js/rawTransaction');

const offset = parseInt(process.argv[2]);
const batchsize = parseInt(process.argv[3]);

for (let i = 0; i < batchsize; i++) {
  const code = ('0x' +
    require(`../tmp/${i}/artifacts/combined.json`).contracts['./contracts/ERC820aRegistry.sol:ERC820aRegistry'].bin);
  const tx = new ethTx({...rawTransaction, data: code});
  const contractAddr = ethUtils.toChecksumAddress(
    ethUtils.generateAddress(tx.getSenderAddress(), ethUtils.toBuffer(0)).toString('hex')
  );
  if (contractAddr.startsWith('0x820')) {
    console.log(`${offset + i} -> ${contractAddr}`);
  }
}
