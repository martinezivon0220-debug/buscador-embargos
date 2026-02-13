// ============================
// USUARIOS
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
// ============================
// LOGIN
// ============================
function login() {
  const u = document.getElementById("usuario").value.trim();
  const p = document.getElementById("password").value.trim();

  const valido = usuarios.find(x => x.user === u && x.pass === p);
  if (!valido) {
    document.getElementById("loginError").innerText =
      "Usuario o contraseña incorrectos";
    return;
  }

  localStorage.setItem("usuarioActivo", u);
  iniciarApp();
}

function logout() {
  localStorage.removeItem("usuarioActivo");
  location.reload();
}

function iniciarApp() {
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";

  const usuario = localStorage.getItem("usuarioActivo");
  document.getElementById("usuarioActivo").innerText = usuario;

  actualizarContador();
}

// Auto login
if (localStorage.getItem("usuarioActivo")) iniciarApp();

// ============================
// VARIABLES
// ============================
let placas = [];

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");
const contadorDiv = document.getElementById("contador");

// ============================
// CARGAR CSV DESDE GOOGLE SHEETS (ANTI CACHÉ)
// ============================
fetch(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRMWEEX2PpU_0lKDoQEhfpug6z4lr3tflwb2fVE51zZyWIu6nR17G3Z0g3Y9MCmEolZ2LDjB884_Cep/pub?gid=0&single=true&output=csv&t=" +
    new Date().getTime()
)
  .then(r => r.text())
  .then(data => {
    placas = data
      .split(/\r?\n/)
      .map(p =>
        p
          .replace(/"/g, "")
          .replace(/,/g, "")
          .trim()
          .toUpperCase()
      )
      .filter(p => p.length > 0);

    console.log("Placas cargadas:", placas.length);
  })
  .catch(err => console.error("Error CSV:", err));

// ============================
// CONTADORES
// ============================
function getStats() {
  return JSON.parse(localStorage.getItem("stats")) || {};
}

function saveStats(stats) {
  localStorage.setItem("stats", JSON.stringify(stats));
}

function sumarConsulta() {
  const usuario = localStorage.getItem("usuarioActivo");
  let stats = getStats();

  if (!stats[usuario]) stats[usuario] = 0;
  stats[usuario]++;

  saveStats(stats);
  actualizarContador();
}

function actualizarContador() {
  const usuario = localStorage.getItem("usuarioActivo");
  const stats = getStats();

  if (usuario === "Admin") {
    const total = Object.values(stats).reduce((a, b) => a + b, 0);
    contadorDiv.innerText = `Total general de consultas: ${total}`;
  } else {
    contadorDiv.innerText =
      `Total de consultas: ${stats[usuario] || 0}`;
  }
}

// ============================
// BUSCADOR
// ============================
input.addEventListener("input", () => {
  const busqueda = input.value.trim().toUpperCase();
  resultadoDiv.innerHTML = "";

  if (!busqueda) return;

  sumarConsulta();

  const existe = placas.includes(busqueda);

  if (existe) {
    resultadoDiv.innerHTML =
      "<span style='color:green'>✅ Placa CON embargo</span>";
  } else {
    resultadoDiv.innerHTML =
      "<span style='color:red'>❌ No se encontraron coincidencias</span>";
  }
});

