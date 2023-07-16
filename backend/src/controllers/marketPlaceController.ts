import { Request, Response } from 'express';
import UserModel, { User } from '../model/user';
import TransactionModel, { Transaction } from '../model/transaction';
import CollectionModel, { Collection } from '../model/collection';


export default class MarketPlaceController {

static createUser = async (req: Request, res: Response) => {
  try {
    const newUser: User = new UserModel({ 
        address: req.body.address,
        profilePicture: req.body.profilePicture
     });
    await newUser.save();

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user.');
  }
};

static getAllCollections = async (req: Request, res: Response) => {
  try {
    let collections = await CollectionModel.find({});

    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting collections.');
  }
};

static getNftCollection = async (req: Request, res: Response) => {
  try {
    const tokenId: string = req.params.tokenId;

    // Find the collection which contains the NFT
    let collection = await CollectionModel.findOne({ nfts: tokenId });

    if (!collection) {
      // If collection does not exist, send an error response
      return res.status(404).send('No collection found for this token.');
    }

    res.json(collection);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting collection for NFT.');
  }
};


static deleteNftFromCollection = async (req: Request, res: Response) => {
  try {
    const collectionName: string = req.body.collectionName;
    const tokenId: string = req.body.tokenId;

    // Find the collection
    let collection = await CollectionModel.findOne({ name: collectionName });

    if (!collection) {
      // If collection does not exist, send an error response
      return res.status(404).send('Collection not found.');
    }

    // Get the index of the tokenId in the nfts array
    const index = collection.nfts.indexOf(tokenId);

    // Check if the tokenId exists in the collection
    if (index !== -1) {
      // Remove the tokenId from the collection
      collection.nfts.splice(index, 1);

      // If the collection is empty after removing the NFT, delete the collection
      if (collection.nfts.length === 0) {
        await CollectionModel.deleteOne({ _id: collection._id });
        res.status(200).send('Collection is empty and has been deleted.');
      } else {
        // If not, save the collection and send it as response
        await collection.save();
        res.json(collection);
      }

    } else {
      res.status(404).send('Token ID not found in the collection.');
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting NFT from collection.');
  }
};


static deleteAllCollections = async (req: Request, res: Response) => {
  try {
      await CollectionModel.deleteMany({});  // Deletes all collections

      res.status(200).send('All collections deleted successfully.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting collections.');
  }
};



static addNftToCollection = async (req: Request, res: Response) => {
  try {
    const collectionName: string = req.body.collectionName;
    const tokenId: string = req.body.tokenId;

    let collection = await CollectionModel.findOne({ name: collectionName });

    if (!collection) {
      // If collection does not exist, create a new one
      collection = new CollectionModel({ name: collectionName, nfts: [] });
      await collection.save();
    }

    // Add the NFT to the collection and save
    if (!collection.nfts.includes(tokenId)) {
      collection.nfts.push(tokenId);
      await collection.save();
    }

    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding NFT to collection.');
  }
};

static createTransaction = async (req: Request, res: Response) => {
    try {
      const newTransaction: Transaction = new TransactionModel({
        from: req.body.from,
        to: req.body.to,
        amount: req.body.amount,
        tokenId: req.body.tokenId
      });
      await newTransaction.save();
  
      const transactions: Transaction[] = await TransactionModel.find({ tokenId: req.body.tokenId }).sort({ timestamp: -1 });;
      
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating transaction.');
    }
  };
  

static getAllTransactions = async (req: Request, res: Response) => {
    try {
      const transactions: Transaction[] = await TransactionModel.find().sort({ timestamp: -1 });  ;
  
      res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting transactions.');
    }
  };


static getNftTransactions = async (req: Request, res: Response) => {

    try {
        const tokenId: string = req.params.tokenId;

        const transactions: Transaction[] = await TransactionModel.find({ tokenId: tokenId })
        .sort({ timestamp: -1 });  // -1 for sorting in descending order

        if (transactions.length > 0) {
        res.json(transactions);
        } else {
        res.status(404).send('No transactions found for this token.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting transactions.');
    }
};

static deleteAllTransactions = async (req: Request, res: Response) => {
    try {
      await TransactionModel.deleteMany({}); // Deletes all transactions
  
      res.status(200).send('All transactions deleted successfully.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting transactions.');
    }
  };
  

  

static getUserData = async (req: Request, res: Response) => {
    try {
      const userData: User | null = await UserModel.findOne({ address: req.params.address });
  
      if (userData) {
        res.json(userData);
      } else {
        res.status(404).send('User not found.');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting user data.');
    }
  };
  

  static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users: User[] = await UserModel.find({});
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting users.');
    }
  };
  

}
