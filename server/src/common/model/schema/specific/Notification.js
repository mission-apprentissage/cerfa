const { mongoose } = require("../../../mongodb");

const NotificationSchema = {
  context: {
    // TODO enum
    type: String,
    required: true,
    description: "context",
  },
  to: {
    type: String,
    required: true,
    description: "to whom email",
  },
  channel: {
    // TODO enum
    type: String,
    required: true,
    description: "channel",
  },
  subject: {
    type: String,
    required: true,
    description: "subject",
  },
  message: {
    type: String,
    default: null,
    description: "message",
  },
  link: {
    type: String,
    required: true,
    description: "link",
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
    description: "payload",
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
    description: "Date",
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
    description: "Notification active",
  },
};

module.exports = NotificationSchema;

// sendNotification("workspace_invite_tojoin", ["@user1"], ["email", "internal"], {
//   subject: `Invitation à rejoindre l'espace XXX`,
//   message: `Vous avez été invité à rejoindre l'espace XXX`,
//   link: `/pathto`,
//   payload: {},
// });
// sendNotification("workspace_invite_hasjoin", ["@user2"], ["internal"], {
//   subject: `User1 a rejoint l'espace XXX`,
//   message: `User1 a rejoint l'espace XXX`,
//   link: `/pathto`,
//   payload: {},
// });
