import express from "express";
import Roles from "../db/models/Roles.js";
import RolePrivileges from "../db/models/RolePrivileges.js";
import Response from "../lib/Response.js";
import CustomError from "../lib/Error.js";
import Enum from "../config/Enum.js";
import role_privileges from "../config/role_privileges.js";
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

    if (
      !body.permissions ||
      !Array.isArray(body.permissions) ||
      body.permissions.length === 0
    ) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "permissions field must be a non-empty Array",
      );
    }

    let role = new Roles({
      role_name: body.role_name,
      is_active: true,
      created_by: req.user?.id,
    });

    await role.save();

    for (let i = 0; i < body.permissions.length; i++) {
      let priv = new RolePrivileges({
        role_id: role._id,
        permission: body.permissions[i],
        created_by: req.user?.id,
      });

      await priv.save();
    }

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
    if (
      body.permissions &&
      Array.isArray(body.permissions) &&
      body.permissions.length > 0
    ) {
      let permissions = await RolePrivileges.find({ role_id: body._id });
      let removedPermissions = permissions.filter(
        (x) => !body.permissions.includes(x.permission),
      );

      let newPermissions = body.permissions.filter(
        (x) => !permissions.map((p) => p.permission).includes(x),
      );

      if (removedPermissions.length > 0) {
        await RolePrivileges.deleteMany({
          _id: { $in: removedPermissions.map((x) => x._id) },
        });
      }
      if (newPermissions.length > 0) {
        for (let i = 0; i < newPermissions.length; i++) {
          let priv = new RolePrivileges({
            role_id: body._id,
            permission: newPermissions[i],
            created_by: req.user?.id,
          });

          await priv.save();
        }
      }
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

    await Roles.deleteOne({ _id: body._id });

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.get("/role_privileges", async (req, res) => {
  res.json(role_privileges);
});

export default router;
