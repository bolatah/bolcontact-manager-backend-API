const express = require("express");
const cors = require("cors");

const corsOptions = require("../repositories/utils");

const router = express.Router();
router.use(express.json(), cors(corsOptions));

const auth = require("../middleware/auth");

// route for uploading pictures
router.post("/", auth, async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

module.exports = router;
