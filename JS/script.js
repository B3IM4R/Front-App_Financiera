const instrucciones = [
    {
        titulo: "Organiza tus Datos",
        descripcion: "Digita y clasifica tus gastos, pasa el cursor sobre las categorías para ver detalles y agrega una si es necesario.",
    },
    {
        titulo: "Recomendación por IA",
        descripcion: "Observa los gráficos de tu gestión de recursos y oprime en 'Generar' para recibir una recomendación personalizada.",
    },
    {
        titulo: "Aprende y Edúcates",
        descripcion: "Explora los recursos de la página para mejorar tus hábitos financieros y tomar decisiones más informadas.",
    }
];

function generarInstrucciones(contenedor) {
    const html = instrucciones.map(instruccion => `
        <div class="instrucciones-box">
            <h3>${instruccion.titulo}</h3>
            <p>${instruccion.descripcion}</p>
        </div>
    `).join('');
    contenedor.innerHTML = html;
}

// Generar contenido en el footer y modal
document.addEventListener("DOMContentLoaded", () => {
    const footerInstrucciones = document.getElementById('footer-instrucciones');
    if (footerInstrucciones) {
        generarInstrucciones(footerInstrucciones);
    }
});