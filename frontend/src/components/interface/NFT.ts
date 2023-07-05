export interface Bid {
    bidder: string;
    amount: any;
    time: Date;
}

export interface NFT {
    tokenId: number;
    name?: string;
    owner: string;
    seller: string;
    uri?: any;
    image: string;
    price?: any;
    method?: string;
    currentlyListed?: boolean;
    auctionStartTime?: Date;
    auctionEndTime?: Date;
    highestBid?: any;
    highestBidder?: string;
    bids?: Bid[]; // Un tableau de bids
}
