import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// Routes
app.get("/", (req, res) => {
  if (req.session.user) {
    res.sendFile("dashboard.html", { root: "public" });
  } else {
    res.sendFile("index.html", { root: "public" });
  }
});

// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.send("✅ Registered successfully. <a href='/'>Login</a>");
  } catch (err) {
    res.status(400).send("❌ Error: " + err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send("❌ Invalid credentials");
  }
  req.session.user = user;
  res.redirect("/");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Deposit
app.post("/deposit", async (req, res) => {
  if (!req.session.user) return res.status(401).send("Login required");
  const amount = parseFloat(req.body.amount);
  const user = await User.findById(req.session.user._id);
  user.balance += amount;
  await user.save();
  res.send(`✅ Deposited ₹${amount}. Current balance: ₹${user.balance}`);
});

// Withdraw
app.post("/withdraw", async (req, res) => {
  if (!req.session.user) return res.status(401).send("Login required");
  const amount = parseFloat(req.body.amount);
  const user = await User.findById(req.session.user._id);
  if (amount > user.balance) return res.send("❌ Insufficient balance");
  user.balance -= amount;
  await user.save();
  res.send(`✅ Withdrawn ₹${amount}. Remaining balance: ₹${user.balance}`);
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Bank App running on port ${process.env.PORT}`)
);
