const mongoose = require("mongoose");

const db = async () => {
  try {
    //connect mongo
    mongoose.set("strictQuery", false);
    await mongoose
      .connect("mongodb://localhost:27017/Doc", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4,
      })
      .then(() => {
        console.log("Db connected");
      })
      .catch((error) => {
        console.error("Failed to connect db" + error);
      });
  } catch (error) {
    console.log("DB Connection failed" + error);
  }
};

const DocSchema = new mongoose.Schema({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  content: { type: String, default: "" },
  accessControl: [
    {
      userEmail: { type: String, required: true },
      accessLevel: {
        type: String,
        enum: ["read-only", "write-only"],
        default: "read-only",
      },
    },
  ],
});
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bio: { type: String },
});

const DocAccessSchema = new mongoose.Schema({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  accessControl: [
    {
      userEmail: { type: String, required: true },
      accessLevel: {
        type: String,
        enum: ["read", "Edit"],
        default: "read",
      },
    },
  ],
});

const AccessRequest = new mongoose.Schema({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  accessControl: [
    {
      userEmail: { type: String, required: true },
      accessLevel: {
        type: String,
        enum: ["read", "Edit"],
        default: "read",
      },
    },
  ],
});

const DocNameSchema = new mongoose.Schema({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  docName: {
    type: String,
    default: "",
  },
});

const DocNameModel = mongoose.model("DocName", DocNameSchema);

const UserProfile = mongoose.model("UserProfile", userSchema);
const Document = mongoose.model("Document", DocSchema);
const Users = mongoose.model("User", UserSchema);
const DocAccess = mongoose.model("Access", DocAccessSchema);
const AccessReq = mongoose.model("Access-Request", AccessRequest);

module.exports = {
  db,
  Document,
  Users,
  UserProfile,
  DocAccess,
  AccessReq,
  DocNameModel,
};
