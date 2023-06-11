import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ethers } from 'ethers';
import MarketPlace from '../contracts/marketplace.json';
import { uploadFileToIPFS } from '../pinata';
import axios from 'axios';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contract = new ethers.Contract(MarketPlace.address, MarketPlace.abi as any, signer);

function Home() {
  
  const { address } = useAccount();
  const { data: balanceData, isError: balanceError, isLoading: balanceLoading } = useBalance({ address: address });
  
  const [nfts, setNfts] = useState<
    {
      tokenId: number;
      owner: string;
      seller: string;
      price: number;
      currentlyListed: boolean;
    }[]
  >([]);

  const [tokenURI, setTokenURI] = useState('');
  const [price, setPrice] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [tokenPrice, setTokenPrice] = useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  

  const JWT = process.env.JWT

  const createNewNFT = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${JWT}`,
          }
        });
  
        if (res.data.IpfsHash) {
          const attributes = [
            {
              trait_type: "Breed",
              value: "Maltipoo"
            },
            {
              trait_type: "Eye color",
              value: "Mocha"
            }
          ];
          const description = "The world's most adorable and sensitive pup.";
          const image = res.data.IpfsHash;
          const name = "Ramses";
  
          const tokenURI = JSON.stringify({
            attributes,
            description,
            image,
            name
          });
  
          const priceInWei = ethers.utils.parseEther(tokenPrice);

          let listingPrice = await contract.getListPrice()
          listingPrice = listingPrice.toString()

  
          const transaction = await contract.createToken(tokenURI, priceInWei, { value: listingPrice });
          await transaction.wait();
  
          console.log("NFT created successfully");
  
        }
      } catch (error: any) {
        if (error.message.message) {
          console.log(error.message.message);
        }
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      }
  
      setFile(null);
      setTokenPrice("");
    }
  };
  
      return (
        <div>
          {address ? (
            <div>
              <h1>Home</h1>
              <p>Address: {address}</p>
              <p>Balance: {balanceData?.formatted}</p>
              <div>
                <input type="file" onChange={onFileChange} />
                <input type="text" value={tokenPrice} onChange={(e) => setTokenPrice(e.target.value)} placeholder="Price in Ether" />
                <button onClick={createNewNFT}>Create NFT</button>
      
              </div>
              
            </div>
          ) : null}
        </div>
      );
      
}

export default Home;
