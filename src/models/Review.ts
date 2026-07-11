import mongoose, { Document, Schema } from 'mongoose';
import './User.js';
import './Item.js';

export interface IReview extends Document {
  item: string;
  user: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    item: {
      type: String,
      ref: 'Item',
      required: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Prevent a user from submitting more than one review per item (optional, but good practice)
reviewSchema.index({ item: 1, user: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
