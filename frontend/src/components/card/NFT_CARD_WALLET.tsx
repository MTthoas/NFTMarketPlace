import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../contracts/marketplace.json';
import { NFT } from '../interface/NFT';

const NFT_CARD_WALLET = ({tokenId, seller, owner, price, image, data} : {tokenId: number, seller: string, owner: string, price: string, image: string, data: NFT})  => {
    
    const [loading, setLoading] = useState(false)
    const [key, setKey] = useState(Date.now());
    const [dataLogs, setData] = useState(data);

 
    function truncate(str : any, n : any){
        return (str.length > n) ? str.slice(0, n-1) + '...' : str;
    };

    const ListOnMarketPlace = async (tokenId : any) => {
        try {
            setLoading(true); // start loading
            localStorage.setItem(`loading-${tokenId}`, 'true'); // save loading state to local storage
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, signer);
        
            // Convert the price to wei (if necessary)
            const priceWei = ethers.utils.parseEther("0.1");
    
            console.log("Token ID: ", tokenId);
    
            const transaction = await contract.listTokenForSale(tokenId, priceWei);
    
            const receipt = await transaction.wait();
    
            if (receipt.status === 0) {
                throw new Error('Transaction failed');
            }
        
            console.log("Transaction Done");

             setData({
                ...dataLogs,
                currentlyListed: true,
            });


        } catch (error) {
            console.error("Transaction was rejected: ", error);
        } finally {
            setLoading(false); // stop loading regardless of the result
            localStorage.setItem(`loading-${tokenId}`, 'false'); // save loading state to local storage
            setKey(Date.now());
        }
    };
    

    useEffect(() => {
        const savedLoadingState = localStorage.getItem(`loading-${tokenId}`) === 'true';
        setLoading(savedLoadingState);
    }, []);
    
    return (
        <div key={key} className="shadow-md rounded-md m-2 transition duration-500 hover:scale-110 cursor-pointer h-101">
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

                <p className="text-xs pt-1"> {dataLogs.currentlyListed === true ? "Disponible dans la marketPlace" : "" }</p>

                {dataLogs.currentlyListed == false ? 
                loading == false ? 
                <button onClick={() => ListOnMarketPlace(tokenId)} disabled={loading} className="text-xs  border border-gray-300 rounded-md py-2 mt-5 hover:bg-neutral hover:text-white w-full "> Lister sur le market 
                </button>
                : <button className="text-xs border border-gray-300 rounded-md py-2 mt-5 w-full">
                     <div role="status">
                        <svg aria-hidden="true" className="w-5 h-5 mx-auto flex justify-start text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                </div>
                </button>
                : <>
                 <button className="text-xs  border border-gray-300 rounded-md py-2 mt-1 hover:bg-neutral hover:text-white w-full"> Ne plus lister sur le market
                </button>
                </>}

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

export default NFT_CARD_WALLET;