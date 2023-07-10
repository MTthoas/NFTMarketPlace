import React, {useState} from 'react'
import { useAccount, useBalance } from "wagmi";

export default function Bid({
    setShowModalBid,
    setTransactionHash,
    ethPrice,
    nft
}: any) {

    const { address } = useAccount();
    const { data } = useBalance({address: address});

    const [tokenPrice, setTokenPrice] = useState<string>("");
    const [tokenExpiration, setTokenExpiration] = useState<string>("");
    

    const formatAddress = (address: any) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      };

  return (
    <div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto max-w-3xl w-3/5 xl:w-2/5 2xl:w-1/5">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-6 rounded-t">
              <h3 className="text-2xl font-semibold">
                Place a bid
              </h3>
              <button
                className="p-1 pb-2 ml-auto border-0 text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModalBid(false)}
              >
                ×
              </button>
            </div>
            {/*body*/}
            <div className='px-6 font-medium text-sm text-gray-500 '>
                <p> You are about to place a bid for <span className='text-black'> {nft.name}</span>. This bid can also be accepted
                after the auction by new owner.</p>
            </div>

            <div className="mb-8 mx-4 mt-4 flex flex-row place-items-center border border-gray-400 p-4 rounded-xl border-solid">
                <div>
                  <img
                    className="w-10"
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIiIGhlaWdodD0iMjIiIHZpZXdCb3g9IjAgMCAyMSAyMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTAuNSAyMS41QzQuNzAxMDEgMjEuNSAwIDE2Ljc5OSAwIDExQzAgNS4yMDA5OCA0LjcwMTAxIDAuNDk5OTY5IDEwLjUgMC40OTk5NjlDMTYuMjk5IDAuNDk5OTY5IDIxIDUuMjAwOTggMjEgMTFDMjEgMTYuNzk5IDE2LjI5OSAyMS41IDEwLjUgMjEuNVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8zMTIxXzk1MDIpIi8+CiAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNC42MDEgMTEuMTJMMTAuNDk5NyA0LjQzNzQ3TDYuMzk5OTMgMTEuMTJMMTAuNDk5NyAxMy41Mjg5TDE0LjYwMSAxMS4xMlpNMTQuNjAxMSAxMS44ODU2TDEwLjQ5OTcgMTQuMjYzMUw2LjM5NzIzIDExLjg4MzJMMTAuNDk5NyAxNy41NTlMMTQuNjAxMSAxMS44ODU2WiIgZmlsbD0iI0ZERkVGRSIvPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzMxMjFfOTUwMiIgeDE9IjEwLjUiIHkxPSIwLjQ5OTk2OSIgeDI9IjEwLjUiIHkyPSIyMS41IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiM2QjhDRUYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNkI3MEVGIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+Cg=="
                    alt="ETH logo"
                  />
                </div>
                <div className="w-full ml-4">
                  <div className="flex grow justify-between">
                    <p className="font-bold text-lg">
                      {formatAddress(address)}
                    </p>
                    <div>
                      <div className="px-1.5 py-1 rounded bg-green-200/[.5]">
                        <p className="text-green-500 text-xs font-medium leading-4">
                          Connected
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ethereum</p>
                  </div>
                </div>
            </div>

            <div className="grid mb-4 mx-4">
                <label className="mb-1 font-bold text-base">Bid Price</label>
                <input
                type="number"
                step="0.000001"
                value={tokenPrice}
                onChange={(e) => setTokenPrice(e.target.value)}
                placeholder="Price in ETH"
                className="border border-gray-400 px-4 py-2 rounded-xl transition-colors"
                />
            </div>

            <div className="grid mb-4 mx-4">
                <label className="mb-1 font-bold text-base">Bid expiration</label>
                <input
                type="number"
                step="0.000001"
                value={tokenExpiration}
                onChange={(e) => setTokenExpiration(e.target.value)}
                placeholder="Bid expiration"
                className="border border-gray-400 px-4 py-2 rounded-xl transition-colors"
                />
            </div>

            <div className='flex justify-between mx-5 text-sm text-gray-500 mt-3'>
                <p> Your balance </p>
                <p className="text-black"> {Number((data?.formatted)).toFixed(5)} {data?.symbol} </p>
            </div>

            <div className='flex justify-between mx-5 py-1 text-sm text-gray-500'>
                <p> Artx Fee </p>
                <p className="text-black"> 1% </p>
            </div>

            <div className='border-t-2 mx-5 px-4 mt-3  py-1 border-gray-500'> </div>

            <div className='flex justify-between mx-5 my-2 text-sm text-gray-500'>
                <p> Total Price </p>
                <p className="text-black"> {(Number(tokenPrice) + (1/100)).toFixed(5)} ETH </p>
            </div>

            <button className="bg-neutral mx-4 mt-3 mb-7 py-2 rounded-lg text-white"> 
                Place Bid
            </button>

            



        </div>
      </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black">

      </div>
    </div>
  )
}

