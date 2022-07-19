const maintenanceMessageSchema = {
  msg: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    nullable: true,
    enum: ["alert", "info", null],
  },
  context: {
    type: String,
    required: true,
    enum: ["manuel", "automatique", "maintenance"],
  },
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: false,
  },
  enabled: {
    type: Boolean,
    default: false,
  },
};
module.exports = maintenanceMessageSchema;
