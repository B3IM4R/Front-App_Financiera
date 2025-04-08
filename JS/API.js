// Función para escribir texto letra por letra
function escribirTextoGradualmente(elemento, texto, velocidad = 30, callback = () => {}) {
    let i = 0;
    function escribir() {
        if (i < texto.length) {
            elemento.textContent += texto.charAt(i);
            i++;
            setTimeout(escribir, velocidad);
        } else {
            callback();
        }
    }
    escribir();
}

// Mostrar recomendaciones una por una con efecto
async function mostrarRecomendacionesConDelay(recomendaciones, contenedor) {
    const ul = document.createElement("ul");
    ul.classList.add("list-disc", "pl-6", "text-green-600");
    contenedor.appendChild(ul);

    for (let i = 0; i < recomendaciones.length; i++) {
        const li = document.createElement("li");
        ul.appendChild(li);

        await new Promise(resolve => {
            escribirTextoGradualmente(li, recomendaciones[i], 30, resolve);
        });

        await new Promise(r => setTimeout(r, 300));
    }
}

document.getElementById("btn-generar").addEventListener("click", async () => {
    const boton = document.getElementById("btn-generar");
    const ingresos = parseFloat(document.getElementById("ingresos").value.replace(/\./g, '').replace(',', '.')) || 0;
    const inputsGastos = document.querySelectorAll(".input-gastos");
    const contenedor = document.getElementById("respuesta-api");
    contenedor.innerHTML = "";

    if (ingresos <= 0) {
        contenedor.innerText = "Por favor, completa el campo de ingresos totales.";
        return;
    }

    let categorias = [
        "alimentacion", "movilidad", "vivienda", "salud",
        "educacion", "entretenimiento", "vestuario", "ahorros", "deudas", "otros"
    ];

    let datos = { ingresos };
    let categoriasLlenas = 0;

    inputsGastos.forEach((input, index) => {
        let valor = parseFloat(input.value.replace(/\./g, '').replace(',', '.')) || 0;
        datos[categorias[index]] = valor;
        if (valor > 0) {
            categoriasLlenas++;
        }
    });

    if (categoriasLlenas < 4) {
        contenedor.innerText = "Debes llenar al menos 4 categorías con gastos mayores a cero.";
        return;
    }

    // Desactivar botón y cambiar texto
    boton.disabled = true;
    boton.style.backgroundColor = "#18487A";
    boton.textContent = "Generando...";

    try {
        const respuesta = await fetch("http://localhost:8000/recomendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();
        contenedor.innerHTML = "";

        if (resultado.Recomendaciones && resultado.Recomendaciones.length > 0) {
            await mostrarRecomendacionesConDelay(resultado.Recomendaciones, contenedor);

            // También podrías mostrar las clasificaciones y descripciones si quieres:
            const info = document.createElement("div");
            info.innerHTML = `
                <p><strong>Clasificación Financiera:</strong> ${resultado["Clasificación Financiera"]}</p>
                <p>${resultado["Descripción Clasificación"]}</p>
                <p><strong>Perfil Financiero:</strong> ${resultado["Perfil Financiero"]}</p>
                <p>${resultado["Descripción Perfil"]}</p>
            `;
            contenedor.prepend(info);
        } else {
            contenedor.innerText = "No se recibieron recomendaciones.";
        }

    } catch (error) {
        contenedor.innerText = "Error al conectar con el servidor.";
        console.error("Error:", error);
    }

    // Reactivar botón y restaurar texto
    boton.disabled = false;
    boton.style.backgroundColor = "#002247";
    boton.textContent = "Generar";
});
