import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { ethers } from "ethers";
import MarketPlace from "../contracts/marketplace.json";
import { uploadFileToIPFS } from "../pinata";
import axios from "axios";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const contract = new ethers.Contract(
  MarketPlace.address,
  MarketPlace.abi as any,
  signer
);

function Create() {
  const { address } = useAccount();
  const {
    data: balanceData,
    isError: balanceError,
    isLoading: balanceLoading,
  } = useBalance({ address: address });

  const [nfts, setNfts] = useState<
    {
      tokenId: number;
      owner: string;
      seller: string;
      price: number;
      currentlyListed: boolean;
    }[]
  >([]);

  const [tokenURI, setTokenURI] = useState("");
  const [price, setPrice] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [tokenPrice, setTokenPrice] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjN2U5ZjAyYy04MzAzLTRjOGYtOWIwZC0xMzQ1YWI5MDlmMjIiLCJlbWFpbCI6Im1hbHRoYXphcjIyN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGM0MTUyYzk5YThhYTI0ZmEzMjIiLCJzY29wZWRLZXlTZWNyZXQiOiJhZmZlYzRiZDQ2ZGE1NjUzZWMyMWE3ZGU4Nzc0OGZlNThlNzVmYTI4MWI0YjczZjBmYzVjMzcxYjIxYmEzOGFjIiwiaWF0IjoxNjg2MjYwNTI2fQ.GwwGHhM8E6ZN_YnMtJIqIB8KVArhxFmc-0Uq5h5it88";

  const createNewNFT = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${JWT}`,
            },
          }
        );

        if (res.data.IpfsHash) {
          const attributes = [
            {
              trait_type: "Breed",
              value: "Maltipoo",
            },
            {
              trait_type: "Eye color",
              value: "Mocha",
            },
          ];
          const description = `${tokenDescription}`;
          const image = `${res.data.IpfsHash}`;
          const name = `${tokenName}`;

          const tokenURI = JSON.stringify({
            attributes,
            description,
            image,
            name,
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
          console.log("Error", error.message);
        }
      }

      setFile(null);
      setTokenPrice("");
    }
  };

  return (
    <div className="w-full">
      {address ? (
        <div className="px-6 pt-14 lg:px-8">
          <h1 className="text-center font-bold text-2xl">Create New NFT</h1>
          <p className="text-center mt-2">Address: {address}</p>
          <p className="text-center">Balance: {balanceData?.formatted}</p>

          <div className=" grid place-items-center p-2">
            <div className="text-center place-items-center grid border border-gray-400 my-6 p-16 rounded-xl border-dashed">
              <svg
                className="w-12 h-12 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <h1 className="text-grey font-semibold text-2xl">
                JPG, PNG, GIF. Max 10mb.
              </h1>
              <button className="px-4 py-2 bg-neutral text-white rounded-md mt-3 flex">
                <svg
                  className="w-6 h-6 mx-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Choose File
              </button>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="Token Name"
            />

            <input type="file" onChange={onFileChange} />
            <input
              type="text"
              value={tokenPrice}
              onChange={(e) => setTokenPrice(e.target.value)}
              placeholder="Price in Ether"
            />
            <input
              type="text"
              value={tokenDescription}
              onChange={(e) => setTokenDescription(e.target.value)}
              placeholder="Token Description"
            />
            <button onClick={createNewNFT}>Create NFT</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Create;
