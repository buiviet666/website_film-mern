import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options";

export default mongoose.model(
    "Favorite",
    mongoose.Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        mediaType: {
            type: String,
            enum: ["TV", "Movie"],
            require: true
        },
        mediaId: {
            type: String,
            require: true
        },
        mediaTitle: {
            type: String,
            require: true
        },
        mediaPoster: {
            type: String,
            require: true
        },
        mediaRate: {
            type: Number,
            require: true
        }
    }, modelOptions)
)