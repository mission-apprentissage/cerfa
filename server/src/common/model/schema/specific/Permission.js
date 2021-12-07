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
    required: function () {
      return !(this.dossierId === null);
    },
    nullable: true,
    default: null,
  },
  userEmail: {
    type: String,
    description: "User email",
    required: true,
    maxLength: 80,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/.test(v);
      },
      message: (props) => `${props.value} n'est pas un couriel valide`,
    },
    example: "energie3000.pro@gmail.com",
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
    description: "Role id",
    required: true,
  },
  acl: {
    type: [String],
    default: [],
    description: "Custom Access Control Level array",
  },
};
module.exports = permissionSchema;
