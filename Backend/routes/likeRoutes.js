const express = require("express");
const { toggleLike } = require("../controllers/likeController");

const router = express.Router();

router.post("/:id/like", toggleLike);

module.exports = router;