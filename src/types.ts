import { Types } from "mongoose";

export type tokenType = {
  id: string;
  username: string;
  email: string;
};

export type TransactionType = {
  _id: string;
  amount: number; // Amount of the transaction
  date: Date; // Date of the transaction
  description: string; // Description of the transaction
  category: string; // Category (Food, Entertainment, etc.)
  user: Types.ObjectId; // Reference to User document
  createdAt: Date; // Transaction creation date
  updatedAt: Date; // Transaction last update date
};


export type logoutResponse = {
  success:boolean,
  message:string
}
