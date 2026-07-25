import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const normalizedRole = role === "instructor" ? "instructor" : "student";
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      res.status(409);
      throw new Error("An account with this email already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: normalizedRole
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: String(email || "").toLowerCase()
    }).select("+password");

    if (!user || !(await user.comparePassword(password || ""))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  res.json({ success: true, user: publicUser(req.user) });
}
