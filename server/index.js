const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
// express.json() is moved down so we can parse raw bodies for Stripe webhooks

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-builder';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPro: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    jobTitle: String,
  },
  summary: String,
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String,
    bullets: [String]
  }],
  education: [{
    school: String,
    degree: String,
    year: String
  }],
  skills: [String],
  templateId: { type: String, default: 'modern' },
  updatedAt: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', ResumeSchema);

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

const path = require('path');

// Stripe webhook must come before express.json() because it requires raw body
// Stripe webhook must come before express.json() because it requires raw body
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const stripe = require('stripe')(stripeKey);

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    if (userId) {
       await User.findByIdAndUpdate(userId, { isPro: true });
    }
  }

  res.status(200).end();
});

// Now we can use express.json() for all other routes
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../build')));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, isPro: user.isPro }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, isPro: user.isPro } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email, isPro: user.isPro }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isPro: user.isPro } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stripe/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
       return res.status(500).json({ error: 'Stripe is not configured on the server.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'CareerForge-Pro Upgrade',
              description: 'Unlock premium templates and unlimited AI features.',
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?canceled=true`,
      client_reference_id: req.user.id, // Used in webhook
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const resume = new Resume({ ...req.body, userId: req.user.id });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/resumes', authenticateToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/resumes/:id', authenticateToken, async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
        if (!resume) return res.status(404).json({ error: 'Resume not found' });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/resumes/public/:id', async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ error: 'Resume not found' });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ error: 'Invalid resume link' });
    }
});

app.put('/api/resumes/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/ai/generate-summary', async (req, res) => {
  const { jobTitle, skills, experience, keywords } = req.body;
  
  const getMockSummary = () => {
    const keywordStr = keywords && keywords.length > 0 ? ` with strong expertise in ${keywords.slice(0,3).join(', ')}` : '';
    const summaries = [
        `Dynamic ${jobTitle || 'Professional'}${keywordStr}. Expertise in driving operational efficiency and leading cross-functional teams to exceed business objectives.`,
        `Highly skilled ${jobTitle || 'Expert'} specialized in ${skills ? skills.slice(0,3).join(', ') : 'modern industry standards'}. Proven ability to leverage ${keywords ? keywords[0] : 'technical'} proficiency to solve complex challenges.`,
        `Result-oriented ${jobTitle || 'Leader'} with a focus on ${keywords ? keywords.slice(0,2).join(' and ') : 'innovation'}. Passionate about continuous improvement and delivering scalable solutions.`
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        return res.json({ summary: getMockSummary(), simulated: true });
    }

    const prompt = `Write a professional 2-3 sentence resume summary for a ${jobTitle}. 
    Core skills: ${skills ? skills.join(', ') : 'not specified'}. 
    Target Keywords from Job Description: ${keywords ? keywords.join(', ') : 'none'}.
    Experience: ${experience ? JSON.stringify(experience) : 'not specified'}. 
    Tone: Authoritative, result-oriented, and specifically matching the target keywords.`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });
    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (err) {
    console.error('AI Generation Error (falling back to mock):', err.message);
    res.json({ 
        summary: getMockSummary(), 
        simulated: true,
        error: err.message 
    });
  }
});

app.post('/api/ai/optimize-bullets', async (req, res) => {
  const { bullets, keywords } = req.body;
  
  const getMockBullets = () => {
    const keywordStr = keywords && keywords.length > 0 ? ` [Key: ${keywords[0]}]` : '';
    const verbs = ['Spearheaded', 'Optimized', 'Architected', 'Pioneered'];
    const results = ['resulting in a 30% increase in revenue', 'reducing operational costs by 20%', 'improving system latency by 15ms', 'saving 50+ manual hours per week'];
    return bullets.map((b, i) => `${verbs[i % verbs.length]} ${b.toLowerCase()}${keywordStr} ${results[i % results.length]}.`);
  };

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        return res.json({ optimizedBullets: getMockBullets(), simulated: true });
    }

    const prompt = `Optimize the following resume bullet points to be more impactful and result-oriented. 
    Target Keywords: ${keywords ? keywords.join(', ') : 'none'}.
    Use action verbs and quantify achievements where possible. Ensure keywords are integrated naturally. 
    Bullets: ${bullets.join('\n')}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });
    const optimizedContent = completion.choices[0].message.content.trim();
    const optimizedBullets = optimizedContent.split('\n').map(b => b.replace(/^[•-]\s*/, '').trim());
    res.json({ optimizedBullets });
  } catch (err) {
    console.error('AI Optimization Error (falling back to mock):', err.message);
    res.json({ 
        optimizedBullets: getMockBullets(), 
        simulated: true,
        error: err.message 
    });
  }
});

// JD Analysis Agent
app.post('/api/ai/analyze-jd', async (req, res) => {
  const { jd } = req.body;
  if (!jd) return res.status(400).json({ error: 'Job description is required' });

  const getMockKeywords = () => ['Python', 'Cloud Architecture', 'Agile', 'Team Leadership', 'Project Management', 'SDLC', 'Communication', 'AWS', 'Docker', 'Kubernetes'];

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        return res.json({ keywords: getMockKeywords(), simulated: true });
    }

    const prompt = `Analyze the following job description and extract a list of 10-15 critical keywords, skills, and ranking factors (e.g., "Python," "Agile," "Leadership"). Return ONLY the keywords as a comma-separated list. JD: ${jd}`;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });
    
    const result = completion.choices[0].message.content.trim();
    const keywords = result.split(',').map(k => k.trim());
    res.json({ keywords });
  } catch (err) {
    res.json({ keywords: getMockKeywords(), simulated: true, error: err.message });
  }
});

app.post('/api/ai/generate-cover-letter', async (req, res) => {
  const { jobTitle, company, resumeData } = req.body;
  
  const getMockCoverLetter = () => {
    return `Dear Hiring Manager at ${company || 'your company'},\n\nI am writing to express my strong interest in the ${jobTitle || 'open position'} role. With my background in ${resumeData?.skills?.[0] || 'the industry'} and my experience at ${resumeData?.experience?.[0]?.company || 'previous companies'}, I am confident in my ability to make an immediate impact on your team.\n\nMy career is defined by a commitment to excellence and a track record of delivering results. I am particularly drawn to your company's innovative approach and would welcome the opportunity to contribute to your ongoing success.\n\nThank you for considering my application. I look forward to the possibility of discussing this exciting opportunity with you.\n\nSincerely,\n${resumeData?.personalInfo?.fullName || 'Applicant'}`;
  };

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
        return res.json({ coverLetter: getMockCoverLetter(), simulated: true });
    }

    const prompt = `Write a professional cover letter for the position of "${jobTitle}" at "${company}". Base the content on the following resume data: ${JSON.stringify(resumeData)}. Ensure the tone is enthusiastic and professional, and highlight the most relevant skills and experience. Keep it under 300 words.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });
    
    const coverLetter = completion.choices[0].message.content.trim();
    res.json({ coverLetter });
  } catch (err) {
    console.error('AI Cover Letter Error (falling back to mock):', err.message);
    res.json({ 
        coverLetter: getMockCoverLetter(), 
        simulated: true,
        error: err.message 
    });
  }
});

const puppeteer = require('puppeteer');

app.post('/api/pdf/generate', async (req, res) => {
  const { htmlContent } = req.body;
  if (!htmlContent) return res.status(400).json({ error: 'HTML content is required' });

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    
    // Set viewport to A4 size to ensure correct rendering
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF on the server.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});