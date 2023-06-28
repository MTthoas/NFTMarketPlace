import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import MarketPlaceJSON from '../contracts/marketplace.json';
import { NFT } from './interface/NFT';
import NFT_CARD_WALLET from './card/NFT_CARD_WALLET';

import ListToken from './modal/ListToken';


function Wallet() {

    const [data, updateData] = useState<NFT[]>([]);
    const [adress, setAdress] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState<NFT>();

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

                console.log(ethValue)

                let item = {
                    tokenId: i.tokenId.toNumber(),
                    name: metadata.name,
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
        setInfos();
        getMyNFTs();
    }, []);

    const setInfos = async() => {
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAdress(accounts[0])

    }


    return (
        <div className="container mx-auto">
            <div className=" flex flex-col place-items-left mt-20">
                <div className="md:text-3xl text-2xl font-bold">
                    Wallet
                </div>
                <div className="my-3">
                    <p> {adress} </p>
                    <p> Joined 21 june 2023 </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">               
                 {data.map((value, index) => {
                    console.log(value.name)
                    return(
                        <div key={index}>
                            <NFT_CARD_WALLET 
                                key={index}
                                tokenId={value.tokenId}
                                seller={value.seller}
                                owner={value.owner}
                                price={value.price}
                                image={value.image}
                                data={value}
                                setShowModal={setShowModal}
                                setValue={setValue}
                            />
                        </div>
                        
                    )
                })}
                </div>

                {showModal ? (
                     <ListToken setShowModal={setShowModal} value={value}/>
                ) : null}


            </div>
        </div>
    );
}

export default Wallet;