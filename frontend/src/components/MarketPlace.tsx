import React from 'react'
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import MarketPlaceJSON from '../contracts/marketplace.json';
import axios from 'axios';

interface NFT {
    tokenId: number;
    seller: string;
    owner: string;
    imagePinataPath: string;
    // include any other properties you might fetch
  }

export default function MarketPlace() {

    const [data, updateData] = useState<NFT[]>([]);
    const [dataFetch, updateDataFetch] = useState(false);

    async function getAllNFTs() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, signer);

        let transaction = await contract.getAllNFTs();

        const items = await Promise.all(transaction.map(async (i: any) => {
        const tokenURI = await contract.tokenURI(i.tokenId);

        const metadata = JSON.parse(tokenURI);
        console.log(metadata);


        let item = {
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            imagePinataPath: metadata.image
            // imagePinataPath: metadata.image // Assuming `image` is a property of the metadata
        }
        return item;
        }));

        console.table(items);
        updateData(items);
        updateDataFetch(true);
    } catch (error) {
        console.log(error);
    }
    }


    useEffect(() => {
        getAllNFTs();
    }, []);
    
    return (
        <div>
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    Top NFTs
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center gap-5">
                    {data.map((value, index) => {
                        return  (
                            <div key={index} className="nft-item">
                                <p>Token ID: {value.tokenId}</p>
                                <p>Seller: {value.seller}</p>
                                <p>Owner: {value.owner}</p>
                                <img src={"https://salmon-broad-weasel-155.mypinata.cloud/ipfs/"+value.imagePinataPath} alt="NFT" className="nft-image"/>
                            </div>
                        )
                    })}
                </div>
            </div>            
        </div>
    );
}
