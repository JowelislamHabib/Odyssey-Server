require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const db = client.db("Odessy");
    const destinationCollection = db.collection("destinations");
    const bookingCollection = db.collection("bookings");

    app.get("/destination", async (req, res) => {
      const result = await destinationCollection.find().toArray();
      res.json(result);
    });

    app.post("/destination", async (req, res) => {
      const destinationData = req.body;
      console.log(destinationData);
      const result = await destinationCollection.insertOne(destinationData);

      res.json(result);
    });

    app.get(`/destination/:id`, async (req, res) => {
      const { id } = req.params;

      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    app.patch("/destination/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      // console.log(updateData);

      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });

    app.delete("/destination/:id", async (req, res) => {
      const { id } = req.params;

      const result = await destinationCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    app.post("/bookings", async (req, res) => {
      const bookingData = req.body;
      console.log(bookingData);
      const result = await bookingCollection.insertOne(bookingData);
      res.json(result);
    });

    app.get("/bookings", async (req, res) => {
      const result = await bookingCollection.find().toArray();
      res.json(result);
    });

    app.get("/bookings/:userId", async (req, res) => {
      const { userId } = req.params;

      const result = await bookingCollection.find({ userId: userId }).toArray();

      res.json(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
