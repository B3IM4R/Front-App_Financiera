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

function crearEtiquetaPerfil(valor) {
    const span = document.createElement("span");
    span.classList.add("etiqueta-resultado");

    const iconos = {
        "Ahorrador": "💰",
        "Equilibrado": "⚖️",
        "Gastador": "💸",
        "Endeudado": "🧾",
        "Saludable": "🟢",
        "Aceptable": "🟡",
        "Riesgosa": "🟠",
        "Crítica": "🔴"
    };

    const iconSpan = document.createElement("span");
    iconSpan.classList.add("icono-emoji");

    const claseEmoji = `emoji-${valor.toLowerCase()}`;
    iconSpan.classList.add(claseEmoji);
    iconSpan.textContent = iconos[valor] || "";

    span.textContent = valor;
    span.prepend(iconSpan);
    span.classList.add(`etiqueta-${valor.toLowerCase()}`);

    return span;
}

function hacerScrollSiEsNecesario(elemento, offset = 500) {
    const rect = elemento.getBoundingClientRect();
    const absoluteY = window.scrollY + rect.top;

    window.scrollTo({
        top: absoluteY + offset,
        behavior: "smooth"
    });
}

async function mostrarRecomendacionesConDelay(recomendaciones, contenedor) {
    const titulo = document.createElement("h4");
    titulo.textContent = "Consejos que podrías considerar:";
    contenedor.appendChild(titulo);
    hacerScrollSiEsNecesario(titulo);

    const ul = document.createElement("ul");
    contenedor.appendChild(ul);

    for (let i = 0; i < recomendaciones.length; i++) {
        const li = document.createElement("li");
        ul.appendChild(li);
        hacerScrollSiEsNecesario(li);

        await new Promise(resolve => {
            escribirTextoGradualmente(li, recomendaciones[i], 20, resolve);
        });

        await new Promise(r => setTimeout(r, 300));
    }
}

async function mostrarSeccionConTitulo(contenedor, tituloTexto, descripcionTexto) {
    const titulo = document.createElement("h4");
    contenedor.appendChild(titulo);
    hacerScrollSiEsNecesario(titulo);

    const partes = tituloTexto.split(":");
    if (partes.length === 2) {
        const label = partes[0] + ": ";
        const valor = partes[1].trim();

        const spanEtiqueta = crearEtiquetaPerfil(valor);
        titulo.textContent = label;
        titulo.appendChild(spanEtiqueta);
    } else {
        await new Promise(resolve => {
            escribirTextoGradualmente(titulo, tituloTexto, 15, resolve);
        });
    }

    const descripcion = document.createElement("p");
    contenedor.appendChild(descripcion);
    hacerScrollSiEsNecesario(descripcion);

    await new Promise(resolve => {
        escribirTextoGradualmente(descripcion, descripcionTexto, 15, resolve);
    });

    await new Promise(r => setTimeout(r, 500));
}

document.getElementById("btn-generar").addEventListener("click", async () => {
    const boton = document.getElementById("btn-generar");
    const ingresos = parseFloat(document.getElementById("ingresos").value.replace(/\./g, '').replace(',', '.')) || 0;
    const inputsGastos = document.querySelectorAll(".input-gastos");
    const contenedor = document.getElementById("respuesta-api");
    contenedor.innerHTML = "";

    const crearMensajeAdvertencia = (texto) => {
        const p = document.createElement("p");
        p.id = "mensaje-advertencia";
        p.textContent = texto;
        contenedor.appendChild(p);
        hacerScrollSiEsNecesario(p);
    };

    if (ingresos <= 0) {
        crearMensajeAdvertencia("Por favor, completa el campo de ingresos totales.");
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
        crearMensajeAdvertencia("Debes llenar al menos 4 categorías con gastos mayores a cero.");
        return;
    }

    boton.disabled = true;
    boton.style.cursor = "not-allowed";
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
                "Clasificación Financiera: " + resultado["Clasificación Financiera"],
                resultado["Descripción Clasificación"]
            );

            await mostrarSeccionConTitulo(
                contenedor,
                "Perfil Financiero: " + resultado["Perfil Financiero"],
                resultado["Descripción Perfil"]
            );

            if (resultado.Recomendaciones && resultado.Recomendaciones.length > 0) {
                await mostrarRecomendacionesConDelay(resultado.Recomendaciones, contenedor);
            }
        } else {
            crearMensajeAdvertencia("No se recibieron datos válidos del servidor.");
        }

    } catch (error) {
        crearMensajeAdvertencia("Error al conectar con el servidor.");
        console.error("Error:", error);
    }

    boton.disabled = false;
    boton.style.cursor = "pointer";
    boton.style.backgroundColor = "#002247";
    boton.textContent = "Generar";
});