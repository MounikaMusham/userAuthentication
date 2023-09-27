import bcrypt from 'bcryptjs';
import authModel from '../models/authModel';
import nodemailer from 'nodemailer';

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

export default {userSignup,verifyEmail}
