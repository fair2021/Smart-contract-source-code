const { id, mnemonic } = require('./secrets.json');
const Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = new Web3();

module.exports = {

  networks: {

    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },

    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${id}`)
      },
      network_id: 3,
      gas: 7000000,
      skipDryRun: true,
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${id}`)
      },
      network_id: 42,
      gas: 7000000,
      skipDryRun: true,
    },
    live: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${id}`)
      },
      network_id: 1,
      gas: 3000000,
      gasPrice: web3.utils.toWei('84', 'gwei'),

    }
  },
  compilers: {
    solc: {
      version: "0.7.6",
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }

  }
};


