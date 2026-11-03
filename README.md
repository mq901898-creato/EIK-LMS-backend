# EIK LMS backend

Express and MongoDB API for the EIK Learning Management System.

## Local development

1. Copy `.env.example` to `.env` and set your MongoDB URI, JWT secret, and Gemini API key.
2. Install dependencies and start the API:

   ```sh
   npm install
   npm start
   ```

The API is available at `http://localhost:5000/api`. The root URL (`/`) is a health check.

## Deploy to Vercel

Import the backend GitHub repository as a separate Vercel project and set its Root Directory to the repository root. Vercel detects the root `server.js` Express application.

Configure these values in Vercel Project Settings > Environment Variables for Production, Preview, and Development:

| Name | Required | Notes |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string; allow Vercel's outbound connections in the database network settings. |
| `JWT_SECRET` | Yes | Long, unique random secret used to sign and verify tokens. |
| `GEMINI_API_KEY` | For AI quiz generation | Gemini API key. Other API endpoints do not require it. |
| `GEMINI_MODEL` | No | Defaults to `gemini-2.5-flash`. |

After deployment, verify `https://<your-backend-project>.vercel.app/` returns the backend health message. Set the frontend's `VITE_API_URL` to that deployment URL followed by `/api`, then redeploy the frontend.

Never commit `.env`; keep production values in Vercel's environment settings.
