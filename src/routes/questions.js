const express = require("express");
const router = express.Router()
const {stablishConnection,mongoClient,getQuestions}= require("../middlewares/getQuestions")
router.get("/", async (req, res) => {
  stablishConnection(mongoClient).then(async () =>
    res.send(await getQuestions())
  );
});

module.exports = router;
