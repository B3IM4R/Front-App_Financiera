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

async function mostrarRecomendacionesConDelay(recomendaciones, contenedor) {
    const titulo = document.createElement("h3");
    titulo.textContent = "Recomendaciones Personalizadas:";
    contenedor.appendChild(titulo);

    const ul = document.createElement("ul");
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

async function mostrarSeccionConTitulo(contenedor, tituloTexto, descripcionTexto) {
    const titulo = document.createElement("h3");
    contenedor.appendChild(titulo);

    await new Promise(resolve => {
        escribirTextoGradualmente(titulo, tituloTexto, 30, resolve);
    });

    const descripcion = document.createElement("p");
    contenedor.appendChild(descripcion);

    await new Promise(resolve => {
        escribirTextoGradualmente(descripcion, descripcionTexto, 25, resolve);
    });

    await new Promise(r => setTimeout(r, 500));
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
        "Alimentación", "Movilidad", "Vivienda", "Salud",
        "Educación", "Entretenimiento", "Vestuario", "Ahorros", "Deudas", "Otros"
    ];

    let datos = { Ingreso: ingresos };
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

    boton.disabled = true;
    boton.style.backgroundColor = "#18487A";
    boton.textContent = "Generando...";

    try {
        const respuesta = await fetch("https://api-app-financiera.onrender.com/recomendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();
        contenedor.innerHTML = "";

        if (resultado) {
            await mostrarSeccionConTitulo(
                contenedor,
                "📈 Clasificación Financiera: " + resultado["Clasificación Financiera"],
                resultado["Descripción Clasificación"]
            );

            await mostrarSeccionConTitulo(
                contenedor,
                "💼 Perfil Financiero: " + resultado["Perfil Financiero"],
                resultado["Descripción Perfil"]
            );

            if (resultado.Recomendaciones && resultado.Recomendaciones.length > 0) {
                await mostrarRecomendacionesConDelay(resultado.Recomendaciones, contenedor);
            }
        } else {
            contenedor.innerText = "No se recibieron datos válidos del servidor.";
        }

    } catch (error) {
        contenedor.innerText = "Error al conectar con el servidor.";
        console.error("Error:", error);
    }

    boton.disabled = false;
    boton.style.backgroundColor = "#002247";
    boton.textContent = "Generar";
});
