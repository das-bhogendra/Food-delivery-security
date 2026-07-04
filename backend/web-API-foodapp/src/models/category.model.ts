import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  status?: string; // optional, e.g., "active" or "inactive"
  createdAt?: Date; // optional, added by timestamps
  updatedAt?: Date; // optional, added by timestamps
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, default: "active" }, // optional status field
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);

