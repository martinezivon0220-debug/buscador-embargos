// ============================
// USUARIOS DEL SISTEMA
// ============================
const usuarios = [
  { user: "Admin", pass: "1234" },
  { user: "capturador1", pass: "veh5678" },
  { user: "capturador2", pass: "veh5678" },
  { user: "capturador3", pass: "veh5678" },
  { user: "capturador4", pass: "veh5678" },
  { user: "capturador5", pass: "veh5678" }
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

  document.getElementById("usuarioActivo").innerText =
    localStorage.getItem("usuarioActivo");
}

// Auto-login
if (localStorage.getItem("usuarioActivo")) {
  iniciarApp();
}

// ============================
// BUSCADOR
// ============================
let placas = [];
let totalConsultas = 0;

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");
const contadorDiv = document.getElementById("contador");
const historialDiv = document.getElementById("historial");

// ============================
// CARGAR CSV (FIX EXCEL DEFINITIVO)
// ============================
fetch("placas.csv")
  .then(r => r.text())
  .then(texto => {
    placas = texto
      .replace(/\uFEFF/g, "")              // elimina BOM
      .split(/\r?\n/)                      // líneas
      .map(l => l.split(/[;,]/)[0])        // toma solo 1ra columna
      .map(p => p.trim().toUpperCase())    // limpia
      .filter(p => p.length > 0);

    console.log("PLACAS CARGADAS:", placas.slice(0, 10));
  });

// ============================
// BÚSQUEDA EN TIEMPO REAL
// ============================
input.addEventListener("input", () => {
  const busqueda = input.value.toUpperCase().trim();
  resultadoDiv.innerHTML = "";

  if (busqueda.length === 0) return;

  totalConsultas++;
  contadorDiv.innerText = `Total de consultas: ${totalConsultas}`;

  // Historial
  const h = document.createElement("div");
  h.innerText = "🔎 " + busqueda;
  historialDiv.appendChild(h);

  // Coincidencias
  const coincidencias = placas.filter(p => p.startsWith(busqueda));

  if (coincidencias.length > 0) {
    resultadoDiv.innerHTML =
      `<span style="color:green;">✔ Coincidencias encontradas:</span><br><br>` +
      coincidencias.map(p => `🚗 ${p}`).join("<br>");
  } else {
    resultadoDiv.innerHTML =
      `<span style="color:red;">❌ No se encontraron coincidencias</span>`;
  }
});
