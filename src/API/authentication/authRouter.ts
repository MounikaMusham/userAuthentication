import express, { Router } from "express";
import {signUpValidation} from '../authentication/authValidations'
import authModel from '../models/authModel';
import authService from '../authentication/authService';
import responseMessages from './../../responseMessages';
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
      try {
        const userDetails = await authService.userSignup(req.body)
        const savedUser = userDetails.save(); 
              //sending success message
      res.status(200).json({
        status: 200,
        message: responseMessages.signUpSuccess,
        data: userDetails,
        response: "success",
      });       
      } catch (error) {
        
      }
      
    } catch (error) {
            //sending error based on the type of error message
    res.status(500).json({
        status: 500,
        message: responseMessages.someThingWrong,
        data: {},
        response: "failed",
      });
    }
})

router.get('/verifyEmail/:token',async (req,res)=>{
   try {
    const emailVerification = await authService.verifyEmail(req.params.token);
    if(emailVerification){
      res.status(200).json({
        status: 200,
        response: "Email verified Successfully",
      }); 
    }
    
   } catch (error) {
    res.status(500).json({
      status: 500,
      message: responseMessages.someThingWrong,
      data: {},
      response: "failed",
    });
   }
})

export default router;