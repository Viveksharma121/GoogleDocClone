const { Server } = require("socket.io");
const { db, Document } = require("./Db/db");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();
app.use(cors());
const PORT = 5000;
const PORT1 = 9000;
const uploadPath = "Images";
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    console.log(file + " image filename");
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
app.use("/uploads", express.static(uploadPath));

//chatgpt code
// app.post("/update-doc/:docId", upload.single("Images"), async (req, res) => {
//   const docId = req.params.docId;
//   const { content } = req.body;
//   const imageUrl = req.file ? req.file.path : null;

//   try {
//     let document = await Document.findOne({ docId });

//     if (!document) {
//       document = new Document({ docId });
//     }

//     document.content = content;

//     if (imageUrl) {
//       document.images.push(imageUrl);
//     }

//     await document.save();
//     res.json({ message: "Update successful" });

//     // Broadcast changes to connected clients
//     io.to(docId).emit("doc-changes", { content, images: document.images });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

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

    console.log("Content to broadcast:", content);
    clearTimeout(saveTimeouts[docId]);

    saveTimeouts[docId] = setTimeout(() => {
      saveDocument(docId, content);
    }, 1000);
    io.to(docId).emit("doc-changes", content);
  });
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

async function saveDocument(docId, content) {
  try {
    await Document.findOneAndUpdate(
      { docId: docId },
      { content: content },
      { upsert: true }
    );
    console.log("saved doc");
  } catch (error) {
    console.log(error);
  }
}
