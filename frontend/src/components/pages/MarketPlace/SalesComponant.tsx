import React from "react";
import Countdown from "react-countdown";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

export default function SalesComponant({
  nft,
  showLoading,
  setShowLoading,
  setShowModalSucces,
  setTransactionHash,
  ethPrice,
  showModalBuyNow,
  showModalOffer,
  burnNft,
}: any) {
  const { address } = useAccount();

  const buyNFT = async (TokenId: any, price: any) => {
    try {
      // convert price to uint256 price

      const priceWei = ethers.utils.parseEther((0.05).toString());

      //    const transaction = await myNftMarket.buy(TokenId, priceWei)

      setTransactionHash("0xzdadzadddddddazzadazdazddx");
      //    setTransactionHash(transaction.hash)
      setShowLoading(true);
      //    await transaction.wait()
      //    setShowLoading(false)

      // setTimeOut of 5 seconds

      setTimeout(() => {
        setShowLoading(false);
        setShowModalSucces(true);
        setTimeout(() => {
          setShowModalSucces(false);
        }, 3000);
      }, 3000);

      // console.log(transaction)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-7 items-center justify-between w-full space-y-4 border-t py-4 sm:flex-row sm:space-y-0 border-gray-300 border px-5 rounded-xl ">
      <div className="w-full">
        <div className="w-full my-2">
          <div className="">
            <div className="text-sm">Price</div>
            <div className="flex flex-row items-center space-x-2">
              <div className="text-neutral font-medium text-3xl">
                {nft?.price} ETH
              </div>
              <div className="stat-title pt-1">
                = {(ethPrice * nft.price).toFixed(3)} ${" "}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {nft.owner !== address ? (
          <>
            {showLoading ? (
              <button
                type="button"
                className="bg-transparent w-full mt-3 mr-3 text-text-info font-semibold  py-2 px-4 border rounded-xl"
              >
                {/* SVG */}
                <span className="sr-only">Transaction en cours...</span>
              </button>
            ) : (
              <button
                onClick={() => showModalBuyNow(true)}
                type="button"
                className="bg-transparent w-full mt-3 mr-3 text-text-info font-semibold  py-2 px-4 border rounded-xl"
              >
                Buy now for {nft?.price} ETH
              </button>
            )}
            <button
              onClick={() => showModalOffer(true)}
              type="button"
              className="bg-neutral w-full mt-3 mr-3 text-white font-semibold py-2 px-4 border rounded-xl"
            >
              Make an offer
            </button>
          </>
        ) : (
          <>
            <button
              //onClick={() => showModalCancelSale(true)}
              type="button"
              className="bg-neutral w-full mt-3 mr-3 text-white font-semibold py-2 px-4 rounded-xl"
            >
              Cancel sale
            </button>
            <div className="flex justify-center pt-2">
              <div className="border-b-2 border-gray-300 w-2/3"></div>
            </div>
            <button
              onClick={() => burnNft()}
              type="button"
              className="bg-red-600 w-full mt-3 mr-3 text-white font-semibold py-2 px-4 border rounded-xl"
            >
              Burn NFT
            </button>
          </>
        )}
      </div>

      <div className="w-full flex flex-row items-center justify-center space-x-2 pt-5">
        <p className="text-gray-600 text-sm"> Sale ends in </p>
        {nft && nft.listEndTime ? (
          <Countdown date={Date.now() + nft.listEndTime} />
        ) : (
          <p> 00:00:00:00</p>
        )}
      </div>
    </div>
  );
}
