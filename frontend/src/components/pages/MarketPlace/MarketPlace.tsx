import React from 'react'
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../../contracts/marketplace.json';
import axios from 'axios';

import Contracts from '../../../contracts/contracts.json';


import { NFT } from '../../interface/NFT';
import NFT_CARD_MARKETPLACE from '../../card/NFT_CARD_MARKETPLACE';


export default function MarketPlace() {

    const [data, updateData] = useState<NFT[]>([]);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [adress, setAdress] = useState("")

    const toggleFilters = () => {
      setFiltersVisible(!filtersVisible);
    };

    const setInfos = async() => {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAdress(accounts[0])

    }
  
    async function getAllNFTs() {
        try {

            console.log("getAllNFTs")
            const provider = new ethers.providers.Web3Provider(window.ethereum);
    
            // let contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, provider);
    
            // let auctionContract = new ethers.Contract(Contracts.auctionContract.address, Contracts.auctionContract.abi, provider);
            let saleContract = new ethers.Contract(Contracts.nftContract.address, Contracts.nftContract.abi, provider);
        
            // let transactionAuction = await auctionContract.getAllAuctions();
            let transactionSales = await saleContract.getAllListedNFTs();
            
            // console.log(transactionAuction);
            console.log(transactionSales);
    
    

        // console.log(transaction)

          // const items = await Promise.all(transaction.map(async (i: any) => {
            
          //     const tokenURI = await contract.tokenURI(i.tokenId);
          //     // const isAuctionActive = await contract.checkIfAuctionExists(i.tokenId); // Check if the token is on auction
          //     // console.log("NFT : " + i.tokenId.toNumber() + " / " + isAuctionActive)
          //     const metadata = JSON.parse(tokenURI);
          //     console.log(metadata);

          //     const ethValue = ethers.utils.formatEther(i.price);

          //     let item = {
          //         tokenId: i.tokenId.toNumber(),
          //         name: metadata.name,
          //         seller: i.seller,
          //         owner: i.owner,
          //         image: metadata.image,
          //         price : ethValue,
          //         currentlyListed: i.currentlyListed,
          //         // isAuctionActive: isAuctionActive // New attribute that shows if the NFT is on auction
          //     }

          //     return item;
          // }));

        // console.table(items);
        // updateData(items);

        } catch (error) {
            console.log(error);
        }
    }
    

    useEffect(() => {
        getAllNFTs();
        setInfos();
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
        <div className='container px-4  mx-auto h-screen'>
      {/* Title */}
      <div className='mt-10'>
        <h1 className='text-4xl sm:text-5xl font-semibold tracking-tight text-neutral pb-1'>Market</h1>
        <p className='text-neutral'>Discover and collect NFT</p>
      </div>


      <div className="divider"></div>


      {/* Hide filters & results */}
      <div className='flex flex-row justify-between mb-3'>
        <button className='flex' onClick={toggleFilters}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <p className='my-auto text-grey'>{filtersVisible ? 'HIDE FILTERS' : 'SHOW FILTERS'}</p>
        </button>
        <p className='text-grey'>43,294 results</p>
      </div>


      {/* NFTs & filters*/}
      <div className={window.innerWidth > 1024 ? 'flex w-100' : ''}>
        {/* Filters */}
        {filtersVisible && (
          <ul className={window.innerWidth > 1024 ? 'menu menu-compact lg:menu-normal bg-base-100 rounded-box w-1/5 mr-2' : 'menu menu-compact lg:menu-normal bg-base-100 p-2 rounded-box w-full'}>
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-2">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium px-auto">Status</div>
              <div className="form-control collapse-content px-0">
                <label className="label justify-start cursor-pointer rounded hover:bg-neutral-900 px-2">
                  <input type="checkbox" className="checkbox checkbox-secondary" />
                  <span className="label-text text-base pl-2">On auction</span>
                </label>

                <label className="label justify-start cursor-pointer rounded hover:bg-neutral-900 px-2">
                  <input type="checkbox" className="checkbox checkbox-secondary" />
                  <span className="label-text text-base pl-2">New</span>
                </label>
              </div>
            </div>


            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-2">
              <input type="checkbox" />
              <div className="collapse-title text-xl font-medium px-auto">Price</div>
              <div className='collapse-content'>
                <div className="form-control px-0">
                  <label className="label">
                    <span className="label-text">Min</span>
                  </label>
                  <label className="input-group">
                    <input type="text" placeholder="0.1" className="input input-bordered focus:outline-0" />
                    <select className="select select-bordered focus:outline-0 bg-none px-3">
                      <option>ETH</option>
                      <option>USDT</option>
                    </select>
                  </label>
                </div>

                <div className="form-control px-0">
                  <label className="label">
                    <span className="label-text">Max</span>
                  </label>
                  <label className="input-group flex flex-row w-100">
                    <input type="text" placeholder="2.3" className="input input-bordered focus:outline-0" />
                    <select className="select select-bordered focus:outline-0 bg-none px-3">
                      <option>ETH</option>
                      <option>USDT</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </ul>
        )}

        {/* NFTs */}
        <div className={filtersVisible ? 'w-4/5  ml-2' : 'w-full'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">               
             {data.map((value, index) => {
                console.table(value)
                  return(
                    <div key={index}>
                        <NFT_CARD_MARKETPLACE 
                            key={index}
                            tokenId={value.tokenId}
                            seller={value.seller}
                            owner={value.owner}
                            price={value.price}
                            image={value.image}
                            data={value}
                        />
                    </div>
                    
                )
            })}
            </div>
        </div>
      </div>
    </div>
    );
}
