import bcrypt from 'bcryptjs';
import authModel from '../models/authModel';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'

var transport = nodemailer.createTransport({
  host:'smtp.titan.email',
  port:465,
  secure:true,
  auth:{
      user:'mounika.m@tynybay.io',
      pass:'Mouni@vinay9487'
  }
})
const emailVerificationTokens: { [key: string]: string } = {};
let invalidAttempts = 0;
 async function userSignup(body:any){
  const { firstName, lastName, gender, DOB, email, mobileNumber } = body;
  try {
     //checking whether the user already exists or nor before signUP with email
     const existingUser = await authModel.findOne({ email: body.email });
     if (existingUser) {
        // if user already exists throwing error
        return Promise.reject({
          statusCode: 400,
          status: false,
          data: {},
          message: "Email is already registered",
          error: "Bad Request",
        });
      }
      const token = Math.random().toString(36).substr(2);
      emailVerificationTokens[email] = token;
         //converting password to hashed password in order to avoid storing actual password in database
    const salt = await bcrypt.genSalt(10);
    const modifiedPassword = await bcrypt.hash(body.password, salt); 
        // creating user object with user details
        const userDetails = new authModel({
            firstName: body.firstName,
            lastName: body.lastName,
            gender: body.gender,
            DOB: body.DOB,
            mobileNumber: body.mobileNumber,
            email: body.email,
            password: modifiedPassword,
            isEmailVerified:false
          });
          const verificationLink = `http://localhost:8001/app/verifyEmail/${token}`;
          var mailOptions = {
            from:'mounika.m@tynybay.io',
            to:'mounika.musham11@gmail.com',
            subject:'user Sign up- Mounika Musham',
           html: `<p>click the below link to verify your email <a href='${verificationLink}'>verify</a></p>`
        }
        transport.sendMail(mailOptions,function(error,info){
          if(error){
              console.log('nodemailer error',error)
          }else{
              console.log('Email sent'+ info.response)
          }
      })
          // returning user details to API response
       return userDetails;
  } catch (error) {
    
  }
    
}

async function verifyEmail(requestedToken:any){
const token = requestedToken;
const email = Object.keys(emailVerificationTokens).find(
  (key) => emailVerificationTokens[key] === token
);
if(email){
  console.log('email',email)
  delete emailVerificationTokens[email];
  try {
    const user = await authModel.findOneAndUpdate({email},{isEmailVerified: true});
    console.log('user',user)
    if(!user){
      return Promise.reject({
        statusCode: 400,
        status: false,
        data: {},
        message: "user not found",
      });
    }
    return Promise.resolve({
      statusCode: 400,
      status: false,
      data: {},
      message: "email verified successfully",
    });
    
  } catch (error) {
    console.error(error)
    return Promise.reject({
      statusCode: 400,
      status: false,
      data: {},
      message:error,
    });
  }

}else{
  return Promise.reject({
    statusCode: 400,
    status: false,
    data: {},
    message:'Invalid or Token expired',
  });
}
}

async function userSignIn(body:any){
  try {
    const user = await authModel.findOne({ email:body.email});
    if (!user) {
      //if not found sending message as not registered
      return Promise.reject({
        statusCode: 401,
        status: false,
        data: {},
        msgs: "User not registered, please signup",
        err: "Bad Request",
      });
    }
    //if user exists checking the password match
    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if (!isPasswordValid) {
      //if password not matched sending message as invalid password
      invalidAttempts++
      console.log('invalidAttempts',invalidAttempts)
      if(invalidAttempts >=3){
        return Promise.reject({
          statusCode: 401,
          status: false,
          data: {},
          message: "Account blocked , Please rest the password and try login again",
          error: "Bad Request",
        });
      }
      return Promise.reject({
        statusCode: 401,
        status: false,
        data: {},
        message: "Invalid  password",
        error: "Bad Request",
      });
    }
    if(isPasswordValid && invalidAttempts < 3){
    //if password matches generating jwt token
    const token = jwt.sign(
      { userId: user._id, email: body.email },
      "#MMM@vvvv@AAA@AAA#",
      {
        expiresIn: "1d",
      }
    );
    invalidAttempts = 0;
    //sending token in response
    return token;
    }else{
      return Promise.reject({
        statusCode: 400,
        status: false,
        data: {},
        message: "Crossed invalid attempts limit",
      });
    }

  } catch (error) {
    return Promise.reject({
      statusCode: 500,
      status: false,
      data: {},
      message: "Bad Request",
      error: error,
    });
  }
}

async function forgotPassword(body:any){
  try {
    const {email} = body;
    const user = await authModel.findOne({email});
    if(!user){
      return Promise.reject({
        statusCode: 500,
        status: false,
        data: {},
        message: "User not found",
      });
    }
    const token = Math.random().toString(36).substr(2);
    emailVerificationTokens[email] = token;
    const verificationLink = `http://localhost:8001/app/verifyResetPassword/${token}`;
    var mailOptions = {
      from:'mounika.m@tynybay.io',
      to:'mounika.musham11@gmail.com',
      subject:'Reset password- Mounika Musham',
     html: `<p>click the below link to verify your email <a href='${verificationLink}'>verify</a></p>`
  }
  transport.sendMail(mailOptions,async function(error,info){
    if(error){
        console.log('nodemailer error',error)
    }else{
      const user = await authModel.updateOne({email},{$set:{isEmailVerifiedForForgotPassword: false}});
        console.log('Email sent'+ info.response);
    }
  })
  return true
  } catch (error) {
    return Promise.reject({
      statusCode: 500,
      status: false,
      data: {},
      message: "Bad Request",
      error: error,
    });
  }
}

async function verifyResetPassword(requestedToken:any){
  const token = requestedToken;
  const email = Object.keys(emailVerificationTokens).find(
    (key) => emailVerificationTokens[key] === token
  );
  if(email){
    delete emailVerificationTokens[email];
    try {
      const user = await authModel.findOneAndUpdate({email},{isEmailVerifiedForForgotPassword: true});
      if(!user){
        return Promise.reject({
          statusCode: 400,
          status: false,
          data: {},
          message: "user not found",
        });
      }
      return Promise.resolve({
        statusCode: 400,
        status: false,
        data: {},
        message: "email verified successfully",
      });
      
    } catch (error) {
      console.error(error)
      return Promise.reject({
        statusCode: 400,
        status: false,
        data: {},
        message:error,
      });
    }
  
  }else{
    return Promise.reject({
      statusCode: 400,
      status: false,
      data: {},
      message:'Invalid or Token expired',
    });
  }
  }

  async function createNewPassword(body:any){
    try {
        const { email, newPassword } = body;
        const salt = await bcrypt.genSalt(10);
        // Update the user's password in the database (you should hash newPassword before saving it)
        const hashedPassword = await bcrypt.hash(newPassword, salt);
    
        const user = await authModel.findOneAndUpdate({ email }, { password: hashedPassword });
    
        if (!user) {
          return Promise.reject({
            statusCode: 400,
            status: false,
            data: {},
            message:'user not found',
          });
        }
    
       return user
    } catch (error) {
      return Promise.reject({
        statusCode: 400,
        status: false,
        data: {},
        message:'Invalid or Token expired',
      });
    }
  }

export default {userSignup,verifyEmail,userSignIn,forgotPassword,verifyResetPassword,createNewPassword}
