import joi from 'joi';

export function signUpValidation(body: any) {
    const schema = joi.object({
      firstName: joi.string().min(3).max(15).required(),
      lastName: joi.string().min(3).max(15).required(),
      gender: joi.string().required(),
      DOB: joi.date().required(),
      email: joi.string().email().required(),
      mobileNumber: joi.number().required(),
      password: joi
        .string()
        .min(8)
        .max(15)
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
        )
        .required()
    });
    return schema.validate(body);
  }
  
  export function signInValidation(body:any){
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi
        .string()
        .min(8)
        .max(15)
        .pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
        )
        .required(),
    })
    return schema.validate(body);
  }
  
