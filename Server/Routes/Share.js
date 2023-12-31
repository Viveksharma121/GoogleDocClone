const router = require("express").Router();
const { DocAccess, Document } = require("../Db/db");
router.get("/", (req, res) => {
  res.json({ message: "hey" });
});
router.get("/getusers/:docId", async (req, res) => {
  const { docId } = req.params;
  try {
    const doc = await DocAccess.findOne({ docId });
    if (doc) {
      res.json({ accessControl: doc.accessControl });
    } else {
      res.json({ message: "lmao" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/user-docs/:userEmail", async (req, res) => {
  const { userEmail } = req.params;

  try {
    if (!userEmail) {
      return res.status(400).json({ error: "Invalid request payload" });
    }
    const trimmedEmail = userEmail.trim();
    const userDocs = await DocAccess.find({
      "accessControl.userEmail": trimmedEmail,
    });

    res.json({ userDocs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/access-levels/:docId", async (req, res) => {
  // console.log(req);
  const { docId } = req.params;
  const { accessLevels } = req.body;

  try {
    if (!docId || !accessLevels || !Array.isArray(accessLevels)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const updatedDoc = await DocAccess.findOneAndUpdate(
      { docId: docId },
      { $addToSet: { accessControl: { $each: accessLevels } } },
      { upsert: true, new: true } // The 'new' option returns the updated document
    );

    res.json({ message: "Access levels updated in the database", updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
