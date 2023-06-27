import React from 'react'
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import MarketPlaceJSON from '../contracts/marketplace.json';
import axios from 'axios';

import { NFT } from './interface/NFT';

export default function MarketPlace() {

    const [data, updateData] = useState<NFT[]>([]);

    async function getAllNFTs() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
    
            let contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, provider);
    
            let transaction = await contract.getAllListedNFTs();

            console.log(transaction)
    
            const items = await Promise.all(transaction.map(async (i: any) => {
            const tokenURI = await contract.tokenURI(i.tokenId);
    
            const metadata = JSON.parse(tokenURI);
            console.log(metadata);

            const ethValue = ethers.utils.formatEther(i.price);
    
            let item = {
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: metadata.image,
                price : ethValue
            }
            return item;
            }));
    
            console.table(items);
            updateData(items);

        } catch (error) {
            console.log(error);
        }
    }
    

    useEffect(() => {
        getAllNFTs();
    }, []);


    const purchaseNFT = async (nft: NFT) => {
        try {
            console.log(`NFT Infos: `, nft);
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, signer);
    
            const priceWei = ethers.utils.parseEther(nft.price.toString());
            const transaction = await contract.executeSale(nft.tokenId, { value: priceWei });
    
            await transaction.wait();  // Attendez que la transaction soit minée
    
            console.log('NFT acheté avec succès !');
        } catch (error) {
            console.log('Erreur lors de l\'achat du NFT: ', error);
        }
    };
    
    
    
    return (
        <div>
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold">
                    MarketPlace
                </div>
                <div className="flex mt-5 justify-between px-24 flex-wrap max-w-screen-xl text-center gap-5">
                    {data.map((value, index) => {
                        console.log(value)
                        return  (
                            <div key={index} className="nft-item">
                                <p>Token ID: {value.tokenId}</p>
                                <p>Seller: {value.seller}</p>
                                <p>Owner: {value.owner}</p>
                                <p> Price : {value.price}</p>
                                <img src={"https://salmon-broad-weasel-155.mypinata.cloud/ipfs/"+value.image} alt="NFT" className="nft-image w-64 "/>
                                

                                <button onClick={() => purchaseNFT(value)} className="buy-button">
                                    Buy NFT
                                </button>
                                
                            </div>
                        )
                    })}
                </div>
            </div>            
        </div>
    );
}
