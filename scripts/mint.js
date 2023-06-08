require("dotenv").config()
const API_URL = process.env.SEPHOLIA_URL
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../frontend/src/contracts/marketplace.json")
console.log(JSON.stringify(contract.abi))

const contractAddress = "0xEF53E36a045B23d4C16ABED8B8c0cd9f3c7ff430"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)


async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(process.env.PUBLIC_KEY, 'latest'); //get latest nonce

  //the transaction
    const tx = {
      'from': process.env.PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'data': nftContract.methods.mintNFT(process.env.PUBLIC_KEY, tokenURI).encodeABI()
    };

  const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log("Promise failed:", err)
    })
}

mintNFT("ipfs://QmV2nkuApEa94pvZ3cok3FixJwstWGHgCrFdx1Gj4iy9D3")
