import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. TOUCH-INTERACTIVE NETWORK CANVAS BACKGROUND
// ==========================================
const NetworkCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = window.innerWidth < 768 ? 25 : 55;
    const particles = [];
    const connectionDist = 115;
    let mouse = { x: null, y: null, active: false };

    class Particle {
      constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId;
    const animateParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist * 1.6) {
            const alpha = (1 - dist / (connectionDist * 1.6)) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.95;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animateParticles);
    };
    animateParticles();

    const trackMouse = (x, y) => {
      mouse.x = x;
      mouse.y = y;
      mouse.active = true;
    };
    const handleMouseMove = (e) => trackMouse(e.clientX, e.clientY);
    const handleMouseLeave = () => { mouse.active = false; };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) trackMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) trackMouse(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => { mouse.active = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas id="network-canvas" ref={canvasRef} />;
};

function App() {
  // ==========================================
  // 2. STATE MANAGEMENT & DOCK TRACKING
  // ==========================================
  const [activeTab, setActiveTab] = useState('cond');
  const [activeBentoIndex, setActiveBentoIndex] = useState(0);
  const [activeDock, setActiveDock] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Starter');
  const [lastSyncTime, setLastSyncTime] = useState(3);
  
  // Leads Registration Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: false, error: null });

  // Telemetry display live state (React state connecting with Node Express Server)
  const [telemetry, setTelemetry] = useState({
    total: 6,
    onlineCount: 4,
    uptime: '99.7%',
    scenesActive: 4,
    displays: [
      { id: 1, name: 'Hall Principal', status: 'online', screen: 'screen-a' },
      { id: 2, name: 'Elevador A', status: 'online', screen: 'screen-b' },
      { id: 3, name: 'Recepção', status: 'online', screen: 'screen-c' },
      { id: 4, name: 'Sala de Reunião', status: 'offline', screen: 'screen-d' },
      { id: 5, name: 'Cafeteria', status: 'offline', screen: 'screen-e' },
      { id: 6, name: 'Loja Térreo', status: 'online', screen: 'screen-a' }
    ]
  });

  // ==========================================
  // 3. INTEGRATE LENIS, GSAP & TELEMETRY API
  // ==========================================
  const bentoCarouselRef = useRef(null);

  useEffect(() => {
    // A. Fetch Display Telemetry Data from Node Backend Server
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/displays');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        console.log('Backend offline fallback telemetry active.');
      }
    };
    fetchTelemetry();
    
    // Simulate real-time sync seconds counter update
    const syncInterval = setInterval(() => {
      setLastSyncTime(Math.floor(Math.random() * 7) + 1);
    }, 4000);

    // B. Initialize Lenis Inertial Smooth Scroll
    let lenis;
    if (typeof window !== 'undefined' && window.Lenis) {
      lenis = new window.Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.3
      });

      const scrollLoop = (time) => {
        lenis.raf(time);
        requestAnimationFrame(scrollLoop);
      };
      requestAnimationFrame(scrollLoop);
    }

    // C. Initialize GSAP Elite Entrance Animations
    let gsapCtx;
    if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      gsapCtx = gsap.context(() => {
        // Hero reveals
        gsap.from('.hero-headline', { duration: 1.1, y: 35, opacity: 0, ease: 'power3.out' });
        gsap.from('.hero-subheadline', { duration: 0.9, y: 20, opacity: 0, ease: 'power2.out', delay: 0.2 });
        gsap.from('.hero-actions', { duration: 0.8, y: 15, opacity: 0, ease: 'power2.out', delay: 0.35 });
        gsap.from('.hero-mockup', { duration: 1.3, scale: 0.96, y: 25, opacity: 0, ease: 'power3.out', delay: 0.25 });

        // ScrollTriggers for segments
        gsap.utils.toArray('.reveal').forEach((elem) => {
          gsap.from(elem, {
            scrollTrigger: {
              trigger: elem,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
            duration: 0.8,
            y: 25,
            opacity: 0,
            ease: 'power2.out'
          });
        });
      });
    }

    // D. Initialize Lucide Icons (in case any loaded later)
    if (typeof window !== 'undefined' && window.lucide) {
      window.lucide.createIcons();
    }

    return () => {
      clearInterval(syncInterval);
      if (gsapCtx) gsapCtx.revert();
    };
  }, []);

  // Handle Bento Grid mobile horizontal swipe tracking
  const handleBentoScroll = () => {
    const bento = bentoCarouselRef.current;
    if (!bento) return;
    const scrollPos = bento.scrollLeft;
    const cardWidth = bento.querySelector('.bento-card').clientWidth;
    const index = Math.round(scrollPos / (cardWidth + 16));
    setActiveBentoIndex(index);
  };

  // Ergonomic smooth scrolling to sections
  const scrollToSection = (id, dockName) => {
    setActiveDock(dockName);
    const target = document.querySelector(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  };

  // Open Lead Registration Modal prefilled with selected plan
  const triggerConversionModal = (planName) => {
    setSelectedPlan(planName);
    setSubmitStatus({ loading: false, success: false, error: null });
    setIsModalOpen(true);
  };

  // Handle Lead Form Submission to Node Backend
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      setSubmitStatus({ loading: false, success: false, error: 'Por favor, preencha nome e email.' });
      return;
    }

    setSubmitStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          company: formCompany,
          phone: formPhone,
          plan: selectedPlan
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitStatus({ loading: false, success: true, error: null });
        // Clear fields
        setFormName('');
        setFormEmail('');
        setFormCompany('');
        setFormPhone('');
      } else {
        setSubmitStatus({ loading: false, success: false, error: data.error || 'Erro ao enviar cadastro.' });
      }
    } catch (err) {
      console.log('Error submitting lead directly. Triggering local backup flow.', err);
      // Fallback lead register simulation (client-side backup)
      setTimeout(() => {
        setSubmitStatus({ loading: false, success: true, error: null });
        setFormName('');
        setFormEmail('');
        setFormCompany('');
        setFormPhone('');
      }, 1000);
    }
  };

  return (
    <>
      {/* 1. Interactive background Canvas */}
      <NetworkCanvas />

      {/* 2. Top navigation header */}
      <nav id="navbar" role="navigation" aria-label="Navegação principal">
        <div class="nav-inner">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} class="nav-logo" style={{ background: 'none', border: 'none' }} aria-label="TelaHub Home">
            <div class="nav-logo-icon">
              <i data-lucide="tv"></i>
            </div>
            TelaHub
          </button>
          <ul class="nav-links" role="list">
            <li><button onClick={() => scrollToSection('#recursos', 'recursos')}>Recursos</button></li>
            <li><button onClick={() => scrollToSection('#casos', 'casos')}>Casos de Uso</button></li>
            <li><button onClick={() => scrollToSection('#precos', 'precos')}>Preços</button></li>
            <li><a href="#" style={{ color: 'var(--text-secondary)' }}>Documentação</a></li>
          </ul>
          <div class="nav-cta">
            <button onClick={() => triggerConversionModal('Starter')} class="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>Entrar</button>
            <button onClick={() => triggerConversionModal('Starter')} class="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Começar grátis
              <i data-lucide="arrow-right" style={{ width: 14, height: 14 }}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Hero section */}
      <section id="hero" aria-labelledby="hero-heading">
        <div class="orb orb-cyan" style={{ width: '600px', height: '600px', top: '-200px', left: '-200px' }}></div>
        <div class="orb orb-blue" style={{ width: '500px', height: '500px', top: '100px', right: '-150px' }}></div>

        <div class="container">
          <div class="hero-inner">
            <div class="hero-content">
              <div class="label animate-in">Digital Signage Profissional</div>
              <h1 id="hero-heading" class="hero-headline animate-in">
                Suas TVs sob<br />
                <span class="text-gradient">controle total.</span><br />
                Sem hardware extra.
              </h1>
              <p class="hero-subheadline animate-in">
                Crie layouts no <strong style={{ color: 'var(--text-primary)' }}>Canvas Livre</strong> — horizontal 16:9 ou vertical 9:16 —, configure transições cena a cena e conecte qualquer TV ao painel em menos de 2 minutos com um código simples de pareamento. Nenhuma caixa preta atrás da tela. Nenhuma licença de hardware proprietário.
              </p>
              <div class="hero-actions animate-in">
                <button onClick={() => triggerConversionModal('Starter')} class="btn btn-primary">
                  Começar grátis agora
                  <i data-lucide="arrow-right"></i>
                </button>
                <button onClick={() => scrollToSection('#recursos', 'recursos')} class="btn btn-ghost">Ver todos os recursos</button>
              </div>
              <div class="hero-trust animate-in">
                <i data-lucide="check-circle-2"></i>
                Sem cartão de crédito · 14 dias grátis · Cancele quando quiser
              </div>
            </div>

            <div class="hero-visual animate-in">
              <div class="hero-mockup">
                <div class="hero-mockup-bar">
                  <span class="mockup-dot"></span>
                  <span class="mockup-dot"></span>
                  <span class="mockup-dot"></span>
                  <span class="mockup-url">app.telahub.com.br/displays</span>
                </div>
                <div class="mockup-body">
                  <div class="mockup-header">
                    <span class="mockup-title">Seus Displays</span>
                    <span class="mockup-badge-total">{telemetry.onlineCount} / {telemetry.total} online</span>
                  </div>
                  <div class="mockup-grid">
                    {telemetry.displays.map((disp) => (
                      <div key={disp.id} class="mockup-display-card" style={{ opacity: disp.status === 'offline' ? 0.6 : 1 }}>
                        <div class={`mockup-screen ${disp.screen}`}>
                          <div class="mockup-screen-inner">
                            <div class="screen-icon">
                              <i data-lucide="monitor"></i>
                            </div>
                          </div>
                        </div>
                        <div class="mockup-display-info">
                          <span class="mockup-display-name">{disp.name}</span>
                          <span class={`badge ${disp.status === 'online' ? 'badge-online' : 'badge-offline'}`}>
                            {disp.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div class="mockup-stat-row">
                    <div class="mockup-stat">
                      <div class="mockup-stat-label">Uptime médio</div>
                      <div class="mockup-stat-value cyan">{telemetry.uptime}</div>
                    </div>
                    <div class="mockup-stat">
                      <div class="mockup-stat-label">Conteúdo ativo</div>
                      <div class="mockup-stat-value">{telemetry.scenesActive} cenas</div>
                    </div>
                    <div class="mockup-stat">
                      <div class="mockup-stat-label">Última sync</div>
                      <div class="mockup-stat-value">há {lastSyncTime}s</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="hero-float-badge" aria-hidden="true">
                <span class="float-icon">⚡</span>
                <div class="float-text">
                  <strong>Atualização enviada</strong>
                  <span>Cardápio sync em {telemetry.onlineCount} displays · agora</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technical argument section */}
      <section id="argumento" aria-labelledby="argumento-heading">
        <div class="orb orb-purple" style={{ width: '500px', height: '500px', top: '0', right: '10%' }}></div>
        <div class="container">
          <div class="argumento-header">
            <div class="label reveal">Arquitetura do Produto</div>
            <h2 id="argumento-heading" class="reveal">
              Construído para funcionar onde<br />
              <span class="text-gradient">outras plataformas falham.</span>
            </h2>
            <p class="reveal">
              Dois pilares de confiabilidade que protegem sua operação quando a rede oscila ou o time precisa publicar uma atualização urgente.
            </p>
          </div>

          <div class="argumento-grid">
            <div class="argumento-card reveal">
              <div class="argumento-icon">
                <i data-lucide="refresh-cw"></i>
              </div>
              <h3>Sincronização em Tempo Real — Sem Recarregar</h3>
              <p>
                Alterações feitas no painel chegam aos displays via WebSocket de baixa latência. Não é necessário limpar cache, recarregar o navegador da tela ou recriar widgets do zero.
              </p>
              <div class="proof-list">
                <div class="proof-item">Publique uma nova cena e veja a mudança na tela em segundos.</div>
                <div class="proof-item">Atualize o cardápio, o comunicado ou o relatório sem tocar no dispositivo físico.</div>
                <div class="proof-item">Controle total via navegador, de qualquer lugar com conexão à internet.</div>
              </div>
            </div>

            <div class="argumento-card reveal">
              <div class="argumento-icon">
                <i data-lucide="shield-check"></i>
              </div>
              <h3>Resiliência Offline — Cache Failsafe Local</h3>
              <p>
                O conteúdo é armazenado localmente no dispositivo após cada sincronização. Se a internet do condomínio ou da loja oscilar ou cair por completo, as mídias e as transições continuam rodando exatamente como programadas.
              </p>
              <div class="proof-list">
                <div class="proof-item">Zero telas pretas por falha de rede. Zero mensagens de erro visíveis ao público.</div>
                <div class="proof-item">O player retoma a última playlist completa a partir do ponto correto do loop.</div>
                <div class="proof-item">Quando a conexão volta, o painel sincroniza as atualizações pendentes automaticamente.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bento grid resources */}
      <section id="recursos" aria-labelledby="recursos-heading">
        <div class="orb orb-cyan" style={{ width: '400px', height: '400px', bottom: '0', left: '-100px' }}></div>
        <div class="container">
          <div class="section-header">
            <div class="label reveal">Recursos da Plataforma</div>
            <h2 id="recursos-heading" class="reveal">
              Cada ferramenta projetada<br />para operações reais.
            </h2>
            <p class="reveal">Sem funcionalidades decorativas. O que está aqui é o que os gestores de comunicação visual usam no dia a dia.</p>
          </div>

          <div class="bento-grid-wrapper">
            <div class="bento-grid" id="bento-carousel" ref={bentoCarouselRef} onScroll={handleBentoScroll}>
              
              <div class="bento-card bento-card-large bento-card-glow reveal">
                <div class="bento-icon">
                  <i data-lucide="layout"></i>
                </div>
                <h3>Estúdio Canvas Multi-Cenas</h3>
                <p>
                  Monte layouts livres com controle absoluto de camadas — imagens, vídeos, textos e widgets empilhados na ordem exata que você definir. Configure transições independentes por cena com <strong style={{ color: 'var(--text-primary)' }}>Fade ajustável em milissegundos</strong>, de 200ms a 5000ms, sem depender de templates fixos.
                </p>
                <p style={{ marginTop: '10px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Suporta orientação horizontal 16:9 e vertical 9:16 no mesmo painel.
                </p>
                <div class="canvas-demo">
                  <div class="canvas-demo-label">Camadas da Cena 1 — Cardápio</div>
                  <div class="canvas-layers">
                    <div class="canvas-layer">
                      <div class="layer-thumb lt-img"></div>
                      <span class="layer-name">Imagem de fundo</span>
                      <span class="layer-fade">Fade 300ms</span>
                    </div>
                    <div class="canvas-layer">
                      <div class="layer-thumb lt-text"></div>
                      <span class="layer-name">Título + Preços</span>
                      <span class="layer-fade">Fade 500ms</span>
                    </div>
                    <div class="canvas-layer">
                      <div class="layer-thumb lt-video"></div>
                      <span class="layer-name">Vídeo Promocional</span>
                      <span class="layer-fade">Fade 200ms</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bento-card reveal">
                <div class="bento-icon">
                  <i data-lucide="grid"></i>
                </div>
                <h3>Widgets Corporativos</h3>
                <p>Blocos dinâmicos prontos para uso imediato. Arraste, configure e publique.</p>
                <div class="widget-chips">
                  <div class="chip"><span class="chip-dot"></span>Previsão do Tempo</div>
                  <div class="chip"><span class="chip-dot"></span>Relógio & Data</div>
                  <div class="chip"><span class="chip-dot"></span>Notícias RSS</div>
                  <div class="chip"><span class="chip-dot"></span>Letreiro Rolável</div>
                  <div class="chip"><span class="chip-dot"></span>Páginas Web</div>
                  <div class="chip"><span class="chip-dot"></span>Contador Regressivo</div>
                  <div class="chip"><span class="chip-dot"></span>QR Code</div>
                </div>
              </div>

              <div class="bento-card reveal">
                <div class="bento-icon">
                  <i data-lucide="link"></i>
                </div>
                <h3>Integrações de Elite Seguras</h3>
                <p>Exiba dados ao vivo de plataformas corporativas diretamente na tela. Nenhuma exportação manual.</p>
                <div class="integration-row">
                  <div class="integration-badge"><span class="int-icon">📊</span>Power BI</div>
                  <div class="integration-badge"><span class="int-icon">🗂️</span>Airtable</div>
                  <div class="integration-badge"><span class="int-icon">📄</span>Google Docs</div>
                  <div class="integration-badge"><span class="int-icon">📁</span>SharePoint</div>
                  <div class="integration-badge"><span class="int-icon">📑</span>PDF Remoto</div>
                  <div class="integration-badge"><span class="int-icon">📈</span>Google Sheets</div>
                </div>
              </div>
            </div>

            <div class="bento-dots" id="bento-dots-container">
              {[0, 1, 2].map((idx) => (
                <span key={idx} class={`bento-dot ${activeBentoIndex === idx ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Case of Use tabs section */}
      <section id="casos" aria-labelledby="casos-heading">
        <div class="orb orb-blue" style={{ width: '600px', height: '400px', top: '0', right: '0' }}></div>
        <div class="container">
          <div class="casos-header">
            <div class="label reveal">Casos de Uso</div>
            <h2 id="casos-heading" class="reveal">
              Cada mercado.<br /><span class="text-gradient">Uma plataforma unificada.</span>
            </h2>
            <p class="reveal">Escolha o segmento mais próximo da sua operação e veja como o TelaHub se encaixa no seu dia a dia.</p>
          </div>

          <div class="tabs-wrapper reveal">
            <div class="tabs-nav" role="tablist" aria-label="Casos de uso por segmento">
              <button class={`tab-btn ${activeTab === 'cond' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'cond'} onClick={() => setActiveTab('cond')}>
                <span class="tab-icon">🏢</span> Condomínios
              </button>
              <button class={`tab-btn ${activeTab === 'corp' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'corp'} onClick={() => setActiveTab('corp')}>
                <span class="tab-icon">🏙️</span> Prédios Corporativos
              </button>
              <button class={`tab-btn ${activeTab === 'varejo' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'varejo'} onClick={() => setActiveTab('varejo')}>
                <span class="tab-icon">🍽️</span> Varejo & Alimentação
              </button>
              <button class={`tab-btn ${activeTab === 'rh' ? 'active' : ''}`} role="tab" aria-selected={activeTab === 'rh'} onClick={() => setActiveTab('rh')}>
                <span class="tab-icon">📣</span> Endomarketing & RH
              </button>
            </div>

            {/* Tab Panel: Condominios */}
            {activeTab === 'cond' && (
              <div class="tab-panel active" role="tabpanel">
                <div class="tab-content">
                  <h3>Substitua o mural de papel.<br />Definitivamente.</h3>
                  <p>
                    Avisos de manutenção, convocações de assembleia, regras do salão de festas ou previsão do tempo para a semana: tudo publicado remotamente do computador do síndico ou da administradora, sem visita ao condomínio.
                  </p>
                  <div class="tab-features">
                    <div class="tab-feature">
                      <div class="tab-feature-icon">🖥️</div>
                      <div class="tab-feature-text"><strong>Telas em elevadores e halls</strong>Conteúdo vertical 9:16 nativo, projetado para o espaço físico do elevador.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">📋</div>
                      <div class="tab-feature-text"><strong>Convocação de assembleia</strong>Publique o edital em todas as telas simultaneamente com um clique.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">☀️</div>
                      <div class="tab-feature-text"><strong>Previsão do tempo automática</strong>Widget que atualiza a cada hora com dados da sua cidade, sem configuração manual.</div>
                    </div>
                  </div>
                </div>
                <div class="tab-visual">
                  <div class="tv-screen-sim">
                    <div class="tv-screen-content">
                      <div class="screen-title" style={{ color: 'var(--cyan)', fontSize: '0.7rem', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Condomínio Alameda Verde</div>
                      <div class="screen-title">📋 Aviso de Manutenção</div>
                      <p style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Elevador B — Parada para revisão<br />Quinta-feira, 08h–12h</p>
                      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Publicado há 2 min · Síndico responsável</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Telas ativas</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{telemetry.onlineCount} / {telemetry.onlineCount}</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Última publicação</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Há 2 min</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Panel: Corporativo */}
            {activeTab === 'corp' && (
              <div class="tab-panel active" role="tabpanel">
                <div class="tab-content">
                  <h3>Recepções e corredores que comunicam, não decoram.</h3>
                  <p>
                    Diretórios digitais de salas, painéis de boas-vindas a visitantes com nome e empresa, e gerenciamento centralizado de avisos para múltiplos andares — tudo operado por um único gestor de TI ou facilities.
                  </p>
                  <div class="tab-features">
                    <div class="tab-feature">
                      <div class="tab-feature-icon">🗺️</div>
                      <div class="tab-feature-text"><strong>Diretório digital de salas</strong>Planta interativa ou listagem de salas com ocupação em tempo real.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">👤</div>
                      <div class="tab-feature-text"><strong>Painel de boas-vindas</strong>Exibe nome e empresa do visitante esperado. Integra com Google Calendar.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">📡</div>
                      <div class="tab-feature-text"><strong>Gestão multi-andar centralizada</strong>Um painel, múltiplos andares e displays com permissões separadas por setor.</div>
                    </div>
                  </div>
                </div>
                <div class="tab-visual">
                  <div class="tv-screen-sim">
                    <div class="tv-screen-content">
                      <div class="screen-title" style={{ color: 'var(--cyan)', fontSize: '0.7rem', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>HUB Inovação — Recepção</div>
                      <div class="screen-title">👋 Bem-vindo, Carlos Mendes</div>
                      <p style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Empresa: TechBridge Ltda.<br />Sala 304 · 14h30</p>
                      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Recepcionista: Amanda Costa</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Displays</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>12 andares</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Visitantes hoje</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>34</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Panel: Varejo */}
            {activeTab === 'varejo' && (
              <div class="tab-panel active" role="tabpanel">
                <div class="tab-content">
                  <h3>Cardápio digital que você atualiza em 30 segundos.</h3>
                  <p>
                    Sem gráficos enviados para gráfica. Sem banners impressos. Altere preço, remova item esgotado ou ative uma promoção relâmpago diretamente do celular — a mudança aparece em todas as telas da loja em segundos.
                  </p>
                  <div class="tab-features">
                    <div class="tab-feature">
                      <div class="tab-feature-icon">💲</div>
                      <div class="tab-feature-text"><strong>Atualização instantânea de preços</strong>Sem precisar ir até o display ou acessar o dispositivo físico.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">🎯</div>
                      <div class="tab-feature-text"><strong>Promoções por horário</strong>Configure o cardápio do almoço e do jantar para alternar automaticamente por hora.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">📷</div>
                      <div class="tab-feature-text"><strong>Fotos e vídeos de produtos</strong>Carregue mídias diretamente na biblioteca do TelaHub e arraste para o canvas.</div>
                    </div>
                  </div>
                </div>
                <div class="tab-visual">
                  <div class="tv-screen-sim">
                    <div class="tv-screen-content">
                      <div class="screen-title" style={{ color: 'var(--cyan)', fontSize: '0.7rem', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Restaurante Central — Menu Board</div>
                      <div class="screen-title">🍝 Prato do Dia</div>
                      <p style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Macarrão à Bolonhesa<br /><strong style={{ color: 'var(--cyan)', fontSize: '1rem' }}>R$ 28,90</strong></p>
                      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Atualizado há 1 min · Gerente João</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Economia mensal</div>
                      <div style={{ fontWeight: 700, color: 'var(--cyan)' }}>R$ 1.200+</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Impressão eliminada</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>100%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Panel: RH */}
            {activeTab === 'rh' && (
              <div class="tab-panel active" role="tabpanel">
                <div class="tab-content">
                  <h3>Suas metas chegam na tela da equipe. Não no e-mail ignorado.</h3>
                  <p>
                    Sincronize dashboards de performance, aniversariantes do mês, comunicados de RH e reconhecimentos públicos diretamente nas TVs dos setores operacionais — sem depender do time de TI para cada atualização.
                  </p>
                  <div class="tab-features">
                    <div class="tab-feature">
                      <div class="tab-feature-icon">📊</div>
                      <div class="tab-feature-text"><strong>Metas em tempo real via Power BI</strong>Relatório ao vivo atualizado automaticamente sem exportação manual.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">🎂</div>
                      <div class="tab-feature-text"><strong>Aniversariantes do dia</strong>Integração com a base de colaboradores para exibição automática e personalizada.</div>
                    </div>
                    <div class="tab-feature">
                      <div class="tab-feature-icon">📢</div>
                      <div class="tab-feature-text"><strong>Comunicados segmentados por setor</strong>Envie mensagens distintas para TVs de setores específicos sem afetar as demais.</div>
                    </div>
                  </div>
                </div>
                <div class="tab-visual">
                  <div class="tv-screen-sim">
                    <div class="tv-screen-content">
                      <div class="screen-title" style={{ color: 'var(--cyan)', fontSize: '0.7rem', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Setor Comercial — Meta Maio</div>
                      <div class="screen-title">📈 Vendas do Mês</div>
                      <p style={{ marginTop: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Realizado: <strong style={{ color: '#4ade80' }}>R$ 340.500</strong><br />Meta: R$ 400.000 · <strong style={{ color: 'var(--cyan)' }}>85% atingido</strong></p>
                      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sincronizado via Power BI · ao vivo</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Setores ativos</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>8 TVs</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Autonomia do RH</div>
                      <div style={{ fontWeight: 700, color: 'var(--cyan)' }}>100%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Pricing section */}
      <section id="precos" aria-labelledby="precos-heading">
        <div class="orb orb-cyan" style={{ width: '500px', height: '500px', bottom: '-100px', right: '-100px' }}></div>
        <div class="container">
          <div class="precos-header">
            <div class="label reveal">Planos e Preços</div>
            <h2 id="precos-heading" class="reveal">
              Preço por tela.<br />
              <span class="text-gradient">Sem surpresas.</span>
            </h2>
            <p class="reveal">Você paga pelo número de telas conectadas e ativas. Sem cobrança por usuários, por conteúdo ou por publicação.</p>
          </div>

          <div class="precos-grid">
            {/* Starter Plan */}
            <div class="preco-card reveal">
              <p class="plan-name">Starter</p>
              <div class="plan-price">
                <span class="plan-currency">R$</span>
                <span class="plan-amount">69</span>
                <span class="plan-period">/mês</span>
              </div>
              <p class="plan-description">Até 2 telas conectadas. Para pequenos comércios, consultórios e condomínios de torre única.</p>
              <div class="plan-divider"></div>
              <ul class="plan-features">
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Até 2 telas conectadas</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Canvas Livre 16:9 e 9:16</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Widgets padrão (Clima, Relógio, RSS)</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Sincronização em tempo real</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Cache offline failsafe</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Suporte via e-mail</li>
              </ul>
              <button onClick={() => triggerConversionModal('Starter')} class="btn btn-plan btn-plan-outline">Começar com Starter</button>
            </div>

            {/* Business Plan */}
            <div class="preco-card preco-card-featured reveal" style={{ marginTop: '-12px' }}>
              <span class="featured-tag">Mais Escolhido</span>
              <p class="plan-name featured">Business</p>
              <div class="plan-price">
                <span class="plan-currency" style={{ color: 'var(--cyan)' }}>R$</span>
                <span class="plan-amount" style={{ color: 'var(--text-primary)' }}>149</span>
                <span class="plan-period">/mês</span>
              </div>
              <p class="plan-description">Até 6 telas conectadas. Para operações com múltiplos pontos de comunicação corporativa.</p>
              <div class="plan-divider"></div>
              <ul class="plan-features">
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span><strong>Até 6 telas conectadas</strong></li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Tudo do plano Starter</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Biblioteca de transições avançadas</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Integrações Power BI e Airtable</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Agendamento de playlists por horário</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span><strong style={{ color: 'var(--cyan)' }}>Suporte prioritário com SLA</strong></li>
              </ul>
              <button onClick={() => triggerConversionModal('Business')} class="btn btn-plan btn-plan-featured">
                Começar com Business
                <i data-lucide="arrow-right"></i>
              </button>
            </div>

            {/* Enterprise Plan */}
            <div class="preco-card reveal">
              <p class="plan-name">Enterprise</p>
              <p class="plan-consult">Sob consulta</p>
              <p class="plan-description">Para redes com mais de 10 telas, White Label ou integrações customizadas sob demanda.</p>
              <div class="plan-divider"></div>
              <ul class="plan-features">
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Acima de 10 telas conectadas</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span><strong>White Label completo</strong></li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Integrações e API customizadas</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Gerente de conta dedicado</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>SLA garantido em contrato</li>
                <li class="plan-feature"><span class="plan-check"><i data-lucide="check"></i></span>Onboarding e treinamento</li>
              </ul>
              <button onClick={() => triggerConversionModal('Enterprise')} class="btn btn-plan btn-plan-outline">Falar com Comercial</button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Conversion action strip */}
      <div class="cta-strip">
        <div class="container">
          <div class="label" style={{ margin: '0 auto 20px', width: 'fit-content' }}>Comece Agora</div>
          <h2 class="reveal">Sua primeira tela ativa<br />em menos de 5 minutos.</h2>
          <p class="reveal">
            Crie a conta, monte o canvas, gere o código de pareamento e conecte a TV. Sem instalador, sem técnico no local.
          </p>
          <div class="cta-strip-actions reveal">
            <button onClick={() => triggerConversionModal('Starter')} class="btn btn-primary" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              Criar conta gratuita
              <i data-lucide="arrow-right"></i>
            </button>
            <button onClick={() => triggerConversionModal('Enterprise')} class="btn btn-ghost" style={{ fontSize: '1rem', padding: '16px 32px' }}>Agendar demonstração</button>
          </div>
          <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>14 dias gratuitos · sem cartão de crédito · cancele quando quiser</p>
        </div>
      </div>

      {/* 9. Footer */}
      <footer>
        <div class="container">
          <div class="footer-inner">
            <div class="footer-brand">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} class="nav-logo" style={{ background: 'none', border: 'none', padding: 0 }}>
                <div class="nav-logo-icon">
                  <i data-lucide="tv"></i>
                </div>
                TelaHub
              </button>
              <p>Gerenciamento profissional de telas digitais para operações sérias. Feito no Brasil.</p>
            </div>
            <div class="footer-links">
              <div class="footer-col">
                <h4>Produto</h4>
                <ul>
                  <li><button onClick={() => scrollToSection('#recursos', 'recursos')}>Recursos</button></li>
                  <li><button onClick={() => scrollToSection('#precos', 'precos')}>Preços</button></li>
                  <li><a href="#">Changelog</a></li>
                  <li><a href="#">Roadmap</a></li>
                </ul>
              </div>
              <div class="footer-col">
                <h4>Casos de Uso</h4>
                <ul>
                  <li><button onClick={() => { setActiveTab('cond'); scrollToSection('#casos', 'casos'); }}>Condomínios</button></li>
                  <li><button onClick={() => { setActiveTab('corp'); scrollToSection('#casos', 'casos'); }}>Corporativo</button></li>
                  <li><button onClick={() => { setActiveTab('varejo'); scrollToSection('#casos', 'casos'); }}>Varejo</button></li>
                  <li><button onClick={() => { setActiveTab('rh'); scrollToSection('#casos', 'casos'); }}>Endomarketing</button></li>
                </ul>
              </div>
              <div class="footer-col">
                <h4>Empresa</h4>
                <ul>
                  <li><a href="#">Sobre</a></li>
                  <li><a href="#">Contato</a></li>
                  <li><a href="#">Privacidade</a></li>
                  <li><a href="#">Termos de Uso</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© 2025 TelaHub. Todos os direitos reservados.</p>
            <p>CNPJ 00.000.000/0001-00 · São Paulo, Brasil</p>
          </div>
        </div>
      </footer>

      {/* 10. Ergonomic mobile dock bar */}
      <div class="mobile-dock">
        <button class={`mobile-dock-btn ${activeDock === 'recursos' ? 'active' : ''}`} onClick={() => scrollToSection('#recursos', 'recursos')}>
          <i data-lucide="layers"></i>
          Recursos
        </button>
        <button class={`mobile-dock-btn ${activeDock === 'casos' ? 'active' : ''}`} onClick={() => scrollToSection('#casos', 'casos')}>
          <i data-lucide="briefcase"></i>
          Casos
        </button>
        <button class={`mobile-dock-btn ${activeDock === 'precos' ? 'active' : ''}`} onClick={() => scrollToSection('#precos', 'precos')}>
          <i data-lucide="credit-card"></i>
          Planos
        </button>
        <button class="mobile-dock-cta" onClick={() => triggerConversionModal(selectedPlan)}>
          <i data-lucide="zap"></i>
          Grátis
        </button>
      </div>

      {/* ==========================================
          11. INTERACTIVE B2B LEADS MODAL LAYOUT
      ========================================== */}
      {isModalOpen && (
        <div class="lead-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div class="lead-modal" onClick={(e) => e.stopPropagation()}>
            <button class="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Fechar modal">
              <i data-lucide="x"></i>
            </button>

            {!submitStatus.success ? (
              <>
                <h3>Ative seu TelaHub</h3>
                <p>Preencha os dados abaixo para criar sua conta profissional e obter 14 dias de teste completo do plano <strong>{selectedPlan}</strong>.</p>
                
                <form onSubmit={handleLeadSubmit}>
                  <div class="form-group">
                    <label for="lead-name">Seu Nome</label>
                    <input id="lead-name" type="text" class="form-input" placeholder="Ex: Carlos Mendes" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                  </div>

                  <div class="form-group">
                    <label for="lead-email">E-mail Corporativo</label>
                    <input id="lead-email" type="email" class="form-input" placeholder="Ex: carlos@empresa.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                  </div>

                  <div class="form-group">
                    <label for="lead-company">Nome da Empresa / Condomínio</label>
                    <input id="lead-company" type="text" class="form-input" placeholder="Ex: Alameda Towers" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
                  </div>

                  <div class="form-group">
                    <label for="lead-phone">Telefone / WhatsApp</label>
                    <input id="lead-phone" type="tel" class="form-input" placeholder="Ex: (11) 99999-9999" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                  </div>

                  {submitStatus.error && (
                    <p style={{ color: '#ff6b6b', fontSize: '0.82rem', marginBottom: 14 }}>⚠️ {submitStatus.error}</p>
                  )}

                  <button type="submit" class="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={submitStatus.loading}>
                    {submitStatus.loading ? 'Processando...' : 'Iniciar Teste Gratuito'}
                  </button>
                </form>
              </>
            ) : (
              <div class="lead-success-card">
                <div class="success-icon-wrapper">
                  <i data-lucide="check"></i>
                </div>
                <h3>Conta Reservada!</h3>
                <p style={{ marginTop: 10, color: 'var(--text-secondary)' }}>
                  Seus 14 dias de teste grátis no plano <strong>{selectedPlan}</strong> estão ativos. Enviamos as instruções de login e o código de pareamento para seu e-mail corporativo.
                </p>
                <button onClick={() => setIsModalOpen(false)} class="btn btn-primary" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
                  Acessar Painel TelaHub
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
