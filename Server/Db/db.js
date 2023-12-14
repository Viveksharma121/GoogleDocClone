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
});

const Document = mongoose.model("Document", DocSchema);

module.exports = { db, Document };
