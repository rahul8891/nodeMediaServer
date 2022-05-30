const mongoose = require("../database/connection");

const iptvSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stream: {
    type: String,
    default: "",
  },
  app: {
    type: String,
    default: "",
  },
  path: {
    type: String,
    default: "",
  },
  // rtmp_path: {
  //   type: String,
  // },
  // stream_path: {
  //   type: String,
  // },
  start_at: {
    type: String,
  },
  end_at: {
    type: String,
  },
  status: {
    type: String,
    default: "start",
  },
  stream_status: {
    type: String,
    default: "1",
  },
  created_at: {
    type: Date,
    default: Date.now ,
  },
  updated_at: {
    type: Date,
    default: Date.now ,
  }
});

const Stream = mongoose.model("iptvs", iptvSchema);

//console.log(Stream);
module.exports = Stream;