import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../../contracts/marketplace.json';

import Contracts from '../../../contracts/contracts.json';

import { NFT } from '../../interface/NFT';
import NFT_CARD_WALLET from '../../card/NFT_CARD_WALLET';

import ListToken from '../Create/ListToken';


function Wallet() {

    const [data, updateData] = useState<NFT[]>([]);
    const [adress, setAdress] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [value, setValue] = useState<NFT>();
    const [dataLogs, setData] = useState(data);

    

    const [loading, setLoading] = useState<Record<string, boolean>>({});


    async function getMyNFTs() {
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);

            let NFTContract = new ethers.Contract(Contracts.nftContract.address, Contracts.nftContract.abi, provider);

           // Get adress of user

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // GetAllMyNfts with the user adress in parameter

            let transaction = await NFTContract.getMyNFTs(account);

                const items = await Promise.all(transaction.map(async (i: any) => {
                const tokenURI = await NFTContract.tokenURI(i.tokenId);

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

    const ListOnMarketPlace = async (tokenId : any, method: any, price: any, time: any) => {
        try {
            setLoading(prev => ({ ...prev, [tokenId]: true }));
            console.log("List")
            localStorage.setItem(`loading-${tokenId}`, 'true'); // save loading state to local storage
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let NFTContract = new ethers.Contract(Contracts.nftContract.address, Contracts.nftContract.abi, signer);
    
            // console.log("Token ID: ", tokenId);
            // console.log("Method: ", method);
            // console.log("Price: ", price);

            // if (typeof time === 'string') {
            //     if (time.includes('jour')) {
            //         // Extract the number from the string
            //         const days = parseInt(time);
            //         if (isNaN(days)) {
            //             throw new Error('Invalid time format. Expected "n jour"');
            //         }
            //         // Convert days to seconds
            //         time = days * 24 * 60 * 60;
            //     } else if (time.includes('heures')) {
            //         // Extract the number from the string
            //         const hours = parseInt(time);
            //         if (isNaN(hours)) {
            //             throw new Error('Invalid time format. Expected "n heures"');
            //         }
            //         // Convert hours to seconds
            //         time = hours * 60 * 60;
            //     }
            // }
            
            // // Convert the time to BigNumber
            // const timeInSeconds = ethers.BigNumber.from(time);

            const priceInWei = ethers.utils.parseUnits(price.toString(), 'ether');

            
            // console.log("Type of Token ID: ", typeof tokenId);
            // console.log("Type of Price: ", typeof priceInWei);
            // console.log("Type of Time: ", typeof timeInSeconds);
                        
    
            let transaction;
            if (method === 'Timed auction') {
                console.log("Auction")
                // transaction = await contract.startAuction(tokenId, priceInWei, 2);
            } else {
                transaction = await NFTContract.listTokenForSale(tokenId, priceInWei);
            }
    
            const receipt = await transaction.wait();
    
            if (receipt.status === 0) {
                throw new Error('Transaction failed');
            }
        
            console.log("Transaction Done");
    
            setData({
                ...data,
            });
    
        } catch (error) {
            console.error("Transaction was rejected: ", error);
        } finally {
            setLoading(prev => ({ ...prev, [tokenId]: false }));
            localStorage.setItem(`loading-${tokenId}`, 'false'); // save loading state to local storage
        }
    };

    const getNftDetails = async (tokenId: any) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, signer);

            const tokenDetails = await contract.getNFTDetails(tokenId);

            console.log(tokenDetails);

        } catch (error) {
            console.error(error);
        }
    };

    

    const UnlistOnMarketPlace = async (tokenId : any) => {
        try {
            setLoading(prev => ({ ...prev, [tokenId]: true }));
            localStorage.setItem(`loading-${tokenId}`, 'true'); // save loading state to local storage

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(MarketPlaceJSON.address, MarketPlaceJSON.abi, signer);

            const transaction = await contract.unlistTokenForSale(tokenId);

            const receipt = await transaction.wait();

            if (receipt.status === 0) {
                throw new Error('Transaction failed');
                   localStorage.setItem(`loading-${tokenId}`, 'false'); // save loading state to local storage
            }

            console.log("Transaction Done");

            setData({
                ...data
            });

        } catch (error) {
            console.error("Transaction was rejected: ", error);

            setLoading(prev => ({ ...prev, [tokenId]: false }));

            localStorage.setItem(`loading-${tokenId}`, 'false'); // save loading state to local storage
            
        } finally {
            setLoading(prev => ({ ...prev, [tokenId]: false }));

            localStorage.setItem(`loading-${tokenId}`, 'false'); // save loading state to local storage
        }
    };

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
                                loading = {loading[value.tokenId] || false}
                                getNftDetails={getNftDetails}
                                unlistMethod={UnlistOnMarketPlace}
                            />
                        </div>
                        
                    )
                })}
                </div>

                {showModal ? (
                     <ListToken 
                     setShowModal={setShowModal} 
                     value={value}
                      unlistMethod={UnlistOnMarketPlace} 
                      listMethod={ListOnMarketPlace}/>
                ) : null}


            </div>
        </div>
    );
}

export default Wallet;