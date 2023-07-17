export interface Bid {
    bidder: string;
    amount: any;
    time: Date;
}

export interface NFT {
    tokenId: number;
    name?: string;
    owner: string;
    seller?: string;
    uri?: any;
    image: string;
    price?: any;
    highestBid?: any;
    method?: string;
    type: string;
    listEndTime?: any;
    auctionEndTime?: any;
    currentlyListed?: boolean;
}
