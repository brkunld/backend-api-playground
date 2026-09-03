import express from "express";
import { Query } from "mongoose";
const router = express.Router();

router.get("/:id", (req, res, next) => {
  res.json({
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers,
  });
});

export default router;
