const { mongoose } = require("../../mongodb");

const usersSchema = {
  username: {
    type: String,
    default: null,
    description: "username",
    unique: true,
  },
  email: {
    type: String,
    default: null,
    required: true,
    unique: true,
    description: "Email utilisateur",
  },
  password: {
    type: String,
    default: null,
    description: "Le mot de passe hashé",
  },
  nom: {
    type: String,
    default: null,
    required: true,
    description: "Le nom de l'utilisateur",
  },
  prenom: {
    type: String,
    default: null,
    required: true,
    description: "Le prénom de l'utilisateur",
  },
  telephone: {
    default: null,
    type: String,
    description: "Téléphone",
  },
  civility: {
    default: null,
    type: String,
    description: "civilité",
  },
  siret: {
    maxLength: 14,
    minLength: 14,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^([0-9]{14}|[0-9]{9} [0-9]{4})$/.test(v);
      },
      message: (props) => `${props.value} n'est pas un siret valide`,
    },
    type: String,
    description: "N° SIRET",
    default: null,
    example: "98765432400019",
  },
  siren: {
    default: null,
    type: String,
    description: "N° Siren",
  },
  has_accept_cgu: {
    default: null,
    type: String,
    description: "Version des cgu accepté par l'utilisateur",
  },
  account_status: {
    type: String,
    default: "FORCE_RESET_PASSWORD",
    description: "Account status",
  },
  orign_register: {
    default: null,
    type: String,
    description: "Origine de l'inscription",
  },
  isAdmin: {
    type: Boolean,
    default: false,
    description: "true si l'utilisateur est administrateur",
  },
  roles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "role",
    description: "Roles de l'utilisateur",
    default: [],
  },
  acl: {
    type: [String],
    default: [],
    description: "Access control level array",
  },
  last_connection: {
    type: Date,
    default: null,
    description: "Date de dernière connexion",
  },
  connection_history: {
    type: [Date],
    default: null,
    description: "Historique des dates de connexion",
  },
  status: {
    type: String,
    enum: ["connected", "disconnected"],
    default: "disconnected",
  },
  activities: {
    type: [
      new mongoose.Schema({
        page: {
          type: String,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
        },
      }),
    ],
    required: false,
    default: [],
    description: "Tracking activities",
  },
  tour_guide: {
    type: Boolean,
    default: true,
    description: "true si le tour guide est actif",
  },
  beta_test: {
    type: String,
    default: null,
    description: "version beta test, l'utilisateur souhaite activer les fonctionnalités en Beta",
  },
  confirmed: {
    type: Boolean,
    default: false,
    description: "l'utilisateur est confirmé",
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: "Date de création du compte",
  },
  invalided_token: {
    type: Boolean,
    default: false,
    description: "true si besoin de reset le token",
  },
};
module.exports = usersSchema;
