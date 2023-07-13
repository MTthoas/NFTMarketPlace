import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import Breadcrumb from 'components/utils/breadcrumb'
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import axios from "axios";

import Contracts from "../../../contracts/contracts.json";

import "./stylesheets/Nft.css";

import Loading from "../../modal/Loading";
import Success from "../../modal/Success";

import Countdown from "react-countdown";

import SalesComponant from "./SalesComponant";
import AuctionComponant from "./AuctionComponant";

import { useAccount } from "wagmi";
import { add } from "date-fns";


import Bid from '../../modal/Bid'
import BuyNow_Modal from '../../modal/BuyNow_Modal';
import MakeOffer_Modal from '../../modal/MakeOffer_Modal';

import { ToastContainer, toast } from 'react-toastify';

import { timeStamp } from 'console';

function shortenAddress(address : any, chars = 4) {
    // Vérifie si l'adresse est valide
    if (!address) return '';
    const start = address.substring(0, chars + 2);
    const end = address.substring(address.length - chars);
    return `${start}...${end}`;
}

function formatDateTime(dateTimeString: any) {
  const dateTime = new Date(dateTimeString);
  const day = dateTime.getDate();
  const month = dateTime.getMonth() + 1;
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();

  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}`;

  return `${formattedDate} ${formattedTime}`;
}

function formatTimestamp(timestamp: any) {
  const date = new Date(timestamp * 1000); // Convertit le timestamp en millisecondes

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Les mois sont indexés à partir de 0
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function NFTDetails() {
  // use params to get the id of the nft
  const { address } = useAccount();
  const { id } = useParams();

  const [nft, setNft] = useState<any>([]);
  const [dataLogs, setData] = useState();
  const [key, setKey] = useState(Date.now());
  const [showLoading, setShowLoading] = useState(false);
  const [showModalSucces, setShowModalSucces] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);

  const [transactionHash, setTransactionHash] = useState("");
  const [showModalBid, setShowModalBid] = useState(false);

  const [bids, setBids] = useState<any>([]);
  const [Historical, setHistorical] = useState<any>([]);


    const [ showModalBuyNow, setShowModalBuyNow ] = useState(false)
    const [ showModalOffer, setShowModalOffer ] = useState(false)

    const [ offers, setOffers ] = useState<any>([]);


  const [highestBid, setHighestBid] = useState<any>([]);

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  let myNftMarket = new ethers.Contract(
    Contracts.NFTMarket.address,
    Contracts.NFTMarket.abi,
    signer
  );
  let myNFT = new ethers.Contract(
    Contracts.MyNFT.address,
    Contracts.MyNFT.abi,
    signer
  );

  function getCurrentTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  const getNftFromId = async () => {
    const transaction = await myNFT.getTokenData(id);

        const transactionSales = await myNftMarket.getAllData(id);

        const transactionForMetadata = await myNFT.getTokenAttributes(id);
        

        const price = ethers.utils.formatEther(transactionSales.price);

        const isOnSale = await myNftMarket.isTokenOnSale(id);
        const isOnAuction = await myNftMarket.isTokenOnAuction(id);

        let type = "none";
        let listEndTime = 0;
        let remainingMilliseconds = 0;

        if(isOnSale) {
        type = "sale";
        listEndTime = transactionSales.salesEndTime.toNumber();
        } else if(isOnAuction) {
            type = "auction";
            listEndTime = transactionSales.auctionEndTime.toNumber();
        }

        const remainingSeconds = listEndTime - getCurrentTimestampInSeconds();


        if (remainingSeconds > 0) {
            remainingMilliseconds = remainingSeconds * 1000;
        }

        let item = {
            tokenId: id,
            name : transaction[0],
            owner : transaction[4],
            price : price,
            image : transaction[2],
            description : transaction[1],
            type: type.toString(),
            listEndTime: remainingMilliseconds,
        }

        setNft(item)

        setHighestBid(ethers.utils.formatEther(transactionSales.highestBid));

  };

    //     const isOnSale = await myNftMarket.isTokenOnSale(id);

    //     let type = "none";
    //     let listEndTime = 0;
    //     let remainingMilliseconds = 0;

    //     const item = {
    //         HighestBid: ethers.utils.formatEther(transactionSales.highestBid),
    //     }

    //     setHighestBid(item)

    // }

  const getEthPrice = async () => {
    const url = "https://api.coinbase.com/v2/exchange-rates?currency=ETH";

    const response = await fetch(url);
    const data = await response.json();

    const ethPrice = data.data.rates.USD;

    setEthPrice(ethPrice);
  };

    const bid = async (amount: any) => {

        try {

        const signerAddress = await signer.getAddress();
        // Vérifiez que le jeton est en vente aux enchères
        const isOnAuction = await myNftMarket.isTokenOnAuction(nft.tokenId);

        if (nft.owner == signerAddress) {
            console.error("Vous ne pouvez pas enchérir sur votre propre jeton");
            return;
        }

        if (!isOnAuction) {
            console.error("Le jeton n'est pas en vente aux enchères");
            return;
        }else{
            console.log("Le jeton est en vente aux enchères");
        }

        // Obtenez les informations sur la vente
        const saleData = await myNftMarket.getAllData(nft.tokenId);

        // Vérifiez que l'enchère n'est pas terminée
        if (saleData.auctionEndTime <= Math.floor(Date.now() / 1000)) {
            console.error("L'enchère est terminée");
            return;
        }

        // Vérifiez que l'offre est suffisamment élevée
        const priceWei = ethers.utils.parseEther(amount);
        if (priceWei.lte(saleData.highestBid)) {
            console.error("L'offre n'est pas assez élevée");
            return;
        }

        // Soumettez l'offre
        const transaction = await myNftMarket.bid(nft.tokenId, priceWei, { value: priceWei });

        await transaction.wait();

        console.log("Transaction Mined");

        const transactionData = {
            from: signerAddress, // L'adresse de l'expéditeur
            to: nft.owner, // L'adresse du destinataire
            amount: amount, // Le montant de l'offre
            tokenId: nft.tokenId // L'ID du jeton
          };
          
          try {
            const response = await axios.post('http://localhost:8080/transaction', transactionData);
            setHistorical([...response.data])
            getAllBidsFromToken()
          } catch (error) {
            console.error('Error creating transaction: ', error);
          }


    } catch (error) {
        console.error(error);
      }

  };

  const getAllBidsFromToken = async () => {
    const signerAddress = await signer.getAddress();
    // Vérifiez que le jeton est en vente aux enchères
    const getBidData = await myNftMarket.getBidData(id);

    setBids([...getBidData]);
  };

  const getAllHistoryFromToken = async () => {
    try {
      const response = await axios.get("http://localhost:8080/transactions");
      console.log("All Transactions", response.data);
      setHistorical([...response.data]);
    } catch (error) {
      console.error("Error getting transactions", error);
    }
  };

  const getAllOffers = async () => {

    const signerAddress = await signer.getAddress();

    const isOnSale = await myNftMarket.isTokenOnSale(id);

    if (!isOnSale) {
        return;
    }

    const getOffersData = await myNftMarket.getOffers(id);


    const Offers = await Promise.all(getOffersData.map(async (i: any, index:any) => {

        const price = ethers.utils.formatEther(i.amount);

        const item = {
            index: index,
            buyer: i.buyer,
            timestamp: i.timestamp,
            amount: i.amount,
        }

        return item;
    }));

    console.log(Offers)
    setOffers([...Offers]);
}


const makeAnOffer = async(offerPrice: any) => {

    try {

        const signerAddress = await signer.getAddress();

        const isOnSale = await myNftMarket.isTokenOnSale(id);

        if (nft.owner == signerAddress) {
            console.error("Vous ne pouvez pas enchérir sur votre propre jeton");
            return;
        }

        if (!isOnSale) {
            console.error("Le jeton n'est pas en vente");
            return;
        }

        const priceWei = ethers.utils.parseEther(String(offerPrice));

        const transaction = await myNftMarket.makeOffer(id, priceWei, { value: priceWei });

        await transaction.wait();
        
        setShowModalOffer(false);

        toast.success('Sir, your offer has been save', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

        getAllOffers()

        console.log("makeAnOffer :" , offerPrice)

    } catch (error) {

        console.error(error);

    }

}

    
useEffect(() => {
    getNftFromId()
    getEthPrice()
    getAllBidsFromToken()
    getAllHistoryFromToken()
    getAllOffers()
}, []);

return (
  <div className='w-full px-10'>
      <div className='mx-0 lg:mx-10 h-fulll'>
          <div className=' flex flex-wrap gap-5 h-full'>
              <div className="container mx-auto px-4 h-full pt-5">
                  {/* <Breadcrumb/> */}
                  <div className="mt-10 flex flex-row gap-x-5 h-full w-full">

                      {/* Left */}
                      <div className="w-3/5">

                          <div className=" w-full flex flex-col gap-y-5 p-2">

                              <div className="h-full w-full">
                                  <div className="overflow-hidden rounded-lg">
                                      <img
                                          alt="content"
                                          className="object-cover w-100 h-100 md:w-114 md:h-114 lg:w-114 lg:h-114 ml-2 xl:ml-24 rounded-lg"
                                          src={"https://salmon-broad-weasel-155.mypinata.cloud/ipfs/"+nft?.image} 
                                      />
                          
                                  </div>
                              </div>

                              <div className="h-full w-full mt-7 pr-10">
                                  
                                  <h1 className="text-2xl font-medium text-neutral mb-5">Description</h1>


                                  <p className="text-gray-500 text-base font-medium pr-10"> The MUTANT APE YACHT CLUB is a collection of up to 20,000 Mutant Apes that can only be created by exposing an existing Bored Ape to a vial of MUTANT SERUM or by minting a Mutant Ape in the public sale.  </p>

                              </div>

                              { nft.type === "auction" ? 
                              <div className=" h-full w-full">

                                  <h1 className="text-2xl font-medium text-neutral mt-7 mb-7">Latest bids</h1>
                                  <div className="overflow-x-auto">
                                  <table className="table w-140">
                                      {/* head */}
                                      <tbody className=''>

                                      {
                                          bids
                                          .slice()
                                          .reverse()
                                          .map((bid: any, i: any) => {
                            
                                              return (
                                              <tr key={i}>
                                                  <td className='font-bold'>{shortenAddress(bid.bidder)}</td>
                                                  <td className="text-sm">{formatTimestamp(bid.timestamp)} • </td>
                                                  <td className="flex flex-col items-end">
                                                  <p className='font-bold text-sm'>{ethers.utils.formatEther(bid.amount)} ETH</p>
                                                  <p className='font-normal text-sm'>{(parseFloat(ethers.utils.formatEther(bid.amount)) * ethPrice).toFixed(3)} $</p>
                                                  </td>
                                              </tr>
                                              );
                                          })
                                      }



                                      </tbody>
                                  </table>
                                  </div>

                              </div>

                              :  
                              <div className=" h-full w-full">

                                  <h1 className="text-2xl font-medium text-neutral mt-7 mb-7"> List of offers </h1>
                                  <div className="overflow-x-auto">
                                  <table className="table w-132">
                                      {/* head */}
                                      <tbody className=''>

                                      {
                                          offers
                                          .slice()
                                          .reverse()
                                          .map((offer: any, i: any) => {
                                              return (
                                              <tr key={i}>  
                                                  <td className='font-bold'> {shortenAddress(offer.buyer)} </td>
                                                  <td className="text-sm">{formatTimestamp(offer.timestamp)} </td>
                                                  <td className="flex flex-col items-end">
                                                      <p className='font-bold text-sm'>{ethers.utils.formatEther(offer.amount)} ETH</p>
                                                      <p className='font-normal text-sm'>{(parseFloat(ethers.utils.formatEther(offer.amount)) * ethPrice).toFixed(3)} $</p>
                                                  </td> 
                                              </tr>
                                              );
                                          })
                                      }



                                      </tbody>
                                  </table>
                              </div>

                          </div> }

                              <div className=" h-full w-full">

                                  <h1 className="text-2xl font-medium text-neutral mt-7 mb-7">Historical</h1>
                                  <div className="overflow-x-auto">
                                  <table className="table w-132">
                                      {/* head */}
                                      <tbody className=''>
                                      {/* row 1 */}

                                      {
                                          Historical.map((transaction: any, i: any) => {

                                              return (
                                              <tr key={i}>
                                                  <td className='font-bold'>{shortenAddress(transaction.from)}</td>
                                                  <td className="text-md">{formatDateTime(transaction.timestamp)} • </td>
                                                  <td className="flex flex-col items-end">
                                                      <p className='font-bold text-sm'>{transaction.amount} ETH</p>
                                                      <p className='font-normal text-sm'>{(parseFloat(transaction.amount) * ethPrice).toFixed(3)} $</p>
                                                  </td>
                                              </tr>
                                              );

                                          })
                                      }
                                      </tbody>
                                  </table>
                                  </div>

                              </div>

                              <div className="h-full w-full">
                                  <h1 className="text-2xl font-medium text-neutral my-10">Details</h1>

                                  <div className="w-2/2">

                                      <div className="flex items-center my-2  space-x-4">
                                          <img className="w-8 h-8" src="https://upload.wikimedia.org/wikipedia/commons/b/b7/ETHEREUM-YOUTUBE-PROFILE-PIC.png"/>
                                          <p className='font-medium'> Ethereum (ERC-721) </p>
                                      </div>

                                      <div className="flex items-center my-2 space-x-4">
                                          <svg  className="w-8 h-8" viewBox="0 0 24 24" fill="none" width="24" height="24" xmlns="http://www.w3.org/2000/svg" ><g clipPath="url(#clip0_989_1157)"><path d="M7.1792 11.6071C7.1792 11.515 7.19742 11.4237 7.23281 11.3386C7.2682 11.2535 7.32007 11.1763 7.38542 11.1113C7.45078 11.0463 7.52834 10.9948 7.61364 10.9599C7.69895 10.925 7.79031 10.9073 7.88248 10.9078L9.04701 10.911C9.13902 10.911 9.23013 10.9291 9.31512 10.9643C9.40012 10.9996 9.47733 11.0512 9.54236 11.1163C9.60738 11.1814 9.65894 11.2587 9.69408 11.3437C9.72922 11.4287 9.74725 11.5198 9.74715 11.6118V16.0174C9.87837 15.9781 10.0465 15.9372 10.2312 15.894C10.3591 15.8638 10.4731 15.7912 10.5547 15.6881C10.6363 15.585 10.6806 15.4574 10.6807 15.3259V9.86048C10.6807 9.6746 10.7545 9.49633 10.886 9.36489C11.0174 9.23346 11.1957 9.15962 11.3816 9.15962H12.5485C12.6405 9.15962 12.7316 9.17775 12.8166 9.21298C12.9016 9.24821 12.9788 9.29985 13.0438 9.36494C13.1088 9.43003 13.1604 9.5073 13.1955 9.59233C13.2307 9.67736 13.2487 9.76848 13.2486 9.86048V14.9331C13.2486 14.9331 13.5409 14.8152 13.8254 14.6942C13.9311 14.6495 14.0214 14.5745 14.0848 14.4788C14.1482 14.3831 14.1821 14.2708 14.1821 14.156V8.10911C14.1821 8.01711 14.2002 7.92601 14.2355 7.84102C14.2707 7.75603 14.3224 7.67882 14.3875 7.6138C14.4526 7.54878 14.5298 7.49723 14.6149 7.4621C14.6999 7.42696 14.791 7.40893 14.883 7.40903H16.0499C16.2356 7.40903 16.4137 7.48279 16.545 7.61408C16.6763 7.74537 16.7501 7.92344 16.7501 8.10911V13.0882C17.7621 12.3551 18.7876 11.4728 19.6009 10.4121C19.7192 10.258 19.7975 10.0771 19.8287 9.88538C19.86 9.6937 19.8433 9.49726 19.78 9.31362C19.2294 7.70882 18.1966 6.3132 16.8228 5.3175C15.4489 4.32181 13.8011 3.77462 12.1045 3.75072C7.53045 3.69022 3.75004 7.42553 3.75004 12.0016C3.74561 13.4495 4.12346 14.873 4.84542 16.1282C4.94499 16.2998 5.09149 16.4395 5.26771 16.5308C5.44393 16.6221 5.64254 16.6613 5.84023 16.6436C6.06024 16.6247 6.33527 16.5964 6.66216 16.5587C6.80455 16.5427 6.93606 16.4748 7.03157 16.368C7.12709 16.2612 7.17992 16.1229 7.17999 15.9797V11.6071H7.1792ZM7.15406 18.6723C8.42322 19.5956 9.92955 20.1375 11.4961 20.2343C13.0626 20.3311 14.6242 19.9789 15.9974 19.2189C17.3706 18.459 18.4984 17.3229 19.2482 15.9442C19.998 14.5655 20.3387 13.0015 20.2303 11.4358C17.2176 15.9309 11.6535 18.0327 7.15484 18.6723" fill="currentColor"></path></g><defs><clipPath id="clip0_989_1157"><rect width="16.5" height="16.5" fill="white" transform="translate(3.75 3.75)"></rect></clipPath></defs></svg>
                                          <p className='font-medium'> View on Etherscan </p>
                                          <svg className="w-3 h-3" viewBox="0 0 10 10" fill="none" width="10" height="10" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9 0.250061H1C0.585786 0.250061 0.25 0.585847 0.25 1.00006C0.25 1.41427 0.585786 1.75006 1 1.75006H7.18934L0.46967 8.46973C0.176777 8.76262 0.176777 9.2375 0.46967 9.53039C0.762563 9.82328 1.23744 9.82328 1.53033 9.53039L8.25 2.81072V9.00006C8.25 9.41428 8.58579 9.75006 9 9.75006C9.41421 9.75006 9.75 9.41428 9.75 9.00006V1.00006C9.75 0.808119 9.67678 0.616178 9.53033 0.469731C9.45842 0.397824 9.37555 0.34357 9.28709 0.30697C9.19866 0.2703 9.10169 0.250061 9 0.250061Z" fill="currentColor"></path></svg>
                                      </div>
                                      
                                  </div>
                              </div>
                              

                          </div>

                      </div>

                      {/* Right */}
                      <div className="h-200 w-2/5 p-2">
                          <div className="sticky top-20 z-19 w-full ">

                              <h1 className="text-3xl xl:text-4xl font-bold text-neutral mb-1 pt-12">{nft?.name}</h1>

                              <div className="flex flex-row gap-12">

                                  {/* <div className="flex items-center space-x-4 mt-5">
                                      <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                                      <div className="font-medium ">
                                          <div className='text-gray-500'>Artist</div>
                                          <div className="text-sm ">fabianoLerazi</div>
                                      </div>
                                  </div> */}

                                  <div className="flex items-center space-x-4 mt-5">
                                      <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                                      <div className="font-medium">
                                          <div className='text-gray-500'>Owner</div>
                                          <div className="text-sm ">{nft?.owner}</div>
                                      </div>
                                  </div>

                              </div>

                              { nft.type === "sale" ? 

                                  <SalesComponant 
                                      nft={nft}
                                      setShowLoading={setShowLoading}
                                      setShowModalSucces={setShowModalSucces}
                                      setTransactionHash={setTransactionHash}
                                      ethPrice={ethPrice}
                                      showModalBuyNow={setShowModalBuyNow}
                                      showModalOffer={setShowModalOffer}
                                  />

                              :   

                                  <AuctionComponant
                                      nft={nft}
                                      highestBid={highestBid}
                                      setShowLoading={setShowLoading}
                                      setShowModalSucces={setShowModalSucces}
                                      setTransactionHash={setTransactionHash}
                                      ethPrice={ethPrice}
                                      setShowModalBid={setShowModalBid}
                                  />
                              
                              }

                              

                          </div>
                      </div>

                  </div>

                  <div className="mt-32 flex flex-col items-center mb-32">

                      <h1 className="text-2xl font-medium text-neutral mb-20">More from this collection</h1>

                           <div className="flex flex-row h-full w-full space-x-5">
                              <div className="border border-gray-800 h-64 w-1/6 "> 
                              </div>
                              <div className="border border-gray-800 h-64 w-1/6"> 
                              </div> 
                              <div className="border border-gray-800 h-64 w-1/6"> 
                              </div>
                              <div className="border border-gray-800 h-64 w-1/6"> 
                              </div>
                              <div className="border border-gray-800 h-64 w-1/6"> 
                              </div>
                              <div className="border border-gray-800 h-64 w-1/6"> 
                              </div>
                          </div>

                  </div>

                  {showLoading ? (
                      <Loading 
                          setShowLoading={setShowLoading} 
                          transaction= "null"
                          transactionHash={transactionHash}
                      />
                  ) : null}

                  {showModalSucces ? (
                      <Success 
                          setShowModalSucces={setShowModalSucces} 
                          transaction= "null"
                          transactionHash={transactionHash}
                      />
                  ) : null}

                  {showModalBid ? (
                      <Bid
                          setShowModalBid={setShowModalBid}
                          setTransactionHash={setTransactionHash}
                          ethPrice={highestBid}
                          nft={nft}
                          bid={bid}
                      />
                  ) : null}

                  {showModalOffer ? (
                      <MakeOffer_Modal
                      showModal={setShowModalOffer}
                      nft={nft}
                      highestBid={highestBid}
                      makeAnOffer={makeAnOffer}
                      />
                  ) : null
                  }

                  {showModalBuyNow ? (
                      <BuyNow_Modal
                      showModal={setShowModalBuyNow}
                      nft={nft}
                      />
                  ) : null
                  }



                  



              </div> 
          </div>
      </div>

  </div>
)
}

export default NFTDetails;
