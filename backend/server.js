const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for React frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

const LEADS_FILE = path.join(__dirname, 'leads.json');

// Get active displays data for live mockup integration
app.get('/api/displays', (req, res) => {
  const displays = [
    { id: 1, name: 'Hall Principal', status: 'online', screen: 'screen-a', type: '9:16' },
    { id: 2, name: 'Elevador A', status: 'online', screen: 'screen-b', type: '9:16' },
    { id: 3, name: 'Recepção', status: 'online', screen: 'screen-c', type: '16:9' },
    { id: 4, name: 'Sala de Reunião', status: 'offline', screen: 'screen-d', type: '16:9' },
    { id: 5, name: 'Cafeteria', status: 'offline', screen: 'screen-e', type: '16:9' },
    { id: 6, name: 'Loja Térreo', status: 'online', screen: 'screen-a', type: '16:9' }
  ];
  
  res.json({
    total: displays.length,
    onlineCount: displays.filter(d => d.status === 'online').length,
    uptime: '99.7%',
    scenesActive: 4,
    displays: displays
  });
});

// Register new leads from the landing page CTAs
app.post('/api/leads', (req, res) => {
  const { name, email, company, phone, plan } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }

  const newLead = {
    id: Date.now().toString(),
    name,
    email,
    company: company || 'Não Informada',
    phone: phone || 'Não Informado',
    plan: plan || 'Starter',
    date: new Date().toISOString()
  };

  try {
    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      const fileData = fs.readFileSync(LEADS_FILE, 'utf8');
      leads = JSON.parse(fileData || '[]');
    }

    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
    
    console.log(`[Lead Registrado] ${name} (${email}) - Plano: ${plan}`);
    res.status(201).json({ success: true, message: 'Lead cadastrado com sucesso!', lead: newLead });
  } catch (error) {
    console.error('Erro ao salvar lead:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao processar o cadastro.' });
  }
});

// Status check route
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor TelaHub rodando perfeitamente!' });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 SERVIDOR TELAHUB ONLINE NA PORTA ${PORT}`);
  console.log(`=========================================`);
});
