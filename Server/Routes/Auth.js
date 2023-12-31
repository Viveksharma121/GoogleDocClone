const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users, UserProfile } = require("../Db/db");
const saltRound = 10;
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = Users({
      username: username,
      email: email,
      password: hashedPass,
    });
    const userProfile = UserProfile({
      username: username,
    });
    const savedProfile = await userProfile.save();
    const savedUser = await user.save();

    console.log("Saved user:", savedProfile);
    res.status(201).json({ message: "user saved " });
  } catch (error) {
    console.error("Registration failed:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      res.status(501).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = await jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      "secret123"
    );
    res.status(200).json({ message: "User logged in ", user: token });
  } catch (error) {
    res.status(500).json({ message: "some error occured" + error });
  }
});

router.get("/bio", async (req, res) => {
  try {
    const username = req.query.username;
    const bio = await UserProfile.findOne({ username: username });
    console.log(username);
    res.json({ bio });
  } catch (error) {
    res.status(501).json({ message: "no user" });
  }
});

router.put("/savebio", async (req, res) => {
  try {
    const { username, bio } = req.body;
    const updatedbio = await UserProfile.findOneAndUpdate(
      { username: username },
      { $set: { bio: bio } },
      { new: true }
    );
    // await updatedbio.save();
    if (!updatedbio) {
      // Handle case where no user is found with the given username
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedbio);
  } catch (error) {
    res.status(501).json({ message: "no user" });
  }
});

module.exports = router;
