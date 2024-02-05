const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();
// router.get("");
router.get("/summary", (req, res) => {
  try {
    const { doc } = req.query;
    const MAX_SUMMARY_SIZE = 1000;

    const pythonProcess = spawn("python", ["sum.py", doc], {
      cwd: "C:/Users/Asus/Desktop/GoogleDocClone/Server/Routes",
    });

    let summary = "";

    pythonProcess.stdout.on("data", (data) => {
      console.log(`Python Output: ${data}`);
      summary += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);

      if (summary.length > MAX_SUMMARY_SIZE) {
        pythonProcess.kill();
      }
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process closed with code ${code}`);

      res.json({ summary });
    });
  } catch (error) {
    console.log(error);
    res.json({ error: "An error occurred during summarization" });
  }
});

module.exports = router;
