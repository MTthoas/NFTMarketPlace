import express from 'express';
import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import MarketPlaceController from './controllers/marketPlaceController';
import cors from 'cors'; // Importez le middleware cors


const app = express();
const port = 8080;

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
  console.log(`App listening at http://localhost:${port}`);
});