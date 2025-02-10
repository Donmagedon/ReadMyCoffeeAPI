require("dotenv")
.config({ path: "../.env" });
const express = require("express")
const app = express()
const generate_coffee = require("./routes/generate_coffee")
const questions = require("./routes/questions")


app.use("/api/generate_coffee",generate_coffee)
app.use("/api/questions",questions)
app.listen(3030,()=>{
    console.log("I'm alive!")
})

