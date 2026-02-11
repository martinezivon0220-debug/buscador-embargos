let placas = [];

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");
const historialDiv = document.getElementById("historial");
const contadorDiv = document.getElementById("contador");

// 🔢 CONTADOR (se guarda aunque cierres la app)
let totalConsultas = localStorage.getItem("totalConsultas")
  ? parseInt(localStorage.getItem("totalConsultas"))
  : 0;

contadorDiv.innerText = `Total de consultas realizadas: ${totalConsultas}`;

// 📂 Cargar CSV
fetch("placas.csv")
  .then(response => response.text())
  .then(data => {
    placas = data
      .split(/\r?\n/)
      .map(line => line.split(",")[0])
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0);

    console.log("Placas cargadas:", placas);
  });

// 🔎 BÚSQUEDA EN TIEMPO REAL
input.addEventListener("input", () => {
  const busqueda = input.value.toUpperCase().trim();
  resultadoDiv.innerHTML = "";

  if (busqueda.length === 0) return;

  // ➕ SUMA UNA CONSULTA
  totalConsultas++;
  localStorage.setItem("totalConsultas", totalConsultas);
  contadorDiv.innerText = `Total de consultas realizadas: ${totalConsultas}`;

  // 📜 HISTORIAL
  const item = document.createElement("div");
  item.textContent = `🔍 ${busqueda}`;
  historialDiv.prepend(item);

  // 🔍 COINCIDENCIAS
  const coincidencias = placas.filter(p => p.startsWith(busqueda));

  if (coincidencias.length > 0) {
    resultadoDiv.innerHTML = `
      <strong>Placas con embargo encontradas:</strong><br><br>
      ${coincidencias.map(p => `🚗 ${p}`).join("<br>")}
    `;
  } else {
    resultadoDiv.innerHTML = `
      ❌ No se encontraron placas con embargo
    `;
  }
});
