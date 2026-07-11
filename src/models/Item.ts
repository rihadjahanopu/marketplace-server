import mongoose, { Document, Schema } from 'mongoose';
import './User.js';

export interface IItem extends Document {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  location: string;
  rating: number;
  reviewCount: number;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'sold' | 'draft';
  date: Date;
  specifications: { key: string; value: string }[];
  createdBy: string;
  createdAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Vehicles', 'Real Estate', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Services', 'Other'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'draft'],
      default: 'active',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    specifications: {
      type: [{ key: String, value: String }],
      default: [],
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', shortDescription: 'text', description: 'text' });
itemSchema.index({ category: 1, price: 1 });
itemSchema.index({ createdBy: 1 });

export const Item = mongoose.model<IItem>('Item', itemSchema);
