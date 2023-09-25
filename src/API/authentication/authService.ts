import bcrypt from 'bcryptjs';
import authModel from '../models/authModel';

async function userSignup(body:any){
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
          });
          // returning user details to API response
          return userDetails;
  } catch (error) {
    
  }
    
}