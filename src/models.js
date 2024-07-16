"use strict"
const mongoose = require("mongoose")
const { Schema, model } = mongoose

const productSchema = new Schema(
    {
        p_name: { type: String, required: true },
        p_stock: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        collection: "Products",
        timestamps: true,
    }
)

const Product = model("Product", productSchema)

module.exports = { Product }
