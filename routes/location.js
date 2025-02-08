
const express = require('express');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ServerApiVersion = mongodb.ServerApiVersion;

const router = express.Router();

const uri = 'mongodb+srv://sampleUser:kiengohceeK4Wa8@cluster0.a4l3b.mongodb.net/locations?retryWrites=true&w=majority&appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

const locationStorage = {
    locations: []
}

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("locations").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function addLocationToDB(location) {
    try {
        await client.connect();
        const db = client.db('locations');
        const result = await db.collection('user-locations').insertOne(location);
        console.log(
            `A document was inserted with the _id: ${result.insertedId}`,
        );
        return result.insertedId;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function getLocationFromDB(id) {
    try {
        await client.connect();
        const db = client.db('locations');

        let locationId = mongodb.ObjectId.createFromHexString(id);
        const result = await db.collection('user-locations').findOne({
            _id: locationId
        });
        console.log(
            `A document was retrieved by the _id: ${result._id} ${result}`,
        );
        return result;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// Adding a location to MongoDB
router.post('/add-location', async (req, res, next) => {
    const id = await addLocationToDB({
        address: req.body.address,
        coords: { lat: req.body.lat, lng: req.body.lng }
    });

    res.json({ message: 'Stored location!', locId: id });
});

// Retrieving a location from a MongoDB
router.get('/location/:lid', async (req, res, next) => {
    const locationId = req.params.lid;
    try {
        const location = await getLocationFromDB(locationId);
        if (!location) {
            return res.status(404).json({ message: 'Not found!' });
        }
        res.json({ address: location.address, coordinates: location.coords });
    } catch (error) {
        // return to make sure the other code does not execute
        return res.status(500).json({ message: 'Invalid id!' });
    }
});

// Adding a location to in-memory storage
router.post('/add-location-local', (req, res, next) => {
    const id = crypto.randomUUID();
    locationStorage.locations.push({
        id: id,
        address: req.body.address,
        coords: { lat: req.body.lat, lng: req.body.lng }
    });
    res.json({ message: 'Stored location!', locId: id });
});

// Retrieving a location from a in-memory storage
router.get('/location-local/:lid', (req, res, next) => {
    const locationId = req.params.lid;
    const location = locationStorage.locations.find(loc => {
        return loc.id === locationId;
    });
    if (!location) {
        return res.status(404).json({ message: 'Not found!' });
    }
    res.json({ address: location.address, coordinates: location.coords });
});

module.exports = router;