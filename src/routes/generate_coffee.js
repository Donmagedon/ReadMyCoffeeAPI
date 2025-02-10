const express = require("express")
const router = express.Router()


const GENERATE_COFFE = function(){
    
}
router.get("/",(req,res)=>{
    res.send("Hi this is your data!")
})

module.exports = router