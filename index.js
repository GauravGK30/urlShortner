const express = require('express');
const {connectToMongoDB} = require("./connect");
const urlRoute = require("./routes/url");
const URL = require('./models/url');
const app = express();
const PORT = 8001;


//middleware
app.use(express.json()); 

//connection
connectToMongoDB('mongodb://localhost:27017/short-url').then(()=>console.log("mongodb connected"));

app.use("/url",urlRoute);
app.get('/:shortID',async(req,res)=>{
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate({
        shortID
    },{$push:{
        visitHistory:{
            timestamp: Date.now(),
        },
    },
    },
    { new: true }
    );
    if (!entry) {
    return res.status(404).json({ error: 'Short URL not found' });
    }

    res.redirect(entry.redirectURL);
})

app.listen(PORT,()=>console.log(`Server started at ${PORT}`));