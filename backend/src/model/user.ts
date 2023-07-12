import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  address: string;
  profilePicture: string;
  createdDate: Date;
}

export const userSchema = new Schema({
  address: String,
  profilePicture: String,
  createdDate: { type: Date, default: Date.now },
});

export default mongoose.model<User>("User", userSchema);
