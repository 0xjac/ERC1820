const artifacts = require('../js/artifacts')();
const metadata = JSON.parse(artifacts.contracts.ERC1820Registry.ERC1820Registry.metadata);

console.log(JSON.stringify(metadata, null, 2));
