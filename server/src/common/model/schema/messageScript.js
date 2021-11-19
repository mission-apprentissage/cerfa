const messageScriptSchema = {
  msg: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
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
module.exports = messageScriptSchema;
