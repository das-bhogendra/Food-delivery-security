import mongoose, { Document, Schema } from "mongoose";
import { User } from "../types/user.type";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

   lockUntil: {
     type: Date,
     default: null,
    },

   lastLogin: {
    type: Date,
    default: null,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    profilePicture: {
      type: String, // URL or path
      default: null,
    },
    imageUrl:{type: String, required:false},
  },
  {
    timestamps: true,
  }
);

// IUser = Mongoose Document + Zod-inferred User
export interface IUser extends User, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);
