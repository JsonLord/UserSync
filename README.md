<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1uBpK_suSmvNgTEgSyU7qMenb62ZRrQwX

## Run Locally

**Prerequisites:**  Node.js


### Frontend Setup

1. Install dependencies:
   `npm install` (or `yarn install`)
2. Run the development server:
   `npm run dev` (or `yarn dev`)
3. Build for production:
   `npm run build` (or `yarn build`)

### Deployment

This is a frontend-only application designed for easy deployment on platforms like **Render**, **Vercel**, or **Netlify**.

- **Build Command:** `npm run build` (or `yarn build`)
- **Publish Directory:** `dist`

On **Render**, ensure you are deploying as a **Static Site**.

### API Integration

The frontend is integrated with the Tiny Factory backend via the `gradioService.ts`. It connects to the `AUXteam/tiny_factory` Space on Hugging Face using the `@gradio/client`.
