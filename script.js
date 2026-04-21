document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. MENU MOBILE (Hambúrguer)
    // =========================================================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // =========================================================================
    // 2. ACORDEÃO DOS DROPDOWNS NO MOBILE
    // =========================================================================
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if(window.innerWidth <= 768) {
                e.preventDefault();
                const parentDropdown = toggle.parentElement;
                
                // Fecha os outros menus abertos para manter a organização
                document.querySelectorAll('.dropdown').forEach(d => {
                    if(d !== parentDropdown) {
                        d.classList.remove('active');
                    }
                });

                // Abre/Fecha o menu clicado
                parentDropdown.classList.toggle('active');
            }
        });
    });

    // Prevenir saltos (scroll to top) ao clicar em links vazios no Desktop
    const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href') === '#') e.preventDefault();
        });
    });

    // =========================================================================
    // 3. NAVBAR TRANSLÚCIDA AO ROLAR A PÁGINA
    // =========================================================================
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

    // =========================================================================
    // 4. ANIMAÇÃO DE REVEAL (Surgir suavemente ao fazer scroll)
    // =========================================================================
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
    revealOnScroll(); // Dispara logo no carregamento inicial

    // =========================================================================
    // 5. PARALLAX DINÂMICO NAS IMAGENS (Apenas Desktop)
    // =========================================================================
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

    // =========================================================================
    // 6. EFEITO GLOW SCROLL (Setores e Timeline iluminam no centro do ecrã)
    // =========================================================================
    const glowItems = document.querySelectorAll('.scroll-glow-item');
    const checkGlowFocus = () => {
        const windowCenter = window.innerHeight / 2;
        glowItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + (rect.height / 2);
            
            // Se o item estiver a +/- 150px do centro vertical do ecrã
            const isFocused = itemCenter > windowCenter - 150 && itemCenter < windowCenter + 150;
            if (isFocused) {
                item.classList.add('glow-active');
            } else {
                item.classList.remove('glow-active');
            }
        });
    };
    window.addEventListener('scroll', checkGlowFocus);
    checkGlowFocus(); 

    // =========================================================================
    // 7. EFEITO GLOW HOVER NOS CARTÕES DE EQUIPAMENTO
    // =========================================================================
    const equipCards = document.querySelectorAll('.equip-card');
    equipCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--teal-light)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'rgba(0,0,0,0.03)';
        });
    });

    // =========================================================================
    // 8. SISTEMA DE PARTÍCULAS (SÍMBOLO SEPARI / PARALLAX MOBILE)
    // =========================================================================
    const initParticleSystem = () => {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return; // Aborta silenciosamente se não houver canvas na página
        
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: -9999, y: -9999 };
        let isMobile = window.innerWidth <= 768;
        let currentScrollY = window.scrollY;

        const resizeCanvas = () => {
            isMobile = window.innerWidth <= 768;
            const parent = canvas.parentElement;
            width = parent.clientWidth;
            height = parent.clientHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        class Particle {
            constructor() {
                // Origem inicial aleatória
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                
                // Física Desktop (Atração para formar a Logo)
                this.targetX = 0;
                this.targetY = 0;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.friction = 0.90;
                this.ease = 0.03 + Math.random() * 0.03;
                
                // Física Mobile (Fundo solto de Parallax)
                this.parallaxSpeed = (Math.random() * 0.6) + 0.2; 
                
                // Aparência
                this.size = Math.random() * 1.5 + 0.5;
                this.color = Math.random() > 0.4 ? '#00A99D' : '#ffffff'; // Teal ou Branco
            }

            setTarget(tx, ty) {
                this.targetX = tx;
                this.targetY = ty;
                this.baseX = tx;
                this.baseY = ty;
            }

            updateDesktop() {
                // Interação com o rato (Repulsão magnética)
                let dxMouse = mouse.x - this.x;
                let dyMouse = mouse.y - this.y;
                let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                
                if (distMouse < 100) {
                    let force = (100 - distMouse) / 100;
                    this.vx -= (dxMouse / distMouse) * force * 3;
                    this.vy -= (dyMouse / distMouse) * force * 3;
                }

                // Efeito de flutuação natural (a logo "respira")
                this.targetX = this.baseX + Math.cos(Date.now() * 0.001 + this.baseY) * 3;
                this.targetY = this.baseY + Math.sin(Date.now() * 0.001 + this.baseX) * 3;

                // Move-se em direção ao Target (Coordenada da Logo)
                let dxTarget = this.targetX - this.x;
                let dyTarget = this.targetY - this.y;

                this.vx += dxTarget * this.ease;
                this.vy += dyTarget * this.ease;
                this.vx *= this.friction;
                this.vy *= this.friction;

                this.x += this.vx;
                this.y += this.vy;
            }

            updateMobile() {
                // No telemóvel, os pontos movem-se com o scroll
                this.y = this.baseY - (currentScrollY * this.parallaxSpeed);
                
                // Recicla os pontos se saírem da zona de visualização
                if (this.y < -20) this.baseY += height + 40;
                if (this.y > height + 20) this.baseY -= height + 40;
                
                // Balanço horizontal leve
                this.x += Math.sin(Date.now() * 0.001 + this.parallaxSpeed) * 0.3;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const cx = width / 2;
            const cy = height / 2;

            if (!isMobile) {
                // LÓGICA DESKTOP: DESENHAR A LOGO DA SEPARI (800 Pontos)
                const numParticles = 800;
                const scale = 1.6; 
                
                for(let i=0; i<numParticles; i++) {
                    let p = new Particle();
                    let px, py;
                    let r = Math.random();
                    
                    // 1. O Ponto Central Superior (15%)
                    if (r < 0.15) { 
                        let angle = Math.random() * Math.PI * 2;
                        let rad = Math.sqrt(Math.random()) * 20 * scale; 
                        px = cx + Math.cos(angle) * rad;
                        py = cy - 80 * scale + Math.sin(angle) * rad;
                    } 
                    // 2. Braço Esquerdo do 'V' (42.5%)
                    else if (r < 0.575) { 
                        let t = Math.random(); 
                        let w = Math.random(); 
                        let startX = -80, startY = -30; 
                        let endX = 0, endY = 70; 
                        let thickness = 30; 
                        
                        let pX_center = startX + t * (endX - startX);
                        let pY_center = startY + t * (endY - startY);
                        let nx = -(endY - startY), ny = (endX - startX);
                        let len = Math.sqrt(nx*nx + ny*ny);
                        nx /= len; ny /= len;
                        
                        px = cx + (pX_center + (w - 0.5) * thickness * nx) * scale;
                        py = cy + (pY_center + (w - 0.5) * thickness * ny) * scale;
                    } 
                    // 3. Braço Direito do 'V' (42.5%)
                    else { 
                        let t = Math.random(), w = Math.random();
                        let startX = 80, startY = -30;
                        let endX = 0, endY = 70;
                        let thickness = 30; 
                        
                        let pX_center = startX + t * (endX - startX);
                        let pY_center = startY + t * (endY - startY);
                        let nx = -(endY - startY), ny = (endX - startX);
                        let len = Math.sqrt(nx*nx + ny*ny);
                        nx /= len; ny /= len;
                        
                        px = cx + (pX_center + (w - 0.5) * thickness * nx) * scale;
                        py = cy + (pY_center + (w - 0.5) * thickness * ny) * scale;
                    }
                    p.setTarget(px, py);
                    particles.push(p);
                }
            } else {
                // LÓGICA MOBILE: 60 PONTOS SOLTOS PELO ECRÃ
                const numParticles = 60;
                for(let i=0; i<numParticles; i++) {
                    particles.push(new Particle());
                }
            }
        };

        const renderFrame = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.lineWidth = 0.5;
            for(let i=0; i<particles.length; i++) {
                
                if (!isMobile) {
                    particles[i].updateDesktop();
                } else {
                    particles[i].updateMobile();
                }
                
                particles[i].draw();
                
                // Conectar as partículas próximas com linhas (Efeito de Teia) apenas no Desktop
                if (!isMobile) {
                    for(let j = i + 1; j < particles.length; j++) {
                        let dx = particles[i].x - particles[j].x;
                        let dy = particles[i].y - particles[j].y;
                        let dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < 15) { 
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(0, 169, 157, ${1 - dist/15})`;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(renderFrame);
        };

        // Eventos e Listeners do Canvas
        window.addEventListener('scroll', () => { currentScrollY = window.scrollY; });
        window.addEventListener('resize', resizeCanvas);
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mouseleave', () => { 
            mouse.x = -9999; 
            mouse.y = -9999; 
        });

        // Arranque inicial
        resizeCanvas();
        renderFrame();
    };

    initParticleSystem();
});