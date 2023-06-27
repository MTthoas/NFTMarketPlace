import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import MarketPlaceJSON from '../contracts/marketplace.json';
import { NFT } from './interface/NFT';

function Wallet() {

    const [data, updateData] = useState<NFT[]>([]);

    async function getMyNFTs() {
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            
            let contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, provider);

           // Get adress of user

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // GetAllMyNfts with the user adress in parameter

            let transaction = await contract.getMyNFTs(account);

            const items = await Promise.all(transaction.map(async (i: any) => {
                const tokenURI = await contract.tokenURI(i.tokenId);

                const metadata = JSON.parse(tokenURI);
                console.log(metadata);

                const ethValue = ethers.utils.formatEther(i.price);

                let item = {
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: metadata.image,
                    price : ethValue,
                    currentlyListed: i.currentlyListed
                }
                return item;
            }));

            console.table(items);
            updateData(items);

                    
        }catch(error : any){
            console.log(error);
        }

    }

    useEffect(() => {
        getMyNFTs();
    }, []);

            
    const ListOnMarketPlace = async (tokenId : any) => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, signer);
      
          // Convert the price to wei (if necessary)
          const priceWei = ethers.utils.parseEther("0.1");

          console.log("Token ID: ", tokenId);

            const transaction = await contract.listTokenForSale(tokenId, priceWei);

            await transaction.wait();
          
            
      
          console.log("Transaction Done");
        } catch (error) {
          console.log(error);
        }
      };
      


    return (
        <div>
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold">
                    Wallet
                </div>
                <div className="flex mt-5 justify-between px-24 flex-wrap max-w-screen-xl text-center gap-5">
                    {data.map((value, index) => {
                        return(
                            <div key={index} className="nft-item">
                                <p>Token ID: {value.tokenId}</p>
                                <p>Seller: {value.seller}</p>
                                <p>Owner: {value.owner}</p>
                                <p> Price : {value.price}</p>
                                <p>Currently Listed: {value.currentlyListed.toString()}</p>
                                <img src={"https://salmon-broad-weasel-155.mypinata.cloud/ipfs/"+value.image} alt="NFT" className="nft-image w-64 "/>
                                
                                <button onClick={() => ListOnMarketPlace(value.tokenId)} className="buy-button">
                                    List on MarketPlace
                                </button>

                                
                                
                            </div>

                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Wallet;