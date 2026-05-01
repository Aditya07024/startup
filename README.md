# ViralBoost AI MVP

Full-stack SaaS MVP for AI-powered social media content generation with a 2-day premium trial, JWT auth, MongoDB persistence, Gemini or OpenAI content generation, and Razorpay subscriptions.

## Structure

- `client`: Next.js frontend
- `server`: Express backend

## AI provider

- Default provider: Gemini
- Optional provider: OpenAI
- Set `AI_PROVIDER=gemini` or `AI_PROVIDER=openai` in `server/.env`
- Gemini uses the REST API with `GEMINI_API_KEY`
- Default Gemini model in this repo: `gemini-2.5-flash`

For Hugging Face routed inference, use `AI_PROVIDER=huggingface` with a routed chat model such as `deepseek-ai/DeepSeek-R1:fastest`.

## Core behavior

- New users receive a 2-day premium trial automatically.
- Trial expiry is checked on every authenticated request by middleware.
- Premium AI routes are server-protected.
- Paid plans activate premium access and clear the trial end date.

## Setup

1. Install dependencies:
   `npm install`
2. Copy env files:
   - `server/.env.example` to `server/.env`
   - `client/.env.example` to `client/.env.local`
3. Start backend:
   `npm run dev:server`
4. Start frontend:
   `npm run dev:client`

## Important implementation notes

- Add middleware to check trial expiry on every request.
- Add UI banner showing trial countdown.
