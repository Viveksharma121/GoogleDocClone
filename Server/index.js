const { Server } = require("socket.io");
const { db, Document, UserProfile, DocNameModel } = require("./Db/db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 5000;
const PORT1 = 9000;
db()
  .then(() => {
    app.listen(PORT1, () => {
      console.log(`Server is running on port ${PORT1}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect" + error);
  });
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const user_route = require("./Routes/Auth");
const share_route = require("./Routes/Share");
const access_route = require("./Routes/DocAccess");
// const summary_route = require("./Routes/Summariser");
app.use("/api/access", access_route);
app.use("/api/user", user_route);
app.use("/api/share", share_route);
// app.use("/api/sum", summary_route);

//access perm
app.get("/", (req, res) => {
  res.json("Hello hi namaste");
});
//code to save to db
app.get("/get-doc-content/:docId", async (req, res) => {
  const { docId } = req.params;
  console.log(docId + "docId");
  try {
    const document = await Document.findOne({ docId: docId });
    if (document) {
      res.json({ content: document.content, images: document.images });
    } else {
      res.json({ content: "", images: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error while fetching" });
  }
});

let saveTimeouts = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-doc", (docId) => {
    socket.join(docId);
    console.log(`User ${socket.id} is connected to room ${docId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
  socket.on("doc-changes", (data) => {
    const { docId, content } = data;
    console.log("Received data from client:", content);

    const accessControl = [
      { userEmail: "viv@gmail.com", accessLevel: "read-write" },
      { userEmail: "lol@gmail.com", accessLevel: "read" },
      { userEmail: "xyz@gmail.com", accessLevel: "read-write" },
    ];

    console.log("Content to broadcast:", content);
    clearTimeout(saveTimeouts[docId]);

    saveTimeouts[docId] = setTimeout(() => {
      saveDocument(docId, content, accessControl);
    }, 1000);
    io.to(docId).emit("doc-changes", content);
  });
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

async function saveDocument(docId, content, accessControl) {
  try {
    await Document.findOneAndUpdate(
      { docId: docId },
      { content: content, accessControl: accessControl },
      { upsert: true }
    );

    console.log("saved doc");
  } catch (error) {
    console.log(error);
  }
}

app.delete("/del", async (req, res) => {
  try {
    const result = await UserProfile.deleteMany();
    res.json({ message: `Deleted ${result.deletedCount} documents` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("doc-name", async (req, res) => {
  const { docId, document_name } = req.body;
  try {
    const existingDoc = await DocNameModel.findOne({ docId });
    if (existingDoc) {
      await DocNameModel.updateOne(
        { docId },
        { $set: { docName: document_name } }
      );
    } else {
      await DocNameModel.create({ docId, docName: document_name });
    }
    res
      .status(200)
      .json({ success: true, message: "Document name saved successfully." });
  } catch (error) {
    console.error("Error saving document name:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.post("/doc-name", async (req, res) => {
  try {
    const { docId, docName } = req.body;
    const newDoc = new DocNameModel({
      docId: docId,
      docName: docName,
    });
    await newDoc.save();
    res.json({ message: newDoc });
  } catch (error) {
    res.json({ message: error });
  }
});

app.get("/doc-name", async (req, res) => {
  try {
    const docId = req.query.docId;
    console.log(req.query);
    console.log(docId);
    const response = await DocNameModel.findOne({ docId: docId });
    res.json(response);
  } catch (error) {
    res.json({ message: error });
  }
});
