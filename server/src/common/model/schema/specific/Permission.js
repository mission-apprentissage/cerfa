const { mongoose } = require("../../../mongodb");

const permissionSchema = {
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "workspace",
    description: "Workspace id",
    required: true,
  },
  dossierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "dossier",
    description: "Identifiant interne du dossier",
    required: true,
  },
  userEmail: {
    type: String,
    description: "User email",
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    description: "Role id",
    required: true,
  },
};
module.exports = permissionSchema;
