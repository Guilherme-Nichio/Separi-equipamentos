document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Mobile (Hambúrguer Perfeito)
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Acordeão dos Dropdowns no Mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if(window.innerWidth <= 768) {
                e.preventDefault();
                const parentDropdown = toggle.parentElement;
                
                document.querySelectorAll('.dropdown').forEach(d => {
                    if(d !== parentDropdown) {
                        d.classList.remove('active');
                    }
                });
                parentDropdown.classList.toggle('active');
            }
        });
    });

    // 3. Animação Reveal Suave
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 80;
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 4. Parallax Dinâmico (Apenas Desktop - Nas peças flutuantes do Hero)
    const parallaxWrappers = document.querySelectorAll('.parallax-wrapper');
    document.addEventListener('mousemove', (e) => {
        if(window.innerWidth > 768) {
            const x = (window.innerWidth - e.pageX) / 100;
            const y = (window.innerHeight - e.pageY) / 100;
            parallaxWrappers.forEach((wrapper) => {
                const speed = wrapper.getAttribute('data-speed') || 1;
                wrapper.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        }
    });

    // 5. Navbar Translúcida e Transição
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const navbar = document.querySelector('#main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbarWrapper.classList.add('scrolled-wrap');
        } else {
            navbar.classList.remove('scrolled');
            navbarWrapper.classList.remove('scrolled-wrap');
        }
    });

    // 6. Prevenir saltos em dropdowns no Desktop
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href') === '#') e.preventDefault();
        });
    });

    // 7. Efeito de Glow Colorido Dinâmico nos Cards de Equipamento (Específico da Página Equipamentos)
    const equipCards = document.querySelectorAll('.equip-card');
    equipCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--teal-light)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'rgba(0,0,0,0.03)';
        });
    });

});