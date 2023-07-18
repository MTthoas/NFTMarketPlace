import React, { useState, useEffect } from "react";
// import "react-modern-drawer/dist/index.css";

import "./App.css";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";
import Contracts from "../../../contracts/contracts.json";

import { NFT } from "../../interface/NFT";
import NFT_CARD_MARKETPLACE from "../../card/NFT_CARD_MARKETPLACE";
import NftTopCollection from "./card/nftTopCollection";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

function Home() {
  const [data, updateData] = useState<NFT[]>([]);
  const [collection, updateCollection] = useState<any>([]);
  
  const { address } = useAccount();
  

  function getCurrentTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  async function getAllCollections() {
    const getAllCollections = await axios.get(
      `http://54.37.68.74:3030/collections`
    );

    const collections = getAllCollections.data;

    const collectionsData = await Promise.all(
      collections.map(async (i: any, index: any) => {
        const item = {
          id: index,
          name: i.name,
          array: i.nfts,
        };
        return item;
      })
    );

    console.log(collectionsData);
    updateCollection(collectionsData);
  }

  async function getAllNFTs() {
    try {
      console.log("getAllNFTs");

      let provider;
      if (address) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
      } else {
        provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/dDrOp8IBds7sg91k_C73L1PXYEud9_5p");
      }

      let myNftMarket = new ethers.Contract(
        Contracts.NFTMarket.address,
        Contracts.NFTMarket.abi,
        provider
      );
      
      let myNFT = new ethers.Contract(
        Contracts.MyNFT.address,
        Contracts.MyNFT.abi,
        provider
      );
      

      // let transactionAuction = await auctionContract.getAllAuctions();
      let transactionSales = await myNftMarket.getAllSales();
      // let transactionAuction = await myNftMarket.getAllAuctions();

      const Sales = await Promise.all(
        transactionSales.map(async (i: any) => {
          const data = await myNFT.getTokenData(i.toNumber());

          const getAllData = await myNftMarket.getAllData(i.toNumber());

          const price = ethers.utils.formatEther(getAllData.price);

          const isOnSale = await myNftMarket.isTokenOnSale(i.toNumber());
          const isOnAuction = await myNftMarket.isTokenOnAuction(i.toNumber());

          let type = "none";
          let listEndTime = 0;
          let remainingMilliseconds = 0;

          if (isOnSale) {
            type = "sale";
            listEndTime = getAllData.salesEndTime.toNumber();
          } else if (isOnAuction) {
            type = "auction";
            listEndTime = getAllData.auctionEndTime.toNumber();
          }

          const remainingSeconds = listEndTime - getCurrentTimestampInSeconds();

          if (remainingSeconds > 0) {
            remainingMilliseconds = remainingSeconds * 1000;
          }

          const item = {
            tokenId: i.toNumber(),
            name: data[0],
            description: data[1],
            image: data[2],
            price: price,
            owner: data[4],
            type: type.toString(),
            listEndTime: remainingMilliseconds,
            highestBid: ethers.utils.formatEther(getAllData.highestBid),
          };

          return item;
        })
      );

      
      const sortedSales = Sales.sort((a, b) => b.tokenId - a.tokenId);

      // Récupération des 5 derniers NFTs
      const latestFiveSales = sortedSales.slice(0, 4);
  
      updateData(latestFiveSales);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllNFTs();
    getAllCollections();
    // setInfos();
  }, []);

  return (
    <main className="w-full hold " >
      <div className="relative isolate px-6 pt-14 lg:px-8 wave-container  mb-6 ">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu  blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
          // className="relative left-[calc(50%-11rem)] aspect-[837/678] w-[36.125rem] -translate-x-1/2 rotate-[53deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          // style={{
          //   clipPath:
          //     "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          // }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-12 sm:py-12 lg:py-12">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-info ">
              Announcing our next round of funding.{" "}
              <a href="#" className="font-semibold text-neutral">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center pt-5">
            <h1 className="text-4xl font-bold tracking-tight text-neutral sm:text-6xl">
              Discover, collect and sell extraordinary NFTs
            </h1>
            <p className="mt-6 text-lg leading-8 text-info">
              Digital marketplace for Non-Fungible Tokens (NFTs). Buy, sell, create and
              discover exclusive digital assets.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 hover:cursor-pointer">
           
            </div>
          </div>
        </div>
        <div className="wave"></div>
        <div
        // className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu  blur-3xl sm:top-[calc(100%-70rem)]"
        // aria-hidden="true"
        >
          <div
          // className="relative left-[calc(50%+3rem)] aspect-[1100/900] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%+rem)] sm:w-[72.1875rem]"
          // style={{
          //   clipPath:
          //     "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          // }}
          />
        </div>
      </div>

      {/* NFT Card Grid */}
      <div className="container mx-auto pl-12 pr-14">
        <div className="flex mb-6">
          <span className="orange-bar rounded mr-2 "></span>
          <div className="flex justify-between w-full">
            <h2 className="text-2xl font-bold text-neutral">
              Explore New NFTs
            </h2>
            <Link to ="/marketplace">
                <button className=" font-semibold text-black py-1 px-3 border border-neutral rounded-md">
                  View all
                </button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {data.map((value, index) => {
            return (
              <div key={index}>
                <NFT_CARD_MARKETPLACE
                  key={index}
                  tokenId={value.tokenId}
                  owner={value.owner}
                  price={value.price}
                  image={value.image}
                  type={value.type}
                  data={value}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Text part : Create and Sell Your NFTs */}
      {/* <div className="wave-container">
        <div className="wave"></div>
    </div> */}


      {/* Top Collection */}
      <div
        className="container mx-auto pl-12 pr-14 mt-24 pt-12"
        style={{ minHeight: "400px" }}
      >
        <div className="flex mb-6">
          <span className="orange-bar rounded mr-2 mt-1"></span>
          <div className="flex justify-between w-full">
            <h2 className="text-2xl font-bold text-neutral">Top Collections</h2>
            <button className="bg-base-100 font-semibold text-neutral py-1 px-3 border border-neutral rounded-lg">
              View all
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
          {collection.map((collectionGate: any) => (
            <div key={collectionGate.id} className="flex justify-between">
              <div className="flex">
                {/* <img src={collection.collectionImage} alt="collection" className="w-16 h-16 rounded" /> */}
                <div className="mx-4 py-2">
                  <h3 className="text-neutral font-semibold text-lg">
                    {collectionGate.name}
                  </h3>
                  {/* <p className="text-white text-sm">{collection.collectionValue} {collection.collectionChain}</p>  */}
                </div>
              </div>
              <div className="flex items-center mr-2">
                <div className="bg-black bg-opacity-10 rounded-full py-1 px-2">
                  <p className="text-neutral text-xs">
                    Items : {collectionGate.array.length}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {/* {collections.slice(0, 8).map((collection) => (
                <NftTopCollection key={collection.id} collection={collection} />
            ))} */}
        </div>
      </div>
    </main>
  );
}

export default Home;
