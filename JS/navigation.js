const links = document.querySelectorAll('#menu-lateral a');
const sections = document.querySelectorAll('section');
const menuToggle = document.getElementById('menu-toggle');
const aside = document.getElementById('menu-lateral');
const openModal = document.getElementById('open-modal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
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

document.addEventListener("DOMContentLoaded", () => {
    const footerInstrucciones = document.getElementById('footer-instrucciones');
    if (footerInstrucciones) {
        generarInstrucciones(footerInstrucciones);
    }

    const modalInstrucciones = document.getElementById('modal-instrucciones');
    if (modalInstrucciones) {
        generarInstrucciones(modalInstrucciones);
    }
});

function toggleMenu() {
    aside.classList.toggle('active');
    document.body.classList.toggle('menu-activo');

    if (aside.classList.contains('active')) {
        menuToggle.textContent = '✕';
    } else {
        menuToggle.textContent = '☰';
    }
}

menuToggle.addEventListener('click', toggleMenu);

openModal.addEventListener('click', (event) => {
    openModal.style.color = '#007BFF';
    event.preventDefault();
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    openModal.style.color = '';
    modal.style.display = 'none';
});

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});