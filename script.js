// ============================
// USUARIOS DEL SISTEMA
// ============================
const usuarios = [
  { user: "Admin", pass: "1234" },
  { user: "capturador1", pass: "veh5678" },
  { user: "capturador2", pass: "veh5678" },
  { user: "capturador3", pass: "veh5678" },
  { user: "capturador4", pass: "veh5678" },
  { user: "capturador5", pass: "veh5678" },
  { user: "capturador6", pass: "veh5678" },
  { user: "capturador7", pass: "veh5678" },
  { user: "capturador8", pass: "veh5678" },
  { user: "capturador9", pass: "veh5678" },
  { user: "capturador10", pass: "veh5678" }
];

// ============================
// VARIABLES GLOBALES
// ============================
let placas = [];
let totalConsultas = 0;

// ============================
// ESPERAR A QUE CARGUE EL HTML
// ============================
document.addEventListener("DOMContentLoaded", () => {

  // --------- LOGIN ----------
  window.login = function () {
    const u = document.getElementById("usuario").value.trim();
    const p = document.getElementById("password").value.trim();
    const error = document.getElementById("loginError");

    const valido = usuarios.find(x => x.user === u && x.pass === p);

    if (!valido) {
      error.innerText = "Usuario o contraseña incorrectos";
      return;
    }

    localStorage.setItem("usuarioActivo", u);
    iniciarApp();
  };

  window.logout = function () {
    localStorage.removeItem("usuarioActivo");
    location.reload();
  };

  function iniciarApp() {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    const usuario = localStorage.getItem("usuarioActivo");
    document.getElementById("usuarioActivo").innerText = usuario;
  }

  // Si ya hay sesión
  if (localStorage.getItem("usuarioActivo")) {
    iniciarApp();
  }

  // --------- BUSCADOR ----------
  const input = document.getElementById("placaInput");
  const resultadoDiv = document.getElementById("resultado");
  const contadorDiv = document.getElementById("contador");

  // Cargar placas desde Google Sheets (CSV público)
  fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRMWEEX2PpU_0lKDoQEhfpug6z4lr3tflwb2fVE51zZyWIu6nR17G3Z0g3Y9MCmEolZ2LDjB884_Cep/pub?gid=0&single=true&output=csv")
    .then(r => r.text())
    .then(data => {
      placas = data
        .split(/\r?\n/)
        .map(p => p.trim().toUpperCase())
        .filter(p => p.length > 0);

      console.log("Placas cargadas:", placas.length);
    })
    .catch(err => {
      console.error("Error cargando CSV", err);
    });

  input.addEventListener("input", () => {
    const busqueda = input.value.toUpperCase().trim();
    if (busqueda.length === 0) {
      resultadoDiv.innerHTML = "";
      return;
    }

    totalConsultas++;
    contadorDiv.innerText = `Total de consultas: ${totalConsultas}`;

    const coincidencias = placas.filter(p => p.startsWith(busqueda));

    if (coincidencias.length > 0) {
      resultadoDiv.innerHTML = coincidencias
        .map(p => `<div class="ok">🚗 ${p}</div>`)
        .join("");
    } else {
      resultadoDiv.innerHTML =
        `<div class="no">❌ No se encontraron coincidencias</div>`;
    }
  });

});
