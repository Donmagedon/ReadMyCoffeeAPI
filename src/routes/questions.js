const express = require("express");
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
const DBURI = process.env.DB_URI;
const DB_CURRENT_COLLECTION = process.env.CURRENT_COLLECTION;
const DB_CURRENT_DATABASE = process.env.CURRENT_DATABASE;

const mongoClient = new MongoClient(DBURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function stablishConnection(client) {
  try {
    await client.connect().then(() => {
      console.log("Connected Successfully!");
    });
  } catch (err) {
    throw new Error("There is a problem with the database");
  }
}
async function getQuestions(client) {
  const database = mongoClient.db(DB_CURRENT_DATABASE);
  const collection = database.collection(DB_CURRENT_COLLECTION);
  const query = collection.find();
  let docs = [];
  for await (const doc of query) {
    docs.push(doc);
  }
  return docs;
}
router.get("/", async (req, res) => {
  stablishConnection(mongoClient).then(async () =>
    res.send(await getQuestions(mongoClient))
  );
});

module.exports = router;
