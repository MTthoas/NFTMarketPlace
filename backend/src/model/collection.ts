import mongoose from 'mongoose';

export interface Collection {
    name: string,
    nfts: string[], // Array of NFT ids
}

const CollectionSchema = new mongoose.Schema<Collection>({
    name: { type: String, required: true },
    nfts: { type: [String], required: true },
});

export default mongoose.model<Collection>('Collection', CollectionSchema);
