import express, { Router } from "express";
import {signUpValidation , signInValidation} from '../authentication/authValidations'
import authModel from '../models/authModel';
import authService from '../authentication/authService';
import responseMessages from './../../responseMessages';
import validateToken from './validateToken'
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

router.post('/userSignIn',async (req,res)=>{
  try {
       //checking validation whether required fields are coming in the body
       const { error } = signInValidation(req.body);
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
        const token = await authService.userSignIn(req.body);
        res.status(200).json({
          status: 200,
          message: responseMessages.signInSuccess,
          data: token,
          response: "success",
        });
        
       } catch (error:any) {
        //sending error occurred  based on the type of error message
        return res.status(401).json({
        status: 401,
        message: error.message,
        data: {},
        response: "false",
      });
       }
    
  } catch (error) {
        //sending error based on the type of error message
        console.log("error", error);
        res.status(500).json({
          status: 500,
          message: responseMessages.someThingWrong,
          data: {},
          response: "failed",
        });
  }
})

router.post('/forgot-password',async (req,res)=>{
  try {
    const forgotPasswordVerification = await authService.forgotPassword(req.body)
    if(forgotPasswordVerification){
      res.status(200).json({
        status: 200,
        response: "Verification link sent to your registered email, please verify the email",
      }); 
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      message: responseMessages.someThingWrong,
      data: {},
      response: "failed",
    });
  }
})
router.get('/verifyResetPassword/:token',async (req,res)=>{
  try {
   const emailVerification = await authService.verifyResetPassword(req.params.token);
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

router.post('/create-new-password', async(req,res)=>{
  try {
    const newPassword = await authService.createNewPassword(req.body)
    if(newPassword){
      res.status(200).json({
        status: 200,
        response: "Password changed successfully",
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

router.get('/get-logged-user-profile/:userId',validateToken,async (req,res)=>{
  try {
    const userId = req.params.userId;
    const user = await authModel.findById(userId);
    const userDetails = {
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      DOB: user.DOB,
      email: user.email,
      mobileNumber: user.mobileNumber,      
    }
    res.status(200).json({
      status: 200,
      data:userDetails,
      response: "user details fetched successfully",
    });

  } catch (error) {
    res.status(500).json({
      status: 500,
      message: responseMessages.someThingWrong,
      data: {},
      response: "failed",
    });
  }
})

router.post('/change-password/:userId',async(req,res)=>{
  try {
    const userId = req.params.userId;
    if(userId){
     const user = await authService.changePassword(userId,req.body);
     if(user){
       await user.save();
       res.status(200).json({
        status: 200,
        response: "Password changed successfully",
      }); 
     }
    }else{
      res.status(404).json({
        status: 404,
        response: "User not found",
      }); 
    }
  } catch (error) {
    
  }
})

export default router;