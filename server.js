const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

// start uploading
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "pictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("contactpicture");
// end uploading

const userRoute = require("./routes/userRoutes");
const contactRoute = require("./routes/contactRoutes");
const uploadRoute = require("./routes/uploadRoutes");

app.use("/api/users", userRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/contacts/upload", uploadRoute);

const server = app.listen(PORT, () => {
  console.log(`web service laueft unter http://${HOST}:${PORT}`);
});
