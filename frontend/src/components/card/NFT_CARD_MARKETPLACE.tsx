import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../contracts/marketplace.json';

import { Link } from 'react-router-dom';

import { NFT } from '../interface/NFT';

import Contracts from '../../contracts/contracts.json';


const NFT_CARD_MARKETPLACE = ({tokenId, owner, price, image, type, data} : {tokenId: number, owner: string, price: string, image: string, type:any, data: NFT})  => {

    const [dataLogs, setData] = useState(data);
    const [key, setKey] = useState(Date.now());

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
      };
    

    return (
        <>
        <Link to={`/nft/${tokenId}`}>
        <div className="h-[358px] w-[200px] border rounded-xl border-gray-400 overflow-hidden">
            <div key={key} className="flex flex-col h-full p-1.5">
                <img
                    className="w-[200px] h-[200px] object-cover rounded-xl"
                    src={"https://salmon-broad-weasel-155.mypinata.cloud/ipfs/" + image}
                    alt={`${tokenId}`}
                />
                <div className="mt-4">
                    <div className="mx-3 flex justify-between">
                        <p className="font-semibold text-lg">
                            {dataLogs.name}
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

                            { type == "sale" ? 
                            <>
                                <p className="font-semibold text-sm text-slate-500">
                                    Price
                                </p>
                                <p className="font-semibold text-sm pt-1">
                                    {price} ETH
                                </p>
                            </>
                            : 
                            <>
                                <p className="font-semibold text-sm text-slate-500">
                                    Time left
                                </p>
                                <p className="font-semibold text-sm pt-1">
                                    25 days
                                </p>
                            </>
                            }

                        </div>

                        <div className="col-span-1 w-full">
                         { type == "sale" ? 
                            <>
                                <p className="font-semibold text-sm text-slate-500">
                                    Highest Bid
                                </p>
                                <p className="font-semibold text-xs pt-1">
                                    No bids yet
                                </p>
                            </>
                            : 
                            <>
                                <p className="font-semibold text-xs text-slate-500">
                                    Minimum Bid
                                </p>
                                <p className="font-semibold text-sm pt-2">
                                    6.19 wEth
                                </p>
                            </>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </Link>

      </>
    );
}

export default NFT_CARD_MARKETPLACE;