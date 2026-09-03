import express from "express";

import usersRouter from "./users.js";
import auditlogsRouter from "./auditlogs.js";
import categoriesRouter from "./categories.js";
import rolesRouter from "./roles.js";

const router = express.Router();

/* GET api root / healthcheck */
router.get("/", function (req, res, next) {
  res.json({
    status: "success",
    message: "API is running...",
    version: "1.0.0",
  });
});

router.use("/users", usersRouter);
router.use("/auditlogs", auditlogsRouter);
router.use("/categories", categoriesRouter);
router.use("/roles", rolesRouter);

export default router;
