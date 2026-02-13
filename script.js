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
}

// ============================
// SI YA ESTÁ LOGUEADO
// ============================
if (localStorage.getItem("usuarioActivo")) {
  iniciarApp();
}

// ============================
// BUSCADOR + CONTADOR (SIN HISTORIAL)
// ============================
let placas = [];
let totalConsultas = 0;

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");
const contadorDiv = document.getElementById("contador");

// Cargar CSV
fetch("placas.csv")
  .then(r => r.text())
  .then(data => {
    placas = data
      .split(/\r?\n/)
      .map(p => p.trim().toUpperCase())
      .filter(p => p);
  });

// Búsqueda en tiempo real
input.addEventListener("input", () => {
  const busqueda = input.value.toUpperCase().trim();

  resultadoDiv.innerHTML = "";

  if (busqueda.length === 0) return;

  totalConsultas++;
  contadorDiv.innerText = `Total de consultas: ${totalConsultas}`;

  const coincidencias = placas.filter(p => p.startsWith(busqueda));

  if (coincidencias.length > 0) {
    resultadoDiv.innerHTML = coincidencias
      .map(p => `🚗 ${p}`)
      .join("<br>");
  } else {
    resultadoDiv.innerHTML = "❌ No se encontraron coincidencias";
  }
});
