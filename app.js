require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const md5 = require("md5")

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"]}) // uses secret as an encryptor by using the mongoose-encryption as a plugin to the desired schema, and selecting only one field

const User = new mongoose.model("User", userSchema)

app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/login", (req,res)=>{
    res.render("login")
})

app.get("/register", (req,res)=>{
    res.render("register")
})
app.post("/register", (req,res)=>{
    const user = new User({
        email: req.body.username,
        password: md5(req.body.password)
    })
    user.save((err)=>{
        if(err){
            res.send(err)
        } else {
            res.render("secrets")
        }
    })
})

app.post("/login",(req,res)=>{
    const username = req.body.username
    const password = md5(req.body.password)

    User.findOne({ 
        email: username}, 
        (err, foundUser)=>{
            if (err) {
                console.log(err);
            } else{
                if (foundUser.password === password) {
                    res.render("secrets")
                }
            }
    })
})

app.listen(1337,()=>{
    console.log("Server started sucessfully on port 1337");
})