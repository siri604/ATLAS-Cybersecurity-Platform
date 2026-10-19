import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Gemini API route
  app.post('/api/gemini/chat', async (req, res) => {
    const { prompt, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
      if (!apiKey) {
        throw new Error('API Key missing');
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are the ATLAS AI Security Agent, an elite mission-grade cybersecurity assistant embedded inside the ATLAS Cybersecurity Platform.
You are context-aware. Context provided:
- Module: ${context?.module || 'Platform Overview'}
- System: ${context?.systemName || 'Customer Portal App Server'}
- Selected Finding: ${context?.findingTitle || 'SSH direct root login enabled'}
- Selected Control: ${context?.controlId || 'CIS 5.2.10'}
- Current Autonomy Policy: ${context?.autonomyMode || 'Approval required'}
- User Role: ${context?.role || 'Analyst'}

Tone: Authoritative, crisp, precise, technical, cybersecurity-native. Never use conversational filler, emojis, or marketing fluff.
Directly answer questions about compliance controls, failed checks, zero-trust denials, network anomalies, threat intelligence, and remediation verification.
Always explain: 1) What failed or was detected, 2) Why it matters to system mission/security, 3) The exact technical remediation or next action in ATLAS.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      // Fallback
      res.json({
        text: `[ATLAS Offline Intelligence Mode] Analysis for ${context?.systemName || 'Active System'}:\n• Control ${context?.controlId || 'CIS 5.2.10'} failed because direct root SSH access is enabled in /etc/ssh/sshd_config.\n• Risk: Allows automated credential stuffing against root account and breaks non-repudiation audit trails.\n• Recommended Action: Submit targeted remediation playbook to set "PermitRootLogin no". Admin approval is required under "${context?.autonomyMode || 'Approval required'}" policy.`
      });
    }
  });

  // Vite middleware for dev
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);

  // Fallback for SPA
  app.get('*', async (req, res, next) => {
    try {
      const template = await vite.transformIndexHtml(req.url, '');
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://0.0.0.0:3000');
  });
}

startServer();
