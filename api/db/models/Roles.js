import mongoose, { version } from "mongoose";
import RolePrivileges from "./RolePrivileges.js";

const schema = mongoose.Schema(
  {
    role_name: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    created_by: {
      type: mongoose.SchemaTypes.ObjectId,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

class Roles extends mongoose.Model {
  static async deleteOne(query) {
    if (query._id) {
      await RolePrivileges.deleteMany({ role_id: query._id });
    }
    return super.deleteOne(query);
  }
}

schema.loadClass(Roles);
export default mongoose.model("roles", schema);
