const router = require("express").Router();
const mongoose = require("mongoose");
const { AccessReq } = require("../Db/db");

router.get("/", async (req, res) => {
  res.json({ message: "close it" });
});

router.get("/get-access-request", async (req, res) => {
  const { docId } = req.query;
  try {
    const response = await AccessReq.findOne({ docId: docId });
    res.json({ message: response });
  } catch (error) {
    res.json({ message: error });
  }
});
router.post("/access-request", async (req, res) => {
  const { docId, accessLevels } = req.body;
  console.log(docId);
  console.log(accessLevels);
  try {
    let access = await AccessReq.findOne({ docId: docId });
    if (!access) {
      console.log("hey ");
      access = await AccessReq.create({
        docId: docId,
        accessControl: accessLevels,
      });
    } else {
      access = await AccessReq.findOneAndUpdate(
        { docId: docId },
        {
          $addToSet: { accessControl: { $each: accessLevels } },
        },
        { new: true }
      );
    }
    res.json({ access });
  } catch (error) {
    console.error("Error:", error);
    res.json({ message: error });
  }
});

router.delete("/delete-access/:docId", async (req, res) => {
  try {
    const { docId } = req.params;
    await AccessReq.deleteMany({ docId });
    res.json({ message: "Access requests deleted successfully" });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
