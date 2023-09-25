import express, { Router } from "express";
import {signUpValidation} from '../authentication/authValidations'
import authModel from '../models/authModel';
const router: Router = express.Router();

//API for Sign up process

router.post('/userSignUp', async (req,res)=>{
    try {
          //checking validation whether required fields are coming in the body  
       const {error} = signUpValidation(req.body) 
        // if Validation fails throwing error
       if (error) {
        return res.status(400).json({
          status: 400,
          message: error.details[0].message,
          data: {},
          response: "false",
        });
      }
      
    } catch (error) {
            //sending error based on the type of error message
    res.status(500).json({
        status: 500,
      //  message: responseMessages.someThingWrong,
        data: {},
        response: "failed",
      });
    }
})

export default router;