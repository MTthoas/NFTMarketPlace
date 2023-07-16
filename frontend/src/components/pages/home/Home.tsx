import React, { useState, useEffect } from "react";
// import "react-modern-drawer/dist/index.css";

import "./App.css";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";
import Contracts from "../../../contracts/contracts.json";

import { NFT } from '../../interface/NFT'
import NFT_CARD_MARKETPLACE from "../../card/NFT_CARD_MARKETPLACE";
import NftTopCollection from "./card/nftTopCollection";
import { ethers } from "ethers";

function Home() {

  const [data, updateData] = useState<NFT[]>([]);
  const [collection, updateCollection] = useState<any>([]);

  function getCurrentTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  async function getAllCollections(){


    const getAllCollections = await axios.get(`http://54.37.68.74:3030/collections`);

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
      const provider = new ethers.providers.Web3Provider(window.ethereum);

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
          };

          return item;
        })
      );

      updateData(Sales);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllNFTs();
    getAllCollections()
    // setInfos();
  }, []);


  return (
    <main className="w-full">
      <div className="relative isolate px-6 pt-14 lg:px-8">
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
        <div className="mx-auto max-w-2xl py-12 sm:py-12 lg:py-24">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-info ">
              Announcing our next round of funding.{" "}
              <a href="#" className="font-semibold text-neutral">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral sm:text-6xl">
              Discover, collect and sell extraordinary NFTs
            </h1>
            <p className="mt-6 text-lg leading-8 text-info">
              Digital marketplace for Non-Fungible Tokens (NFTs). Buy, sell, and
              discover exclusive digital assets.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button className="bg-transparent  hover:bg-secondary text-neutral font-semibold hover:text-white py-2 px-4 border border-neutral hover:border-transparent rounded-full">
                View collection
              </button>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-neutral"
              >
                About us <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

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
        <span className="orange-bar rounded mr-2 mt-1"></span>
        <div className='flex justify-between w-full'>
          <h2 className="text-2xl font-bold text-neutral">Explore New NFTs</h2>
          <button className=" font-semibold text-black py-1 px-3 border border-neutral rounded-full">View all</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        
      {data.map((value, index) => {
                  return (
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
                  );
                })}

      </div>
    </div>

      {/* Text part : Create and Sell Your NFTs */}
      <div className="px-4 py-7 my-20 bg-neutral rounded-sm">
        <h2 className="text-2xl text-center font-semibold text-base-100 pt-5">
          Artx is an NFT marketplace for curated cryptoart.
        </h2>
        <p className="text-center text-gray-300 pb-7"> We’re building a new art market for artists, collectors, and curators. </p>
        <div className="flex flex-col md:flex-row justify-around gap-10 md:gap-20 my-10 ">
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-base-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
            <h3 className="text-xl text-base-100 font-bold text-center py-2">
              Setup your wallet
            </h3>
            <p className="text-center text-info text-sm w-3/4">
              Once you’ve set up your wallet of choice, connect it to ArtX by
              clicking the wallet icon in the navigation menu
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-base-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <h3 className="text-xl font-bold text-center py-2 text-base-100">
              Upload & Create Collection
            </h3>
            <p className="text-center text-info text-sm w-3/4">
              Once you’ve set up your wallet of choice, connect it to ArtX by
              clicking the wallet icon in the navigation menu
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-base-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
              />
            </svg>
            <h3 className="text-xl font-bold text-center py-2 text-base-100">
              List them for sale
            </h3>
            <p className="text-center text-info text-sm w-3/4">
              Upload your work then Click My Collections and set up your
              collection. Add social links and a description to your NFTs
            </p>
          </div>
        </div>
      </div>

      {/* Top Collection */}
      <div className="container mx-auto pl-12 pr-14" style={{ minHeight: "400px" }}>
        <div className="flex mb-6">
            <span className="orange-bar rounded mr-2 mt-1"></span>
            <div className='flex justify-between w-full'>
                <h2 className="text-2xl font-bold text-neutral">Top Collections</h2>
                <button className="bg-base-100 font-semibold text-neutral py-1 px-3 border border-neutral rounded-full">View all</button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">

            {
                collection.map((collectionGate : any) => (
                  <div key={collectionGate.id} className="flex justify-between">
                  <div className='flex'>
                      {/* <img src={collection.collectionImage} alt="collection" className="w-16 h-16 rounded" /> */}
                      <div className="mx-4 py-2">
                          <h3 className="text-neutral font-semibold text-lg">{collectionGate.name}</h3>
                          {/* <p className="text-white text-sm">{collection.collectionValue} {collection.collectionChain}</p>  */}
                      </div>
                  </div>
                  <div className='flex items-center mr-2'>
                      <div className='bg-black bg-opacity-10 rounded-full py-1 px-2'>
                          <p className="text-neutral text-xs">Items : {(collectionGate.array).length}</p>
                      </div>
                  </div>
              </div>
                ))
            }
            {/* {collections.slice(0, 8).map((collection) => (
                <NftTopCollection key={collection.id} collection={collection} />
            ))} */}
        </div>
    </div>

    </main>
  );
}

export default Home;