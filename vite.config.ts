import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/ai/tactics' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { game, topic, rank, playstyle } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured in environment.' }));
              }
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
              });

              const prompt = `You are GameIn Pro AI Coach & Esports Analyst.
Analyze the following player situation and provide high-level, practical pro esports advice:
Game: ${game || 'Esports'}
Scenario/Query: ${topic || 'Winning tournament brackets'}
Player Rank: ${rank || 'Competitive'}
Playstyle: ${playstyle || 'Aggressive Entry / Flex'}

Structure your response with:
1. Tactical Breakdown & Map Positioning
2. Meta Loadout / Agent / Weapon picks
3. Counter-Play vs Top Tournament Opponents
4. Pro Comms Callout phrases to give your squad
Keep it punchy, tactical, and styled for competitive players.`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ advice: response.text }));
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Unknown error';
              console.error('Gemini API server error:', message);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }

        if (req.url === '/api/ai/scout' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const { tournamentName, game, teams } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }));
              }
              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
              });

              const prompt = `You are GameIn Pro Esports Scout and Tournament Caster.
Provide a thrilling matchup preview and odds prediction for:
Tournament: ${tournamentName || 'Championship'}
Game: ${game || 'Valorant'}
Key Contenders / Teams: ${teams || 'Alpha Squad vs Phoenix Legion'}

Give:
- Win Probability breakdown
- Key Player X-Factor
- 3 bold caster predictions
Format cleanly with bullet points and esports hype.`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: prompt,
              });

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ scoutReport: response.text }));
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : 'Unknown error';
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
