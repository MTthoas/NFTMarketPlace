import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../contracts/marketplace.json';
import { NFT } from '../interface/NFT';

const NFT_CARD_MARKETPLACE = ({tokenId, seller, owner, price, image, data} : {tokenId: number, seller: string, owner: string, price: string, image: string, data: NFT})  => {

    const [dataLogs, setData] = useState(data);
    const [key, setKey] = useState(Date.now());


    return (
        <div key={key} className="shadow-md rounded-md m-2 transition duration-500 hover:scale-110 cursor-pointer h-64">
            <img className="object-cover w-full max-h-50 rounded mr-2" src={"https://salmon-broad-weasel-155.mypinata.cloud/ipfs/"+image} alt={`${tokenId}`} />
            {/* <div className="flex my-2">
            <p className="py-1 px-3 bg-black bg-opacity-10 text-black text-sm font-medium rounded-full">{nft.sellType === 'Auction' ? nft.nftTimeLeft : nft.sellType}</p>
            </div> */}
            
            <div className="px-4">

                <div className='pt-4 flex flex-row  justify-between'>
                    <p className="  text-black font-medium text-md flex justify-start">{dataLogs.name}</p>
                    <button className="border border-gray-300 text-xs px-2 rounded-md"> #{tokenId} </button>
                </div>
                
                <p className="text-black  font-medium flex my-2"> {price} ETH </p>
    
            </div>

            {/*
            <div className="flex">
            <p className="text-black my-auto text-md font-bold">
                {nft.sellType === 'Auction' ? nft.nftHighestBid : nft.nftPrice}{nft.nftCoin}
            </p>
            </div> */}
      </div>
    );
}

export default NFT_CARD_MARKETPLACE;