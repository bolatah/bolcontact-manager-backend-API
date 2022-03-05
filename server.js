const express = require("express");
const cors = require("cors");
// const auth = require("./middleware/auth");
const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "localhost";

const userRoute = require("./routes/userRoutes");
const contactRoute = require("./routes/contactRoutes");

app.use("/api/users", userRoute);
app.use("/api/contacts", contactRoute);

const server = app.listen(PORT, () => {
  console.log(`web service laueft unter http://${HOST}:${PORT}`);
});
