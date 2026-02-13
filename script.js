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

  // Inicializar contador si no existe
  const stats = JSON.parse(localStorage.getItem("consultas")) || {};
  if (!stats[u]) stats[u] = 0;
  localStorage.setItem("consultas", JSON.stringify(stats));

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

  // Mostrar panel admin solo al Admin
  if (usuario === "Admin") {
    mostrarEstadisticasAdmin();
  }
}

// ============================
// AUTO LOGIN
// ============================
if (localStorage.getItem("usuarioActivo")) {
  iniciarApp();
}

// ============================
// BUSCADOR
// ============================
let placas = [];

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");
const contadorDiv = document.getElementById("contador");

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

  // ===== CONTADOR GLOBAL POR USUARIO =====
  const usuario = localStorage.getItem("usuarioActivo");
  const stats = JSON.parse(localStorage.getItem("consultas")) || {};
  stats[usuario] = (stats[usuario] || 0) + 1;
  localStorage.setItem("consultas", JSON.stringify(stats));

  contadorDiv.innerText = `Tus consultas: ${stats[usuario]}`;

  const coincidencias = placas.filter(p => p.startsWith(busqueda));

  if (coincidencias.length > 0) {
    resultadoDiv.innerHTML = coincidencias.map(p => `🚗 ${p}`).join("<br>");
  } else {
    resultadoDiv.innerHTML = "❌ No se encontraron coincidencias";
  }

  // Si es Admin, refresca panel
  if (usuario === "Admin") {
    mostrarEstadisticasAdmin();
  }
});

// ============================
// PANEL ADMIN
// ============================
function mostrarEstadisticasAdmin() {
  let panel = document.getElementById("panelAdmin");

  if (!panel) {
    panel = document.createElement("div");
    panel.id = "panelAdmin";
    panel.style.marginTop = "20px";
    panel.style.padding = "10px";
    panel.style.borderTop = "1px solid #ccc";
    document.getElementById("app").appendChild(panel);
  }

  const stats = JSON.parse(localStorage.getItem("consultas")) || {};
  let totalGeneral = 0;

  let html = "<h3>📊 Estadísticas (Admin)</h3>";

  for (const u in stats) {
    html += `<div>👤 ${u}: <strong>${stats[u]}</strong></div>`;
    totalGeneral += stats[u];
  }

  html += `<hr><div><strong>Total general: ${totalGeneral}</strong></div>`;

  panel.innerHTML = html;
}
