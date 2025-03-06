const express = require("express")
const router = express.Router();
const { MongoClient, ServerApiVersion } = require("mongodb");
const DBURI = process.env.DB_URI;
const DB_QUESTIONS_COLLECTION = process.env.QUESTIONS_COLLECTION;
const DB_COFFEES_COLLECTION = process.env.COFFEES_COLLECTION
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
async function getQuestions(userQuery, userCollection = "") {
  const database = mongoClient.db(DB_CURRENT_DATABASE);
  const questions_collection = database.collection(DB_QUESTIONS_COLLECTION);
  const coffee_collection = database.collection(DB_COFFEES_COLLECTION);
  const collection = userCollection === "coffees" ? coffee_collection : questions_collection
  const query = collection.find(userQuery);
  let docs = [];
  for await (const doc of query) {
    docs.push(doc);
  }
  return docs;
}


module.exports = {mongoClient,getQuestions,stablishConnection}
