import React from 'react';

/* 
* Explore New NFTs must contain
* 0. id of NFT
* 1. Image of person who sells the NFT
* 2. Name of person who sells the NFT
* 3. Image of NFT
* 4. Time before auction ends
* 5. Name of NFT
* 6. Tag of NFT
* 7. Highest bid
* 7.1. Text on top of highest bid (highest bid)
* 8. Button to bid

*/


const nfts = [
  {
    id: 1,
    sellerName: 'John Doe',
    sellerImage: 'https://via.placeholder.com/150',
    nftImage: 'https://via.placeholder.com/150',
    nftTimeLeft: '1D.2H.34Min',
    nftName: 'Monkey',
    nftTag: '#001',
    nftHighestBid: '2.079',
    nftCoin: 'ETH',
  },
  {
    id: 2,
    sellerName: 'John Doe',
    sellerImage: 'https://via.placeholder.com/150',
    nftImage: 'https://via.placeholder.com/150',
    nftTimeLeft: '1D.2H.34Min',
    nftName: 'NFT Name', 
    nftTag: 'NFT Tag',
    nftHighestBid: '1000',
  },
  {
    id: 3,
    sellerName: 'John Doe',
    sellerImage: 'https://via.placeholder.com/150',
    nftImage: 'https://via.placeholder.com/150',
    nftTimeLeft: '1D.2H.34Min',
    nftName: 'NFT Name', 
    nftTag: 'NFT Tag',
    nftHighestBid: '1000',
  },
  {
    id: 4,
    sellerName: 'John Doe',
    sellerImage: 'https://via.placeholder.com/150',
    nftImage: 'https://via.placeholder.com/150',
    nftTimeLeft: '1D.2H.34Min',
    nftName: 'NFT Name', 
    nftTag: 'NFT Tag',
    nftHighestBid: '1000',
  },
  {
    id: 5,
    sellerName: 'John Doe',
    sellerImage: 'https://via.placeholder.com/150',
    nftImage: 'https://via.placeholder.com/150',
    nftTimeLeft: '1D.2H.34Min',
    nftName: 'NFT Name', 
    nftTag: 'NFT Tag',
    nftHighestBid: '1000',
  },
];

const NftCard = ({ nft }) => (
  <div className="bg-white shadow-md rounded-md p-4">
    <div className="flex justify-start mb-4">
      <img className="h-8 w-8 rounded-full object-cover mr-2" src={nft.sellerImage} alt={nft.sellerName} />
      <h2 className="text-center my-auto font-semibold text-black">{nft.sellerName}</h2>
    </div>
    <img className="w-full rounded object-cover mr-2" src={nft.nftImage} alt={nft.nftName} />
    <div className='flex my-2'>
      <p className="py-1 px-3 bg-black bg-opacity-5 text-black text-sm font-medium rounded-full">{nft.nftTimeLeft}</p>
    </div>
    <p className="mb-3 text-black font-bold text-xl">{nft.nftName} {nft.nftTag}</p>
    <p className="text-black text-sm text-black font-medium">Highest bid</p>
    <div className="flex">
      <p className="text-black my-auto text-xl font-bold">{nft.nftHighestBid} {nft.nftCoin}</p>
      <button className="bg-black text-white font-medium py-1 px-4 rounded-full ml-auto">Place a bid</button>
    </div>
  </div>
);

const NftCardGrid = () => (
  <div className="container-sm mx-auto px-4 py-8">
    <h1 className="text-2xl font-semibold mb-6">Explore New NFTs</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
      {nfts.map((nft) => (
        <NftCard key={nft.id} nft={nft} />
      ))}
    </div>
  </div>
);

export default NftCardGrid;