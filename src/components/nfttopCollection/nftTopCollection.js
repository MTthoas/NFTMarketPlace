import React from 'react';

const collections = [
    {
        id: 1,
        collectionName: 'Monkey',
        collectionImage: 'https://via.placeholder.com/150',
        collectionTag: '#001',
        collectionValue: '25.456',
        collectionChain: 'ETH',
        collectionTotalNft: '10',
        collectionTotalOwner: '10',
        collectionTotalSale: '10',
        collectionTotalBid: '10',
        collectionTotalView: '10',
    },
];

const NftTopCollection = ({ collection }) => (
    <div className="bg-secondary rounded-lg p-4">
        <div className="flex justify-between">
            <div className="flex">
                <img src={collection.collectionImage} alt="collection" className="w-12 h-12 rounded-full" />
                <div className="ml-4">
                    <h3 className="text-white font-semibold text-lg">{collection.collectionName}</h3>
                    <p className="text-white font-semibold text-sm">{collection.collectionTag}</p>
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-white font-semibold text-sm">Total Value</p>
                <p className="text-white font-semibold text-lg">{collection.collectionValue}</p>
                <p className="text-white font-semibold text-sm">{collection.collectionChain}</p>
            </div>
        </div>
        <div className="flex justify-between mt-4">
            <div className="flex flex-col justify-center">
                <p className="text-white font-semibold text-sm">Total NFT</p>
                <p className="text-white font-semibold text-lg">{collection.collectionTotalNft}</p>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-white font-semibold text-sm">Total Owner</p>
                <p className="text-white font-semibold text-lg">{collection.collectionTotalOwner}</p>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-white font-semibold text-sm">Total Sale</p>
                <p className="text-white font-semibold text-lg">{collection.collectionTotalSale}</p>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-white font-semibold text-sm">Total Bid</p>
                <p className="text-white font-semibold text-lg">{collection.collectionTotalBid}</p>
            </div>
            <div className="flex flex-col justify-center">
                <p className="text-white font-semibold text-sm">Total View</p>
                <p className="text-white font-semibold text-lg">{collection.collectionTotalView}</p>
            </div>
        </div>
    </div>
);


const NftTopCollectionGrid = () => (
    <div className="container mx-auto">
        <div className="flex mb-6">
            <span className="orange-bar rounded mr-2 mt-1"></span>
            <div className='flex justify-between w-full'>
                <h2 className="text-2xl font-bold text-white">Top Collections</h2>
                <button class="bg-secondary font-semibold text-black py-1 px-3 border border-secondary rounded-full">View all</button>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {collections.slice(0, 8).map((collection) => (
                <NftTopCollection key={collection.id} collection={collection} />
            ))}
        </div>
    </div>
);



export default NftTopCollectionGrid;