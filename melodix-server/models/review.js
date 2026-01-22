import mongoose from "mongoose"; 

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: Number, 
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    min:1,
    max:5,
    required:true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;