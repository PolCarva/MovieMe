let mongoose = require("mongoose");
let schema = mongoose.Schema;

let usuarioSchema = new schema({
  user: String,
  pass: String,
});
let Usuario = mongoose.model("Usuario", usuarioSchema);
module.exports = Usuario;
