let placas = [];

const input = document.getElementById("placaInput");
const resultadoDiv = document.getElementById("resultado");

// ===============================
// CARGAR PLACAS DESDE EL CSV
// (corrige problemas de Excel)
// ===============================
fetch("placas.csv")
  .then(response => response.text())
  .then(data => {
    placas = data
      .split(/\r?\n/)                 // elimina \r de Excel
      .map(line => line.split(",")[0]) // solo primera columna
      .map(p => p.trim().toUpperCase())
      .filter(p => p.length > 0);

    console.log("Placas cargadas:", placas); // debug
  })
  .catch(error => {
    console.error("Error cargando el CSV:", error);
  });

// ===============================
// BÚSQUEDA EN TIEMPO REAL
// (sin botón)
// ===============================
input.addEventListener("input", () => {
  const busqueda = input.value.toUpperCase().trim();
  resultadoDiv.innerHTML = "";

  if (busqueda.length === 0) return;

  const coincidencias = placas.filter(p =>
    p.startsWith(busqueda)
  );

  if (coincidencias.length > 0) {
    resultadoDiv.innerHTML = `
      <strong>🚨 Placas con embargo encontradas:</strong><br><br>
      ${coincidencias.map(p => `🚗 ${p}`).join("<br>")}
    `;
  } else {
    resultadoDiv.innerHTML = "❌ No se encontraron placas con embargo";
  }
});
