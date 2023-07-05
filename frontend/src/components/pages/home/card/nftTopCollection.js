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
    {
        id: 2,
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
    {
        id: 3,
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
    {
        id: 4,
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
    {
        id: 5,
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
    {
        id: 6,
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
    {
        id: 7,
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
    {
        id: 8,
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
    <div className="flex justify-between">
        <div className='flex'>
            <img src={collection.collectionImage} alt="collection" className="w-16 h-16 rounded" />
            <div className="mx-4 py-2">
                <h3 className="text-white font-semibold text-lg">{collection.collectionName}</h3>
                <p className="text-white text-sm">{collection.collectionValue} {collection.collectionChain}</p>
            </div>
        </div>
        <div className='flex items-center mr-2'>
            <div className='bg-black bg-opacity-10 rounded-full py-1 px-2'>
                <p className="text-white text-xs">+1234</p>
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
                <button className="bg-secondary font-semibold text-black py-1 px-3 border border-secondary rounded-full">View all</button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
            {collections.slice(0, 8).map((collection) => (
                <NftTopCollection key={collection.id} collection={collection} />
            ))}
        </div>
    </div>
);



export default NftTopCollectionGrid;