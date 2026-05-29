import React from 'react';

const Footer = ({ scrollToSection, activeTab, setActiveTab, activeDock, triggerConversionModal }) => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="nav-logo" 
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <div className="nav-logo-icon">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    style={{ width: 16, height: 16, color: '#060813' }}
                  >
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17 2 12 7 7 2" />
                  </svg>
                </div>
                TelaHub
              </button>
              <p>Gerenciamento profissional de telas digitais para operações sérias. Feito no Brasil.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-col">
                <h4>Produto</h4>
                <ul>
                  <li><button onClick={() => scrollToSection('#recursos', 'recursos')}>Recursos</button></li>
                  <li><button onClick={() => scrollToSection('#precos', 'precos')}>Preços</button></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Changelog</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Roadmap</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Casos de Uso</h4>
                <ul>
                  <li><button onClick={() => { setActiveTab('cond'); scrollToSection('#casos', 'casos'); }}>Condomínios</button></li>
                  <li><button onClick={() => { setActiveTab('corp'); scrollToSection('#casos', 'casos'); }}>Corporativo</button></li>
                  <li><button onClick={() => { setActiveTab('varejo'); scrollToSection('#casos', 'casos'); }}>Varejo</button></li>
                  <li><button onClick={() => { setActiveTab('rh'); scrollToSection('#casos', 'casos'); }}>Endomarketing</button></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Empresa</h4>
                <ul>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Sobre</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Contato</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Privacidade</a></li>
                  <li><a href="#" onClick={(e) => e.preventDefault()}>Termos de Uso</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2026 TelaHub. Todos os direitos reservados.</p>
            <p>CNPJ 00.000.000/0001-00 · São Paulo, Brasil</p>
          </div>
        </div>
      </footer>

      {/* 10. Ergonomic mobile dock bar */}
      <div className="mobile-dock">
        <button 
          className={`mobile-dock-btn ${activeDock === 'recursos' ? 'active' : ''}`} 
          onClick={() => scrollToSection('#recursos', 'recursos')}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ width: 18, height: 18 }}
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          Recursos
        </button>
        
        <button 
          className={`mobile-dock-btn ${activeDock === 'casos' ? 'active' : ''}`} 
          onClick={() => scrollToSection('#casos', 'casos')}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ width: 18, height: 18 }}
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Casos
        </button>
        
        <button 
          className={`mobile-dock-btn ${activeDock === 'precos' ? 'active' : ''}`} 
          onClick={() => scrollToSection('#precos', 'precos')}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ width: 18, height: 18 }}
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Planos
        </button>
        
        <button 
          className="mobile-dock-cta" 
          onClick={() => triggerConversionModal('Business')}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ width: 13, height: 13 }}
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Grátis
        </button>
      </div>
    </>
  );
};

export default Footer;
