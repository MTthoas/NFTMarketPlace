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
                <button
                  //onClick={() => {showModalEndAuction(true);}}
                  className="w-full bg-neutral py-2 mb-2 rounded-xl text-white"
                >
                  End Auction
                </button>
                <button
                  //onClick={() => {showModalCancelAunction(true);}}
                  className="w-full bg-neutral py-2 mb-2 rounded-xl text-white"
                >
                  Cancel Auction
                </button>
                {/* Divider */}
                <div className="flex justify-center">
                  <div className="border-b-2 border-gray-300 w-2/3"></div>
                </div>
              </>
            )}
            {/* En vrai si tu veux pas te casser la tête à vérifier si le nft est sur le marché ou non avant de le burn
            tu peux juste mettre le bouton burn dans le else du if (nft.type === "auction") comme ca il apparaitra que
            si le nft n'est pas sur le marché (oubli pas de rajouter le divider avec)
            */}
            <div className="w-full pt-2">
              <button
                //onClick={() => {showModalBurn(true);}}
                className="w-full bg-red-600 py-2 mb-2 rounded-xl text-white"
              >
                Burn NFT
              </button>
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
