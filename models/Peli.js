let mongoose = require("mongoose");
let schema = mongoose.Schema;

let peliSchema = new schema({
  nombre: String,
  comentario: String,
  visto: Boolean,
  poster: String,
  idUsuario: String,
});

let Peli = mongoose.model("Peli", peliSchema);
module.exports = Peli;
