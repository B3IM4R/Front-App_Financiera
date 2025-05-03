const links = document.querySelectorAll('#menu-lateral a');
const sections = document.querySelectorAll('section');
const menuToggle = document.getElementById('menu-toggle');
const aside = document.getElementById('menu-lateral');
const openModal = document.getElementById('open-modal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

function mostrarModal() {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.classList.add('no-scroll');
    openModal.classList.add('active');
}

function cerrarModal() {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.classList.remove('no-scroll');
    openModal.classList.remove('active');
}

window.addEventListener('DOMContentLoaded', mostrarModal);

openModal.addEventListener('click', (event) => {
    event.preventDefault();
    mostrarModal();
});

closeModal.addEventListener('click', cerrarModal);

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

document.querySelectorAll('.acordeon-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const arrow = header.querySelector('.arrow');
        content.classList.toggle('open');
        header.classList.toggle('open');
    });
});
