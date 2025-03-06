const express = require("express");
const router = express.Router();

// 1.make the query with the initial user parameters
// 2.if there are less than 3 coffees as the initial result adjust the query and decrease the personality attribute by 1 and query again
// 3.If multiple results are given then give one random coffee.
const {
  stablishConnection,
  mongoClient,
  getQuestions,
} = require("../middlewares/getQuestions");
const GENERATE_COFFE = async function (body) {
  const allQuestions = async function () {
    try {
      await stablishConnection(mongoClient);
      const data = await getQuestions();
      let results;
      let foundQuestions = [];
      let query = {};
      let initialDetermination;
      let finalDetermination;
      let findExactOrClosest;
      const ATTRIBUTES_CAP = 3;

      const userInput = body;
      function findQuestions(askedQuestion) {
        const firstLevel = data.flatMap((item) => item.questions);
        const secondLevel = firstLevel.find(
          (item) => item.question === askedQuestion
        );
        console.log(`this are the questions found: ${secondLevel}`)
        return secondLevel;
      }
      if(!userInput || Array.isArray(userInput) === false){
        throw new Error("User request is invalid")
      }
      userInput.forEach((question) => {
        foundQuestions.push(findQuestions(question.question));
      });

      results = foundQuestions.reduce(
        (acc, curr) => {
          if (typeof curr.bitter === "number") {
            let bitterResult = (acc.bitter += curr.bitter);
            let sweetResult = (acc.sweet += curr.sweet);

            acc = { bitter: bitterResult, sweet: sweetResult };
          }
          if (curr.type === "creaminess") {
            acc = { ...acc, creaminess: curr.question };
          }
          if (curr.type === "mood") {
            acc = { ...acc, mood: curr.question.toLowerCase() };
          }

          return acc;
        },
        { bitter: 0, sweet: 0, creaminess: "", mood: "" }
      );
      console.log(`this is what is used to build query determination: ${results}`)
      ///Because the client can overflow the value of bitter
      if (results.bitter > ATTRIBUTES_CAP) {
        let modifiedResults = { ...results };
        modifiedResults.bitter = ATTRIBUTES_CAP;
        results = modifiedResults;
      }

      query = {
        $and: [
          { creamie: results.creaminess === "Cream" ? true : false },
          { emotion: { $in: [results.mood] } },
        ],
      };
      initialDetermination = await getQuestions(query, "coffees");

      findExactOrClosest =
        initialDetermination.find((item) => {
          let prevalentFlavor =
            results.bitter >= results.sweet ? "bitter" : "sweet";
          return item[prevalentFlavor] === results[prevalentFlavor];
        }) ||
        initialDetermination.reduce((acc, curr) => {
          let prevalentFlavor =
            results.bitter >= results.sweet ? "bitter" : "sweet";
          let currDiff = Math.abs(
            curr[prevalentFlavor] - results[prevalentFlavor]
          );
          if (acc.length === 0) return [curr];
          let accDiff = Math.abs(
            acc[0][prevalentFlavor] - results[prevalentFlavor]
          );
          if (currDiff < accDiff) {
            return [curr];
          } else if (currDiff === accDiff) {
            return [...acc, curr];
          }
          return acc;
        }, []);
        console.log(`the last stage before schuffle: ${findExactOrClosest}`)

      finalDetermination = function () {
        let arry = findExactOrClosest;
        let startofArry = 0
        let lastOfArry = arry.length

        if (arry.length > 1) {
          let random =  Math.floor(Math.random() * (lastOfArry - startofArry) + startofArry)
          return arry[random]
        }else{
          return arry
        }

      };
      return finalDetermination();
    } catch (err) {
      console.error( new Error(err));
    }
  };
  return await allQuestions();
};
router.post("/", async (req, res) => {
  GENERATE_COFFE(req.body).then((data) => res.send(data));
});

module.exports = router;
