import React, { useState, useEffect } from "react";
import { NFT } from "../interface/NFT";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

import Contracts from "../../contracts/contracts.json";

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


function functionConvetMiliSecondsToTime(millisec : any){

  var seconds = (millisec / 1000).toFixed(0);
  var minutes = (millisec / (1000 * 60)).toFixed(0);
  var hours = (millisec / (1000 * 60 * 60)).toFixed(0);
  var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);

  if (parseInt(seconds) < 60) {
      return seconds + " Sec";
  } else if (parseInt(minutes) < 60) {
      return minutes + " Min";
  } else if (parseInt(hours) < 24) {
      return hours + " Hrs";
  } else {
      return days + " Days"
  }
}

const NFT_CARD_WALLET = ({
  tokenId,
  owner,
  price,
  image,
  type,
  data,
  loading,
  setShowModal,
  setValue,
  unlistMethod,
}: {
  tokenId: number;
  owner: string;
  price: string;
  image: string;
  type: any;
  data: NFT;
  loading: any;
  setShowModal: any;
  setValue: any;
  unlistMethod: any;
}) => {
  const [dataLogs, setData] = useState(data);
  const [key, setKey] = useState(Date.now());
  const [metaData, setMetaData] = useState<any>([]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const LimitString = (str: string, limit: number) => {
    if (str.length > limit) {
      return str.slice(0, limit) + "...";
    } else {
      return str;
    }
  };

  function getCurrentTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  const getMetaDataOfNft = async () => {
    const transactionSales = await myNftMarket.getAllData(tokenId);
    console.table(transactionSales);

    const getAttributes = await myNFT.getTokenAttributes(tokenId);
    console.log("dqdsdqsdqsdqsdqsdq", getAttributes);

    const isOnSale = await myNftMarket.isTokenOnSale(tokenId);
    const isOnAuction = await myNftMarket.isTokenOnAuction(tokenId);

    let type = "none";
    let listEndTime = 0;
    let remainingMilliseconds = 0;

    if (isOnSale) {
      type = "sale";
      listEndTime = transactionSales.salesEndTime.toNumber();
    } else if (isOnAuction) {
      type = "auction";
      listEndTime = transactionSales.auctionEndTime.toNumber();
    }

    const remainingSeconds = listEndTime - getCurrentTimestampInSeconds();

    console.log(
      remainingSeconds + " seconds remaining of the auction " + tokenId
    );

    if (remainingSeconds > 0) {
      remainingMilliseconds = remainingSeconds * 1000;
    }

    console.log(
      "Highest bid : " + ethers.utils.formatEther(transactionSales.highestBid)
    );

    let item = {
      tokenId: tokenId,
      highestBid: ethers.utils.formatEther(transactionSales.highestBid),
      listEndTime: remainingMilliseconds,
    };

    setMetaData(item);
  };

  useEffect(() => {
    getMetaDataOfNft();
  }, [tokenId]);

  return (
    <>
      <div className="h-auto max-h-[393px] w-[210px] border rounded-xl border-gray-400 overflow-hidden">
        <Link to={`/nft/${tokenId}`}>
          <div key={key} className="flex flex-col p-1.5">
            <img
              className="w-[200px] h-[200px] object-cover rounded-xl"
              src={
                "https://salmon-broad-weasel-155.mypinata.cloud/ipfs/" + image
              }
              alt={`${tokenId}`}
            />
            <div className="mt-3 mx-3 flex justify-between">
              <p className="font-semibold text-md">
                {dataLogs.name
                  ? LimitString(dataLogs.name, 12)
                  : "Chargement.."}
              </p>
              <p className="border border-gray-400 text-xs ml-2 my-auto py-1 px-2 rounded-lg">
                #{tokenId}
              </p>
            </div>
            <p className="mx-3 mb-4 text-sm text-slate-500">
              Owner: {formatAddress(owner)}
            </p>
            <div className="inline-grid grid-cols-2 gap-3 bg-slate-200 mx-auto px-3 py-2.5 rounded-xl w-full">
              <div className="col-span-1 w-full">
                {type == "sale" ? (
                  <>
                    <p className="font-semibold text-sm text-slate-500">
                      Price
                    </p>
                    <p className="font-semibold text-xs pt-1">{price} ETH</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-sm text-slate-500">
                      Time left
                    </p>
                    <p className="font-semibold text-sm pt-1">
                      {functionConvetMiliSecondsToTime(metaData.listEndTime)}
                    </p>
                  </>
                )}
              </div>

              <div className="col-span-1 w-full">
                {type == "sale" ? (
                  <>
                    <p className="font-semibold text-sm text-slate-500">
                      Highest Bid
                    </p>
                    <p className="font-semibold text-xs pt-1">No bids yet</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-xs text-slate-500">
                      Highest Bid
                    </p>
                    <p className="font-semibold text-sm pt-2">
                      {metaData.highestBid} wEth
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>

        <div className="flex flex-col px-1.5 pb-1.5">
          {data.type == "none" ? (
            loading == false ? (
              <button
                onClick={() => {
                  setShowModal(true);
                  setValue(data);
                }}
                disabled={loading}
                className="text-xs border border-gray-300 rounded-xl py-2 hover:bg-neutral hover:text-white w-full "
              >
                {" "}
                Lister sur le market
              </button>
            ) : (
              <button className="text-xs border border-gray-300 rounded-xl py-1.5 w-full">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 mx-auto flex justify-start text-gray-200 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </button>
            )
          ) : data.type == "sale" ? (
            loading == false ? (
              <button
                onClick={() => unlistMethod(tokenId)}
                className="text-xs border border-gray-300 rounded-md py-2 mt-1 mb-1 hover:bg-neutral hover:text-white w-full"
              >
                {" "}
                Ne plus lister sur le market
              </button>
            ) : (
              <button className="text-xs border border-gray-300 rounded-xl py-1.5 w-full">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 mx-auto flex justify-start text-gray-200 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </button>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default NFT_CARD_WALLET;
