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

// Si ya está logueado
if (localStorage.getItem("usuarioActivo")) {
  iniciarApp();
}

// ============================
// BUSCADOR + CONTADOR
// ============================
let placas = [];
let totalConsultas = Number(localStorage.getItem("totalConsultas")) || 0;

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");
const contadorDiv = document.getElementById("contador");

contadorDiv.innerText = `Total de consultas: ${totalConsultas}`;

// ============================
// CARGAR PLACAS DESDE GOOGLE SHEETS (ANTI CACHÉ)
// ============================
fetch(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRMWEEX2PpU_0lKDoQEhfpug6z4lr3tflwb2fVE51zZyWIu6nR17G3Z0g3Y9MCmEolZ2LDjB884_Cep/pub?gid=0&single=true&output=csv&t=" 
  + new Date().getTime()
)
  .then(r => r.text())
  .then(data => {
    placas = data
      .split(/\r?\n/)
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0);

    console.log("Placas cargadas:", placas.length);
  })
  .catch(err => {
    console.error("Error cargando CSV:", err);
  });

// ============================
// BÚSQUEDA EN TIEMPO REAL
// ============================
input.addEventListener("input", () => {
  const busqueda = input.value.toUpperCase().trim();
  resultadoDiv.innerHTML = "";

  if (busqueda.length === 0) return;

  totalConsultas++;
  localStorage.setItem("totalConsultas", totalConsultas);
  contadorDiv.innerText = `Total de consultas: ${totalConsultas}`;

  const coincidencias = placas.filter(p => p.startsWith(busqueda));

  if (coincidencias.length > 0) {
    resultadoDiv.innerHTML =
      "<span style='color:green'>🚗 Placas encontradas:</span><br><br>" +
      coincidencias.map(p => "🚗 " + p).join("<br>");
  } else {
    resultadoDiv.innerHTML =
      "<span style='color:red'>❌ No se encontraron coincidencias</span>";
  }
});
