import React from 'react';

const TechArchitecture = () => {
  return (
    <section id="argumento" aria-labelledby="argumento-heading">
      {/* Premium ambient glows */}
      <div className="orb orb-purple" style={{ width: '500px', height: '500px', top: '0', right: '10%', opacity: 0.1 }}></div>
      
      <div className="container">
        <div className="argumento-header">
          <div className="label reveal">Tecnologia Failsafe</div>
          <h2 id="argumento-heading" className="reveal">
            Sua comunicação sempre ativa.<br />
            <span className="text-gradient">Sem telas pretas ou dor de cabeça.</span>
          </h2>
          <p className="reveal" style={{ marginTop: '16px' }}>
            Esqueça visitas técnicas presenciais ou pen-drives desatualizados. A arquitetura do TelaHub foi desenhada para manter sua comunicação impecável, 24 horas por dia.
          </p>
        </div>

        <div className="argumento-grid">
          {/* Card 1: WebSocket Sync */}
          <div className="argumento-card reveal">
            <div className="argumento-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ width: 22, height: 22, color: 'var(--cyan)' }}
                className="animate-spin-slow"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </div>
            <h3>Atualização Instantânea em 3 Segundos</h3>
            <p style={{ marginTop: '10px' }}>
              Publique comunicados ou altere preços remotamente sem precisar recarregar o navegador do display ou limpar o cache do aparelho. Tudo é atualizado ao vivo, via nuvem, com latência zero.
            </p>
            
            <div className="proof-list" style={{ marginTop: '24px' }}>
              <div className="proof-item">
                <svg className="proof-check" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 8, marginTop: 4, flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Publique e veja as mudanças na tela em menos de 3 segundos.</span>
              </div>
              <div className="proof-item">
                <svg className="proof-check" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 8, marginTop: 4, flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Atualize preços e promoções instantaneamente sem parar a transmissão.</span>
              </div>
              <div className="proof-item">
                <svg className="proof-check" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 8, marginTop: 4, flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Controle total via painel web, de qualquer dispositivo móvel ou computador.</span>
              </div>
            </div>
          </div>

          {/* Card 2: Offline Resilience */}
          <div className="argumento-card reveal">
            <div className="argumento-icon">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ width: 22, height: 22, color: 'var(--cyan)' }}
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Imunidade contra Quedas de Internet</h3>
            <p style={{ marginTop: '10px' }}>
              O player faz o download automático e armazena todas as mídias no próprio aparelho. Se o sinal de Wi-Fi cair, sua grade continua rodando perfeitamente, sem mensagens de erro e sem telas pretas.
            </p>
            
            <div className="proof-list" style={{ marginTop: '24px' }}>
              <div className="proof-item">
                <svg className="proof-check" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 8, marginTop: 4, flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Zero telas pretas. O público nunca verá mensagens de erro de rede.</span>
              </div>
              <div className="proof-item">
                <svg className="proof-check" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 8, marginTop: 4, flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Armazenamento local seguro das mídias na memória interna do display.</span>
              </div>
              <div className="proof-item">
                <svg className="proof-check" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 8, marginTop: 4, flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Sincronização automática em lote assim que a internet for restabelecida.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechArchitecture;
