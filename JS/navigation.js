const links = document.querySelectorAll('#menu-lateral a');
const sections = document.querySelectorAll('section');
const menuToggle = document.getElementById('menu-toggle');
const aside = document.getElementById('menu-lateral');
const openModal = document.getElementById('open-modal');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');

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
    openModal.classList.add('active');
    event.preventDefault();
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    openModal.classList.remove('active');
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

document.querySelectorAll('.acordeon-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const arrow = header.querySelector('.arrow');
        content.classList.toggle('open');
        header.classList.toggle('open');
    });
});