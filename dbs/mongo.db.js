const mongoose = require("mongoose")
const { Product } = require("../src/models")
const connectString = `mongodb://localhost:27117/ecommerce_demo?directConnection=true`

class Database {
    constructor() {
        this.connect()
    }
    //connect
    connect() {
        // mongoose.set("debug", true)
        mongoose
            .connect(connectString, {
                maxPoolSize: 500,
            })
            .then((_) => {
                console.log(
                    "MongoDB - Connect database successfully at port 27017"
                )
                // dumpDatabase()
            })
            .catch((err) => console.log("Error Connect MongoDB!! ::", err))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const dumpDatabase = async () => {
    await Product.create({
        p_name: "This is a product",
        p_stock: 10,
    })
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb
