import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import mongoose from "mongoose";
import db from './config';
import routerFile from './router';
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(db.db_url);
mongoose.connection.on("connected",()=>{
    console.log('connected to database')
})

//Handling CORS error
const corsOptions = {
    methods:'GET,PUT,POST,DELETE',
    origin:'*'
}

app.use(cors(corsOptions));

// routing to router file

app.use('/',routerFile);

// Handling when wrong url/path entered
app.get('*',(req,res)=>{
    res.send({
        status:'404',
        message:'Url Not Found'
    })
})

export default app