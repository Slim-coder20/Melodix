import mongoose from "mongoose"; 

const favorisSchema = new mongoose.Schema({
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
}, { timestamps: true });

// Index composite pour éviter les doublons (un utilisateur ne peut pas ajouter le même produit deux fois)
favorisSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favoris = mongoose.model("Favoris", favorisSchema);

export default Favoris;