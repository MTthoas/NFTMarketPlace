import express from 'express';
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import MarketPlaceController from './controllers/marketPlaceController';
import cors from 'cors'; // Importez le middleware cors
import cron from 'node-cron';
import path from 'path';

import { ethers } from 'ethers';

import fs from 'fs';
require('dotenv').config();

const app = express();
const port = 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const contractsPath = path.join(__dirname, './contracts/contracts.json');
const data = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));

const alchemyProviderUrl = process.env.SEPHOLIA_URL;
const provider = new ethers.providers.JsonRpcProvider(alchemyProviderUrl);

const contract = new ethers.Contract(data.NFTMarket.address, data.NFTMarket.abi, provider);
const myNFT = new ethers.Contract(data.MyNFT.address, data.MyNFT.abi, provider);

cron.schedule('* * * * *', async () => {
  console.log('Running a job every minute');
  const saleTokens = await contract.getAllSales();
  console.log(saleTokens)
  for (let i = 0; i < saleTokens.length; i++) {
      const tokenId = saleTokens[i];
      console.log("verifying token ID: " + tokenId + "...")
      if (await contract.isAuctionEnded(tokenId)) {

          console.log("auction management...")

          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ACCOUNT, provider);
          const contractWithSigner = contract.connect(wallet);

          console.log("Connected to contract with signer")

          try{
            const tx = await contractWithSigner.endAuction(tokenId);
            console.log("Waiting for transaction to be mined...");
            const receipt = await tx.wait();
            console.log("Transaction Mined:", receipt);
          } catch (error) {
            console.error("Failed to end auction for token ID: " + tokenId, error)
          }
      }else{

        if(await contract.isSalesEnded(tokenId)){

          console.log("sales management...")

          const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ACCOUNT, provider);
          const contractWithSigner = contract.connect(wallet);
          
          try{

            const transaction = await myNFT.getTokenData(tokenId);

            const owner = transaction[4];

            console.log(owner)

            const tx = await contractWithSigner.endSales(tokenId, owner);
            console.log("Waiting for transaction to be mined...");
            const receipt = await tx.wait();
            console.log("Transaction Mined:", receipt);

          }catch (error) {

            console.error("Failed to end sale for token ID: " + tokenId, error)
            
          }

        }
      }
  }
});


// Utilisez le middleware cors
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/user', MarketPlaceController.createUser);
app.post('/transaction', MarketPlaceController.createTransaction);
app.get('/transactions', MarketPlaceController.getAllTransactions);
app.get('/transactions/:tokenId', MarketPlaceController.getNftTransactions);
app.delete('/transactions/deleteAll', MarketPlaceController.deleteAllTransactions)
app.get('/user/:address', MarketPlaceController.getUserData);
app.get('/users', MarketPlaceController.getAllUsers);

app.post('/collection', MarketPlaceController.addNftToCollection);
app.get('/collections', MarketPlaceController.getAllCollections);
app.delete('/collections', MarketPlaceController.deleteAllCollections);
app.delete('/collections/deleteNft', MarketPlaceController.deleteNftFromCollection);
app.get('/getCollection/:tokenId', MarketPlaceController.getNftCollection);

mongoose
  .connect(process.env.MONGODB_URI as string, {
    authSource: 'admin',
  })
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB.');
    console.error(error);
  });

  app.listen(port, () => {
    console.log(`App listening at http://54.37.68.74:${port}`);
  });