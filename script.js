let placas = [];

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");
const historialDiv = document.getElementById("historial");

// Cargar historial guardado
let historial = JSON.parse(localStorage.getItem("historialBusquedas")) || [];

// Mostrar historial
function mostrarHistorial() {
  historialDiv.innerHTML = historial
    .slice(-10)
    .reverse()
    .map(h => `🔎 ${h}`)
    .join("<br>");
}

// Cargar CSV
fetch("placas.csv")
  .then(response => response.text())
  .then(data => {
    placas = data
      .split(/\r?\n/)
      .map(line => line.split(",")[0])
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0);
  });

// Buscar
input.addEventListener("input", buscar);

function buscar() {
  const busqueda = input.value.toUpperCase().trim();
  resultadoDiv.innerHTML = "";

  if (busqueda.length === 0) return;

  // Guardar historial
  historial.push(busqueda);
  localStorage.setItem("historialBusquedas", JSON.stringify(historial));
  mostrarHistorial();

  const coincidencias = placas.filter(p =>
    p.startsWith(busqueda)
  );

  if (coincidencias.length > 0) {
    resultadoDiv.innerHTML = `
      <strong>Placas con embargo encontradas:</strong><br><br>
      ${coincidencias.map(p => `🚗 ${p}`).join("<br>")}
    `;
  } else {
    resultadoDiv.innerHTML = `❌ No se encontraron placas con embargo`;
  }
}

// Mostrar historial al cargar
mostrarHistorial();
