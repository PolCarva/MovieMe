//ELEMENTOS
const apikey = `dffa752f0a887fb5f01920bd042af708`;
const URL = `https://movie-me.glitch.me`;

const cardSlider = document.querySelector("#card-slider");

const encontrados = document.querySelector(".encontrados");
const ampliado = document.querySelector(".ampliadosDiv");
const listaDeFavs = document.querySelector(".listaDeFavs");

const button = document.querySelector("#searchBtn");
const inputSearch = document.querySelector("#inputSearch");

//Login el
const loginModal = document.querySelector(".loginModal");
let dataPelis = [];

const singupBtn = document.querySelector(".signupBtn");
const loginBtn = document.querySelector(".loginBtn");
const moveBtn = document.querySelector(".moveBtn");
const singup = document.querySelector(".singup");
const login = document.querySelector(".login");
const signUpBtn = document.querySelector("#signUpBtn");
const cerrarLogin = document.querySelector("#cerrarLogin");

const ingresarBtn = document.querySelector("#ingresarBtn");
const registrarseBtn = document.querySelector("#registrarseBtn");

const filtro = document.querySelector("#filtro");

let infoAgregar = {
  nombrePeli: "",
  posterPeli: "",
};

//EVENTOS
fetchTrends();
button.addEventListener("click", fetchBuscar);

if (localStorage.id_valido) {
  abrirCerrarLogin();
  dataPelis = JSON.parse(localStorage.pelis);
  listarPelis(dataPelis);
  signUpBtn.textContent = "Log Out";
} else {
  listarPelis([]);
  cerrarSesion();
  signUpBtn.textContent = "Sign Up";
}
filtro.addEventListener("change", filtrar);


//---Slider de recomendados---
const cardList = cardSlider.getElementsByTagName("li");
setInterval(() => {
  cardSlider.style.transform = `translateX(-20%)`;
}, 4000);
cardSlider.addEventListener("transitionend", function () {
  cardSlider.appendChild(cardSlider.firstElementChild);

  cardSlider.style.transition = "none";
  cardSlider.style.transform = "translateX(0)";
  setTimeout(() => {
    cardSlider.style.transition = "0.3s";
  });
});
//---fin del slider---


//FUNCIONES

function fetchTrends() {
  fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${apikey}&language=es`
  )
    .then((r) => r.json())
    .then((data) => {
      for (let i = 0; i <= 7; i++) {
        let nombre = data.results[i].title;
        nombre == undefined
          ? (nombre = data.results[i].name)
          : (nombre = data.results[i].title);

        cardSlider.innerHTML += `
        <li data-movie="${data.results[i].id}" class="movieList">
        <div class="card-content" style="background-image:url(https://image.tmdb.org/t/p/original/${data.results[i].poster_path});">
        <a href ="#referencia-ampliacion"></a>
        </div>
      </li>`;
      }
      cargarListas();
    });
}

function fetchBuscar(e) {
  e.preventDefault();
  encontrados.innerHTML = "";
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${inputSearch.value}&language=es`
  )
    .then((r) => r.json())
    .then((d) => {

      d.results.forEach((e) => {
        let nombre = e.title;
        nombre == undefined ? (nombre = e.name) : (nombre = nombre);

        let poster = `https://image.tmdb.org/t/p/w500/${e.poster_path}`;

        if (e.poster_path != null) {
          poster = poster;
        } else if (e.backdrop_path != null) {
          poster = `https://image.tmdb.org/t/p/w500/${e.backdrop_path}`;
        } else {
          poster = `img/imfNotFound.jpg`;
        }
        encontrados.innerHTML += `<div class="movie-card movieList" data-movie="${
          e.id
        }">
          <div class="movie-header" style="background-image: url(${poster});">
            <div class="header-icon-container">
              <a href="#referencia-ampliacion" class="icon"> <i class="fa-solid fa-circle-info"></i> </a>
            </div>
          </div>
          <div class="movie-content">
            <div class="movie-content-header">
              <a href="#referencia-ampliacion">
                <h3 class="movie-title">${nombre}</h3>
              </a>
            </div>
            <div class="movie-info">
              <span class="movie-time">${e.release_date}</span>
              <span class="movie-rating">${e.vote_average.toFixed(
                1
              )} <i class="fa-solid fa-star"></i></span>
            </div>
          </div>`;
      });
      inputSearch.value = "";

      cargarListas();
    })
    .catch((error) => console.log(error));
}

function fetchAmpliar() {
  fetch(`https://api.themoviedb.org/3/movie/${this.dataset.movie}?api_key=${apikey}&language=es}
  `)
    .then((r) => r.json())
    .then((d) => {
      let img = `https://image.tmdb.org/t/p/original/${d.backdrop_path}`;
      if (d.backdrop_path != null) {
        img = img;
      } else if (d.poster_path != null) {
        img = `https://image.tmdb.org/t/p/original/${d.poster_path}`;
      } else {
        img = `img/imfNotFound.jpg`;
      }
      ampliado.innerHTML = `<div class="ampliado" style="background-image: url(${img});">
          <div class="ampliado-content">
            <h2 class="titulo-ampliado">${d.title}</h2>
            <span>${d.release_date}</span>
            <span>
              ${d.vote_average.toFixed(1)} <i class="fas fa-star"></i>
            </span>
            <p>
              ${d.overview}
            </p>
            <div class="div-agregar-a-fav">
              <button class="agregar-a-fav" data-id="${
                d.id
              }"><a href="#miLista">Añadir a mi lista<a></button>
            </div>
          </div>
        </div>`;
      infoAgregar.nombrePeli = d.title;
      infoAgregar.posterPeli = img;
      document
        .querySelector(".agregar-a-fav")
        .addEventListener("click", agregarFav);
    });
}

function agregarFav() {
  nombreIngresar = infoAgregar.nombrePeli;
  posterIngresar = infoAgregar.posterPeli;

  fetch(`${URL}/pelis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: infoAgregar.nombrePeli,
      poster: infoAgregar.posterPeli,
    }),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (
        dataPelis.find((x) => x.nombre == datos.peliInsertada.nombre) !=
        undefined
      ) {
      } else {
        dataPelis.push(datos.peliInsertada);
        listarPelis(dataPelis);
      }
    });
}

function cargarListas() {
  const movieList = document.querySelectorAll(".movieList");
  movieList.forEach((e) => e.addEventListener("click", fetchAmpliar));
}

function listarPelis(_array) {
  if (_array.length == 0) {
    listaDeFavs.innerHTML = `<div>
      <i class="fa-solid fa-circle-exclamation"></i>
      <h3>Agrega películas a tu lista</h3>
    </div>`;
  } else {
    listaDeFavs.innerHTML = "";
  }

  _array.forEach((e) => {
    let checkeado = "";
    let comm = e.comentario;
    e.visto == true ? (checkeado = `checked="true"`) : (checkeado = ``);
    comm == "" ? (comm = "Edita para agregar una reseña...") : (comm = comm);

    listaDeFavs.insertAdjacentHTML(
      "afterbegin",
      `
    <li>
    <img src="${e.poster}" height="300px" alt="${e.nombre}" />
    <div class="favLi">
      <div>
      <i class="fas fa-edit editarComent" data-id="${e._id}"></i>
        <h3>${e.nombre}</h3>
        <div class="comentario"><p data-id="${e._id}" contenteditable="false">${comm}</p></div>
      </div>

      <div class="checkboxVisto">
      <i class="fa-solid fa-trash eliminar" data-id="${e._id}"></i>
      <input type="checkbox" ${checkeado} class="checkbox" data-idModificar="${e._id}"/></div>
    </div>
  </li>`
    );
  });
  let checkboxes = document.querySelectorAll(".checkbox");
  let edit = document.querySelectorAll(".editarComent");
  let basuras = document.querySelectorAll(".eliminar");
  checkboxes.forEach((element) => {
    element.addEventListener("change", modificarVisto);
  });
  edit.forEach((e) => {
    e.addEventListener("click", modificarComentario);
  });
  basuras.forEach((e) => {
    e.addEventListener("click", eliminarPeli);
  });
}

function modificarVisto() {
  let idModificar = this.getAttribute("data-idModificar");
  let vistoModificado = Boolean;
  this.checked == true ? (vistoModificado = true) : (vistoModificado = false);

  fetch(`${URL}/pelis/${idModificar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      visto: vistoModificado,
    }),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      let posicionModificar = dataPelis.findIndex((e) => e._id == datos._id);
      dataPelis[posicionModificar].visto = vistoModificado;
    })
    .catch((e) => console.log(e));
}

function modificarComentario() {
  let parrafo = this.nextElementSibling.nextElementSibling.firstElementChild;
  if (this.classList.contains("fas")) {
    this.classList.add("fa-solid");
    this.classList.add("fa-check");
    this.classList.remove("fas");
    this.classList.remove("fa-edit");
    parrafo.setAttribute("contenteditable", true);
    parrafo.style.border = "2px solid var(--color-white)";
  } else {
    this.classList.remove("fa-solid");
    this.classList.remove("fa-check");
    this.classList.add("fas");
    this.classList.add("fa-edit");
    parrafo.setAttribute("contenteditable", false);
    parrafo.style.border = "none";

    establecerComentario(parrafo);
  }
}

function establecerComentario(p) {
  let idModificar = p.getAttribute("data-id");

  fetch(`${URL}/pelis/${idModificar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comentario: p.textContent,
    }),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      let posicionModificar = dataPelis.findIndex((e) => e._id == datos._id);
      dataPelis[posicionModificar].comentario = p.textContent;
    })
    .catch((e) => console.log(e));
}

function eliminarPeli() {
  let idBorrar = this.getAttribute("data-id");

  fetch(`${URL}/pelis/${idBorrar}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((respuesta) => respuesta.json())
    .then((peli) => {
      let indxPeli = dataPelis.findIndex((e) => e.nombre === peli.nombre);
      dataPelis.splice(indxPeli, 1);
      filtrar();
    })
    .catch((e) => console.log(e));
}

function filtrar() {
  if (filtro.value == "todas") {
    listarPelis(dataPelis);
  } else if (filtro.value == "sinVer") {
    let resultado = dataPelis.filter((e) => e.visto == false);
    listarPelis(resultado);
  } else if (filtro.value == "vistas") {
    let resultado = dataPelis.filter((e) => e.visto == true);
    listarPelis(resultado);
  }
}

function resetearTodo() {
  ampliado.innerHTML = "";
  encontrados.innerHTML = "";
  listaDeFavs.innerHTML = `<div>
      <i class="fa-solid fa-circle-exclamation"></i>
      <h3>Ingresa para esta función</h3>
    </div>`;
  inputSearch.value = "";
}

//-------------LOGIN-------------//

//Eventos
signUpBtn.addEventListener("click", () => {
  cerrarSesion();
  signUpBtn.textContent = "Sign Up";
});

loginBtn.addEventListener("click", () => {
  moveBtn.classList.add("rightBtn");
  login.classList.add("loginForm");
  singup.classList.remove("singupForm");
  moveBtn.innerHTML = "Ingresar";
});

singupBtn.addEventListener("click", () => {
  moveBtn.classList.remove("rightBtn");
  login.classList.remove("loginForm");
  singup.classList.add("singupForm");
  moveBtn.innerHTML = "Registrarse";
});

signUpBtn.addEventListener("click", abrirCerrarLogin);
cerrarLogin.addEventListener("click", abrirCerrarLogin);

registrarseBtn.addEventListener("click", validarForm);
ingresarBtn.addEventListener("click", validarForm);
signUpBtn.addEventListener("click", () => {
  this.textContent == "Sign Up"
    ? (this.textContent = "Log Out")
    : (this.textContent = "Sign Up");
});

let id_Usuario = "";
let id_valido = false;

//Funciones
function abrirCerrarLogin() {
  loginModal.style.display == `none`
    ? (loginModal.style.display = "flex")
    : (loginModal.style.display = `none`);
}

function validarForm() {
  const userInpRegister = document.querySelector("#usuarioInpRegister");
  const passInpRegister = document.querySelector("#passInpRegister");
  const confirmarInpRegister = document.querySelector("#confirmarInpRegister");

  const userInpLogin = document.querySelector("#usuarioInpLogin");
  const passInpLogin = document.querySelector("#passInpLogin");

  let loginActivo = document.querySelector(".loginForm");

  if (loginActivo == null) {
    if (
      !validarInp(userInpRegister) ||
      !validarInp(passInpRegister) ||
      !validarInp(confirmarInpRegister)
    ) {
      alert("Completa todos los campos");
    } else if (passInpRegister.value != confirmarInpRegister.value) {
      alert("Las contraseñas no coinciden");
    } else {
      //TODO OK
      registrar(userInpRegister.value, passInpRegister.value);
    }
  } else {
    if (!validarInp(userInpLogin) || !validarInp(passInpLogin)) {
      alert("Completa todos los campos");
    } else {
      //TODO OK
      ingresar(userInpLogin.value, passInpLogin.value);
    }
  }
}

function validarInp(_inp) {
  if (_inp.value != "") {
    return true;
  } else {
    return false;
  }
}

function ingresar(_user, _pass) {
  fetch(`${URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: _user,
      pass: _pass,
    }),
  })
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.id_valido == false) {
        alert("no existe ese usuario");
      } else {
        dataPelis = datos.dataPelis;
        dataPelis.length > 0
          ? listarPelis(dataPelis)
          : (listaDeFavs.innerHTML = `<div>
    <i class="fa-solid fa-circle-exclamation"></i>
    <h3>Agrega películas a tu lista</h3>
  </div>`);
        localStorage.setItem("id_valido", datos.id_valido);
        localStorage.setItem("pelis", JSON.stringify(dataPelis));
        abrirCerrarLogin();
        signUpBtn.textContent = "Log Out";
        
      }
    })
    .catch((e) => console.log(e));
}

function registrar(_user, _pass) {
  fetch(`${URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: _user,
      pass: _pass,
    }),
  })
    .then((r) => r.json())
    .then((d) => {
      if (d.status) {
        alert("Este usuario ya existe");
      } else {
        ingresar(_user, _pass);
      }
    });
}

function cerrarSesion() {
  dataPelis = [];
  localStorage.clear();
  listarPelis(dataPelis);

  fetch(`${URL}/cerrar`)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      console.log(datos);
    });

  resetearTodo();
}

