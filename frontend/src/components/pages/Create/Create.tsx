import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { ethers } from 'ethers';
import MarketPlace from '../../../contracts/marketplace.json';
import { uploadFileToIPFS } from '../../../pinata';
import axios from 'axios';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contract = new ethers.Contract(MarketPlace.address, MarketPlace.abi as any, signer);

function Create() {
  
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

  

  const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjN2U5ZjAyYy04MzAzLTRjOGYtOWIwZC0xMzQ1YWI5MDlmMjIiLCJlbWFpbCI6Im1hbHRoYXphcjIyN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGM0MTUyYzk5YThhYTI0ZmEzMjIiLCJzY29wZWRLZXlTZWNyZXQiOiJhZmZlYzRiZDQ2ZGE1NjUzZWMyMWE3ZGU4Nzc0OGZlNThlNzVmYTI4MWI0YjczZjBmYzVjMzcxYjIxYmEzOGFjIiwiaWF0IjoxNjg2MjYwNTI2fQ.GwwGHhM8E6ZN_YnMtJIqIB8KVArhxFmc-0Uq5h5it88"

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
          const image = `${res.data.IpfsHash}`;
          const name = "Ramses";
  
          const tokenURI = JSON.stringify({
            attributes,
            description,
            image,
            name
          });
  
          const priceInWei = ethers.utils.parseEther(tokenPrice);
  
          const transaction = await contract.createToken(tokenURI, priceInWei);
          await transaction.wait();
  
          console.log("NFT created successfully");
  
        }
      } catch (error: any) {
        if (error.message) {
          console.log(error.message);
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

export default Create;
