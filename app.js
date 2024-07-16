// call databases
require("./dbs/mongo.db")
require("./dbs/redis.db")

const EcommerceController = require("./src/controller")
const express = require("express")
const app = express()

// middlewares

app.use(express.json())
app.get("/product/:productId", EcommerceController.getProduct)
app.post("/cart/:userId/add", EcommerceController.addToCart)

module.exports = app
