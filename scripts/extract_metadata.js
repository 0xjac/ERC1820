const artifacts = require('../js/artifacts')();
const metadata = JSON.parse(artifacts.contracts.ERC820aRegistry.ERC820aRegistry.metadata);

console.log(JSON.stringify(metadata, null, 2));
