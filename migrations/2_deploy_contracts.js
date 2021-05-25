const Token = artifacts.require('FairoxMembershipCoin.sol');

module.exports = async function (deployer, _network, addresses) {
  console.log("Deploying token...")
  await deployer.deploy(Token);
  const token = await Token.deployed()
  console.log("Token addr: " + token.address)
};
