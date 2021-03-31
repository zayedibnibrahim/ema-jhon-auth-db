const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const port = 5000

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6gnbd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const productCollection = client.db("ema-john-store").collection("products");
    const ordersCollection = client.db("ema-john-store").collection("orders");

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertMany(product)
            .then(result => {
                res.send(result.insertedCount)
                console.log(result.insertedCount)
            })
    })
    app.get('/allProduct', (req, res) => {
        productCollection.find({}).limit(20)
            .toArray((err, document) => {
                res.send(document)
            })
    })
    app.get('/product/:key', (req, res) => {
        productCollection.find({ key: req.params.key })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })
    app.post('/productsByKeys', (req, res) => {
        const productsKeys = req.body;
        productCollection.find({ key: { $in: productsKeys } })
            .toArray((err, document) => {
                res.send(document)

            })
    })

    //orders
    app.post('/addOrders', (req, res) => {
        const orders = req.body;
        ordersCollection.insertOne(orders)
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result.insertedCount > 0)
            })
    })
    app.get('/', (req, res) => {
        res.send("Hi this is the server of ema john")
    })
});


app.listen(process.env.PORT || port)