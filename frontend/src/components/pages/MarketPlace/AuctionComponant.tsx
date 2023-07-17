import React from "react";
import Countdown from "react-countdown";
import { useAccount } from "wagmi";

import Bid from "../../modal/Bid";

export default function AuctionComponant({
  nft,
  highestBid,
  showLoading,
  setShowLoading,
  setShowModalSucces,
  setTransactionHash,
  setShowModalBid,
  ethPrice,
  burnNft,
  isLoadingDelete,
  setShowModalList,
  isLoadingListing,
  isLoadingUnlisting
}: any) {
  const { address } = useAccount();

  return (
    <div className="mt-7 items-center justify-between w-full space-y-4 border-t py-4 sm:flex-row sm:space-y-0 border-gray-300 border px-5 rounded-xl">
      <div className="w-full flex gap-x-3 gap-y-6 mb-4">
        <div className="border-gray-300 border h-24 w-full rounded-lg flex-col px-3 pt-3">
          <p className="font-semibold text-sm text-gray-600  "> Time left </p>
          <div className="text-lg font-semibold">
            {nft && nft.listEndTime ? (
              <Countdown date={Date.now() + nft.listEndTime} />
            ) : (
              <p> 00:00:00:00</p>
            )}
          </div>
          <div className="text-sm stat-title font-medium pl-1">
            d : hrs : min : sec
          </div>
        </div>

        <div className="border-gray-300 border h-24 w-full rounded-lg flex-col px-3 pt-3">
          <p className="font-semibold text-sm text-gray-600"> Minimum Bid </p>
          <p className="text-xl font-semibold"> {highestBid} ETH </p>
          <div className="stat-title mt-1 font-medium text-xs">
            $ {(ethPrice * nft?.price).toFixed(3)}{" "}
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="w-full">
        {nft.owner === address ? (
          <>
            {nft.type === "auction" && (
              <>
                {/* <button
                  //onClick={() => {showModalEndAuction(true);}}
                  className="w-full bg-neutral py-2 mb-2 rounded-xl text-white"
                >
                  End Auction
                </button> */}
                {/* <button
                  //onClick={() => {showModalCancelAunction(true);}}
                  className="w-full bg-neutral py-2 mb-2 rounded-xl text-white"
                >
                  Cancel Auction
                </button> */}
                {/* Divider */}
       
              </>
            )}
            {/* En vrai si tu veux pas te casser la tête à vérifier si le nft est sur le marché ou non avant de le burn
            tu peux juste mettre le bouton burn dans le else du if (nft.type === "auction") comme ca il apparaitra que
            si le nft n'est pas sur le marché (oubli pas de rajouter le divider avec)
            */}
            <div className="w-full pt-2">
              {isLoadingDelete ? (
                <button className="w-full bg-red-600 py-2 mb-2 rounded-xl text-white">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Loading...
                </button>
              ) : (
                <div>
                  { isLoadingListing && nft.type === "sales" ? 
                    <button className="w-full bg-neutral py-2 mb-2 rounded-xl text-white">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </button> :
                    <button
                    onClick={() => setShowModalList(true)}
                    className="w-full bg-neutral py-2 mb-2 rounded-xl text-white"
                    >
                    List on marketplace
                  </button>
                  }
                  
                  <button
                    onClick={() => burnNft()}
                    className="w-full bg-red-600 py-2 mb-2 rounded-xl text-white"
                  >
                    Burn NFT
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          nft.type === "auction" && (
            <button
              onClick={() => {
                setShowModalBid(true);
              }}
              className="w-full bg-neutral py-2 mb-2 rounded-xl text-white"
            >
              Place a bid
            </button>
          )
        )}

        {/* On pourrait rajouter un bouton lister sur le marcher mais flemme en vrai. Ca rajoute du travail on plus le temps. */}
      </div>
    </div>
  );
}
