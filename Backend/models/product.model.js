import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: [String], default: [] },

    category: [
      { type: mongoose.Schema.ObjectId, ref: "category", required: true },
    ],
    subCategory: [
      { type: mongoose.Schema.ObjectId, ref: "subCategory", required: true },
    ],

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    description: { type: String, default: "" },
    more_details: { type: Object, default: {} },

    sizes: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    bases: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],

    type: {
      type: String,
      enum: ["Chay", "Mặn", "Nước", "Kem", "Bánh", "Combo", "Khác"],
      default: "",
    },

    publish: { type: Boolean, default: true },
  },
  { timestamps: true }
);


productSchema.index(
  {
    name: "text",
    description: "text",
  },
  {
    weights: {
      name: 10,
      description: 5,
    },
    default_language: "none", 
    name: "ProductTextIndex", 
  }
);

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;
