const mongoose = require('mongoose')

const dbConnection = process.env.CONNECTION_STRING

mongoose.connect(dbConnection).then(res=>{
    console.log("Momgodb Atlas connected succesfully with tESTServer");
}).catch(err=>{
    console.log("Connection failed");
    console.log(err);
})