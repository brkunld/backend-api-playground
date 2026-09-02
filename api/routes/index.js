import express from "express";
import config from "../config/index.js";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", config });
});

export default router;
