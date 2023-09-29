import jwt from 'jsonwebtoken';

function authorizeToken(req:any, res:any, next:any) {
    const token = req.headers.authorization;
  
    try {
      if (!token) {
        return res.status(401).json({ error: "Token not provided" });
      }
  
      const verify = jwt.verify(token, "#MMM@vvvv@AAA@AAA#");
      req.user = verify;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  export default authorizeToken