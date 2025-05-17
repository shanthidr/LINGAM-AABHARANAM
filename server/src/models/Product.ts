import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: 'jewelry' | 'idol';
  subcategory: string;
  price: number;
  salePrice?: number;
  description: string;
  details: string;
  images: string[];
  weight: string;
  material: string;
  dimensions?: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['jewelry', 'idol'] },
  subcategory: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  description: { type: String, required: true },
  details: { type: String, required: true },
  images: [{ type: String, required: true }],
  weight: { type: String, required: true },
  material: { type: String, required: true },
  dimensions: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema); 