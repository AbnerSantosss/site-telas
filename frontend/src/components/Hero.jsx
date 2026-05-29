import React from 'react';
import DashboardMockup from './DashboardMockup';

const Hero = ({ 
  triggerConversionModal, 
  scrollToSection, 
  telemetry, 
  lastSyncTime 
}) => {
  return (
    <section id="hero" aria-labelledby="hero-heading">
      {/* Premium ambient glows */}
      <div className="orb orb-cyan" style={{ width: '600px', height: '600px', top: '-250px', left: '-250px', opacity: 0.15 }}></div>
      <div className="orb orb-blue" style={{ width: '500px', height: '500px', top: '50px', right: '-150px', opacity: 0.12 }}></div>

      <div className="container">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="label animate-in">Digital Signage de Alta Performance</div>
            <h1 id="hero-heading" className="hero-headline animate-in">
              Transforme qualquer TV em um<br />
              <span className="text-gradient">canal de vendas.</span><br />
              Sem hardware proprietário.
            </h1>
            <p className="hero-subheadline animate-in">
              Controle e atualize cardápios, avisos e relatórios em tempo real, diretamente pelo seu navegador. Use as TVs que você já tem, economize com instaladores e mantenha tudo rodando mesmo se a internet cair.
            </p>
            <div className="hero-actions animate-in">
              <button onClick={() => triggerConversionModal('Starter')} className="btn btn-primary">
                Criar Canal Grátis
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ width: 16, height: 16 }}
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
              <button onClick={() => scrollToSection('#recursos', 'recursos')} className="btn btn-ghost">
                Ver recursos da plataforma
              </button>
            </div>
            <div className="hero-trust animate-in">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ color: 'var(--cyan)', width: 14, height: 14 }}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Pareamento em 2 min · Sem cartão de crédito · 14 dias de teste completo
            </div>
          </div>

          <div className="hero-visual animate-in">
            <DashboardMockup telemetry={telemetry} lastSyncTime={lastSyncTime} triggerConversionModal={triggerConversionModal} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
