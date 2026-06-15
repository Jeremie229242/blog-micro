
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../utils/TryCatch.js";





export const loginUser = TryCatch(async (req, res) => {
    const { code } = req.body;
  
    if (!code) {
      res.status(400).json({
        message: "Authorization code is required",
      });
      return;
    }
  
    const googleRes = await oauth2client.getToken(code);
  
    oauth2client.setCredentials(googleRes.tokens);
  
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
  
    const { email, name, picture } = userRes.data;
  
    let user = await User.findOne({ email });
  
    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }
  
    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
      expiresIn: "5d",
    });
  
    res.status(200).json({
      message: "Login success",
      token,
      user,
    });
  });