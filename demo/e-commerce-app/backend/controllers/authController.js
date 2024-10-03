import userModel from "../models/userModel.js";
import { generateToken, authenticateToken } from "../utils/tokenUtils.js";
import { encryptPassword, comparePassword } from "../utils/passwordManager.js";

// Register new user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hash = encryptPassword(password);
    const newUser = new userModel({
      name,
      email,
      password: hash
    });

    await newUser.save();

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      accessToken: generateToken(newUser._id),
    });

  } catch (err) {
    return res.status(500).json({ message: 'An error occurred while creating user', error: err });
  }
};


// login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return res.status(406).json({ message: 'User does not exist'});

    if (comparePassword(password, user.password)) {

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken: generateToken(user._id)
        })
    };

    return res.status(406).json({ message: "Wrong password"});
}