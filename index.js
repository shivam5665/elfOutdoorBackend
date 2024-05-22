
const express = require('express');


const {connection} = require('./config/db');

const authRouter = require('./routes/authRouter');
const uploadRoute = require('./routes/uploadRouter');
require('dotenv').config()
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors())

app.use('/user/auth',authRouter)
app.use(express.urlencoded({ extended: true }));
app.use('/user',uploadRoute);


app.listen(process.env.PORT, async() => {
 try{
    await connection 
    console.log('Connected to db')
 }catch(e){
    console.log(e);
 }
 console.log(`Server listening at ${process.env.PORT}`);
});
