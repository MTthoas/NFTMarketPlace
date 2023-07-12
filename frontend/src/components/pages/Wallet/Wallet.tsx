import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import MarketPlaceJSON from '../../../contracts/marketplace.json';

import Contracts from '../../../contracts/contracts.json';

import { NFT } from '../../interface/NFT';
import NFT_CARD_WALLET from '../../card/NFT_CARD_WALLET';

import ListToken from '../Create/ListToken';

import { BigNumber } from "ethers";


function convertDurationToSeconds(durationText : any) {
    let durationInSeconds;
    switch (durationText) {
        case "1 minutes":
            durationInSeconds = (60);
        break;
        case "5 minutes":
            durationInSeconds = (5 * 60);
        break;
        case "15 minutes":
            durationInSeconds = (30 * 60)/2;
        break;
        case "30 minutes":
            durationInSeconds = 30 * 60;
            break;
        case "1 heure":
            durationInSeconds = 1 * 60 * 60;
            break;
        case "2 heures":
            durationInSeconds = 2 * 60 * 60;
            break;
        case "6 heures":
            durationInSeconds = 6 * 60 * 60;
            break;
        case "1 jour":
            durationInSeconds = 24 * 60 * 60;
            break;
        default:
            durationInSeconds = 0; // Si aucune option n'est sélectionnée ou pour une entrée non valide
            break;
    }
    return durationInSeconds;
  }
  

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

            let NFTContract = new ethers.Contract(Contracts.NFTMarket.address, Contracts.NFTMarket.abi, provider);
            let myNftMarket = new ethers.Contract(Contracts.MyNFT.address, Contracts.MyNFT.abi, provider);

           // Get adress of user

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // GetAllMyNfts with the user adress in parameter

            let transaction = await NFTContract.getMyNFTs(account);

            // let nftData = await myNftMarket.getTokenData(0);

            //  console.log(nftData)

            const items = await Promise.all(transaction.map(async(tokenId : BigNumber) => {
                console.log(tokenId.toNumber())
                const data = await myNftMarket.getTokenData(tokenId.toNumber());
                const price = ethers.utils.formatEther(data[3]);

                const isOnSale = await NFTContract.isTokenOnSale(tokenId);
                const isOnAuction = await NFTContract.isTokenOnAuction(tokenId);

                let type = "none";
                
                if(isOnSale) {
                    type = "sale";
                } else if(isOnAuction) {
                    type = "auction";
                }

                console.log("Type : " + type)

                const item = {
                    tokenId: tokenId.toNumber(),
                    name: data[0],
                    description: data[1],
                    image: data[2],
                    price: price,
                    type: type 
                }

                console.dir(item)
                return item;
            }));

            updateData(items);

                    
        }catch(error : any){
            console.log(error);
        }

    }

    const ListOnMarketPlace = async (tokenId : any, method: any, price: string, time: any) => {
        
        try {

            console.log(time)

            const durationInSeconds = convertDurationToSeconds(time);

            console.log(convertDurationToSeconds(time) + " seconds")
    
            setLoading(prev => ({ ...prev, [tokenId]: true }));
            console.log("List")
            localStorage.setItem(`loading-${tokenId}`, 'true'); // save loading state to local storage
    
            console.log("TokenId :" + tokenId)
            console.log("Method :" + method)
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let NFTContract = new ethers.Contract(Contracts.MyNFT.address, Contracts.MyNFT.abi, signer);
            let nftMarketContract = new ethers.Contract(Contracts.NFTMarket.address, Contracts.NFTMarket.abi, signer);
            
            const priceInWei = ethers.utils.parseEther(price);
            
            const methodNumber = method === "Fixed price" ? 1 : method === "Timed auction" ? 2 : 0;

            const approveTx = await NFTContract.approve(Contracts.NFTMarket.address, tokenId);
            await approveTx.wait();
        
            await nftMarketContract.setSale(tokenId, methodNumber, priceInWei, durationInSeconds );
    
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
        
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // setAdress(accounts[0])

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
                                price={value.price}
                                image={value.image}
                                type={value.type}
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