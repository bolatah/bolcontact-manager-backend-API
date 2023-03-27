const mongoose = require("mongoose");

require("dotenv").config();

// Connect to the correct environment database
mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database is not connected");
  });

/* const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;

if (process.env.NODE_ENV === "production") {
  mongoose.connect(prodConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
} else {
  mongoose.connect(devConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
} 
 */
