import express from "express";
import Roles from "../db/models/Roles.js";
import RolePrivileges from "../db/models/RolePrivileges.js";
import Response from "../lib/Response.js";
import CustomError from "../lib/Error.js";
import Enum from "../config/Enum.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let roles = await Roles.find({});
    res.json(Response.successResponse(roles));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add", async (req, res) => {
  let body = req.body;
  try {
    if (!body.role_name) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "role_name field must be filled",
      );
    }

    let role = new Roles({
      role_name: body.role_name,
      is_active: true,
      created_by: req.user?.id,
    });

    await role.save();
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "_id field must be filled",
      );
    }
    let updates = {};
    if (body.role_name) {
      updates.role_name = body.role_name;
    }
    if (typeof body.is_active === "boolean") {
      updates.is_active = body.is_active;
    }

    await Roles.findByIdAndUpdate(body._id, updates);
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/delete", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error",
        "_id fields must be filled",
      );
    }

    await Roles.findByIdAndDelete(body._id);

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});
export default router;
