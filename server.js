// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});


//Importo los modelos
let Usuario = require("./models/Usuario");
let Peli = require("./models/Peli");

//Conecto con la db
let mongoose = require("mongoose");

mongoose.set('strictQuery', true);

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.sm6ytdf.mongodb.net/pelidb?retryWrites=true&w=majority"
);
let db = mongoose.connection;
db.once("open", () => {
  console.log("la conexion a la base fue exitosa");
});

//CORS
let cors = require("cors");
app.use(cors());

app.use(express.json());

//Set default values
let id_Usuario = "";
let id_valido = false;


//Insertar
app.post("/pelis", (req, res) => {
  let nombrePeli = req.body.nombre;
  let posterPeli = req.body.poster;
  if (id_Usuario != "") {
    Peli.findOne(
      {
        nombre: nombrePeli,
        idUsuario: id_Usuario,
      },
      (err, e) => {
        if (e != null) {
          //Verifico que no exista
          console.log("Ya existe");
        } else {
          console.log("Insertado");
          let peli = new Peli({
            nombre: nombrePeli,
            comentario: "",
            poster: posterPeli,
            visto: false,
            idUsuario: id_Usuario,
          });

          //guardo peli en coleccion
          peli.save((err, peliInsertada) => {
            if (err) {
              console.log(err);
            } else {
              //mando la peli como dato
              res.json({ peliInsertada });
            }
          });
        }
      }
    );
  } else {
    console.log("Debes Ingresarte");
  }
});

//Editar
app.put("/pelis/:idModificar", (req, res) => {
  let idModificar = req.params.idModificar;

  let vistoCambiado = req.body.visto;
  let comentarioCambiado = req.body.comentario;
  Peli.findByIdAndUpdate(
    idModificar,
    {
      visto: vistoCambiado,
      comentario: comentarioCambiado,
    },
    (err, peliModificada) => {
      res.json(peliModificada);
    }
  );
});

//Borrar
app.delete("/pelis/:idBorrar", (req, res) => {
  let idBorrar = req.params.idBorrar;

  Peli.findByIdAndDelete(
    idBorrar,
    (err, peliBorrada) => {
      console.log("BORRADA: "+peliBorrada.nombre );
      res.json(peliBorrada);
    }
  );
})

//Login
app.post("/", (req, res) => {
  let usuarioRecibido = req.body.user;
  let passwordRecibida = req.body.pass;

  Usuario.findOne(
    {
      user: usuarioRecibido,
      pass: passwordRecibida,
    },
    (err, unUsuario) => {
      if (err) {
        console.log(err);
      } else if (unUsuario === null) {
        res.json({
          id_valido: false,
        });
      } else {
        let idUsuarioRecibido = unUsuario._id;

        Peli.find(
          {
            idUsuario: idUsuarioRecibido,
          },
          (error, pelis) => {
            if (error) {
              console.log(error);
            } else {
              id_Usuario = idUsuarioRecibido;
              res.json({
                id_valido: true,
                dataPelis: pelis,
              });
            }
          }
        );
      }
    }
  );
});

//Crear Usuario
app.post("/usuarios", (req, res) => {
  let nombreUsuario = req.body.user;
  let passwordUsuario = req.body.pass;
  console.log(nombreUsuario);
  console.log(passwordUsuario);
  Usuario.findOne(
    {
      user: nombreUsuario,
    },
    (err, e) => {
      if (e != null) {
        //Verifico que no exista
        console.log("Este usuario ya existe");
        res.json({status: true});

      } else {
        console.log("Creando nuevo Usuario");
        let usuario = new Usuario({
          user:  nombreUsuario,
          pass: passwordUsuario,
        });

        //guardo user en coleccion
        usuario.save((err, usuarioInsertado) => {
          if (err) {
            console.log(err);
          } else {
            //mando la user como dato
            res.json({ usuarioInsertado });
          }
        });
      }
    }
  );
});

//Cerrar Sesión
app.get("/cerrar", (req, res) => {
  id_valido = false;
  id_Usuario = "";
  res.json({
    mensaje: "sesión cerrada",
  });
});

//------MIDDLEWARE
app.use((req, res, next) => {
  if (id_valido) {
    next();
  } else {
    res.statusCode = 401;
    res.json({
      mensaje: "no autorizado",
    });
  }
});

app.use((req, res, next) => {
  res.statusCode = 404;
  res.send("la pagina solicitada no existe");
});

app.listen("3000", () => console.log(`Servidor corriendo en puerto 3000`));
