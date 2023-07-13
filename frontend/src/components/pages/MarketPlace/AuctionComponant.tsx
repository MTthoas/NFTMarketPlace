import React from "react";
import Countdown from "react-countdown";

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

      <button
        onClick={() => {
          setShowModalBid(true);
        }}
        className="w-full bg-neutral py-2 mb-2 rounded-md text-white"
      >
        Place a bid
      </button>
    </div>
  );
}
