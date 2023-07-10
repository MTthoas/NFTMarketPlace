import React from 'react'
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../../contracts/marketplace.json';
import axios from 'axios';

import Contracts from '../../../contracts/contracts.json';


import { NFT } from '../../interface/NFT';

import { NFT_Auction } from '../../interface/NFT_Auction';
import { NFT_Sales } from '../../interface/NFT_Sales';


import NFT_CARD_MARKETPLACE from '../../card/NFT_CARD_MARKETPLACE';


export default function MarketPlace() {

    const [data, updateData] = useState<NFT[]>([]);

    const [ NFT_Auction_data, update_NFT_Auction_data] = useState<NFT_Auction[]>([]);
    const [ NFT_Sales_data, update_NFT_Sales_data] = useState<NFT_Sales[]>([]);

    const [filtersVisible, setFiltersVisible] = useState(true);
    const [adress, setAdress] = useState("")

    const toggleFilters = () => {
      setFiltersVisible(!filtersVisible);
    };

    const setInfos = async() => {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAdress(accounts[0])

    }

    function getCurrentTimestampInSeconds () {
      return Math.floor(Date.now() / 1000)
    }

  
    async function getAllNFTs() {

      try {

        console.log("getAllNFTs")
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        let myNftMarket = new ethers.Contract(Contracts.NFTMarket.address, Contracts.NFTMarket.abi, provider);
        let myNFT = new ethers.Contract(Contracts.MyNFT.address, Contracts.MyNFT.abi, provider);
        
        // let transactionAuction = await auctionContract.getAllAuctions();
        let transactionSales = await myNftMarket.getAllSales();
        // let transactionAuction = await myNftMarket.getAllAuctions();

        const Sales = await Promise.all(transactionSales.map(async (i: any) => {

          const data = await myNFT.getTokenData(i.toNumber());

          const getAllData = await myNftMarket.getAllData(i.toNumber());
          console.log(getAllData)

          const price = ethers.utils.formatEther(data[3]);

          const isOnSale = await myNftMarket.isTokenOnSale(i.toNumber());
          const isOnAuction = await myNftMarket.isTokenOnAuction(i.toNumber());

          console.log(data[0], isOnSale, isOnAuction)
          let type = "none";
          let listEndTime = 0;
          let remainingMilliseconds = 0;

          if(isOnSale) {
            type = "sale";
            listEndTime = getAllData.salesEndTime.toNumber();
          } else if(isOnAuction) {
              type = "auction";
              listEndTime = getAllData.auctionEndTime.toNumber();
          }
      
          const remainingSeconds = listEndTime - getCurrentTimestampInSeconds();
          
          if (remainingSeconds > 0) {
              remainingMilliseconds = remainingSeconds * 1000;
          }

          
          console.log("List End Time: ", remainingMilliseconds)

          const item = {
            tokenId: i.toNumber(),
            name: data[0],
            description: data[1],
            image: data[2],
            price: price, 
            owner: data[4],
            type: type.toString(),
            listEndTime : remainingMilliseconds
          }

          return item;

        }));


      // updateData(Sales)

      console.table(Sales)

      updateData(Sales)
      

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 xl:gap-52 gap-32">               
              {data.map((value, index) => {
                  return(
                      <div key={index}>
                          <NFT_CARD_MARKETPLACE 
                              key={index}
                              tokenId={value.tokenId}
                              // seller={value.seller}
                              owner={value.owner}
                              price={value.price}
                              image={value.image}
                              type={value.type}
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
