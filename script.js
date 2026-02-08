let placas = [];

// Cargar el archivo CSV
fetch("placas.csv")
  .then(response => response.text())
  .then(data => {
    placas = data
      .split("\n")
      .map(p => p.trim().toUpperCase())
      .filter(p => p !== "");
  });

function buscarVehiculo() {
  const placaIngresada = document.getElementById("placa").value.toUpperCase();
  const resultadoDiv = document.getElementById("resultado");

  if (placas.includes(placaIngresada)) {
    resultadoDiv.innerHTML = `
      ✅ <strong>Placa encontrada</strong><br>
      Estado: <strong>REGISTRA INMOVILIZACIÓN / EMBARGO</strong>
    `;
  } else {
    resultadoDiv.innerHTML = "❌ Placa no encontrada en la base.";
  }
}
