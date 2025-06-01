# Clerk Integration Step-by-Step Instructions for React & Express

Below are detailed instructions to implement Clerk into a React frontend and an Express backend securely. Follow each step in order and generate the necessary code/configuration.

---

## 1. Prerequisites

1. **Create a Clerk application**  
   - Sign up at [Clerk.dev](https://clerk.dev/) and create a new project.  
   - Note the **Frontend API key** (used in the browser) and the **Secret Key** (used on the server).

2. **React application scaffold**  
   - Confirm you have a React project (e.g., via `create-react-app` or Next.js).  
   - Ensure Node.js ≥14 and npm/yarn are installed.

3. **Express server scaffold**  
   - Confirm you have an Express project (`npm init -y`, `npm install express`).  
   - Configure environment management (e.g., using `dotenv`).

---

## 2. Frontend (React) Integration

1. **Install the Clerk React package**  
   - Instruction: `npm install @clerk/clerk-react` (or `yarn add @clerk/clerk-react`).

2. **Wrap the root component in `<ClerkProvider>`**  
   - In `index.js` (or `main.jsx`):
     ```jsx
     import React from 'react';
     import ReactDOM from 'react-dom';
     import { ClerkProvider } from '@clerk/clerk-react';
     import App from './App';

     // Fetch the Clerk Frontend API key from environment
     const clerkFrontendApi = process.env.REACT_APP_CLERK_FRONTEND_API;

     ReactDOM.render(
       <ClerkProvider
         frontendApi={clerkFrontendApi}
         navigate={(to) => window.history.pushState(null, '', to)}
       >
         <App />
       </ClerkProvider>,
       document.getElementById('root')
     );
     ```
   - Ensure `REACT_APP_CLERK_FRONTEND_API` is set in `.env`.

3. **Protect React routes with a `<ProtectedRoute>` component**  
   - Create `ProtectedRoute.jsx`:
     ```jsx
     import React from 'react';
     import { Navigate, Outlet } from 'react-router-dom';
     import { useUser, useSession } from '@clerk/clerk-react';

     export default function ProtectedRoute() {
       const { isLoaded, isSignedIn } = useUser();
       // Wait for Clerk to finish loading
       if (!isLoaded) return <div>Loading...</div>;
       // Redirect unauthenticated users
       if (!isSignedIn) return <Navigate to="/sign-in" replace />;
       return <Outlet />;
     }
     ```

   - In `App.jsx` (React Router v6 example):
     ```jsx
     import { BrowserRouter, Routes, Route } from 'react-router-dom';
     import { SignIn, SignUp } from '@clerk/clerk-react';
     import ProtectedRoute from './ProtectedRoute';
     import Dashboard from './pages/Dashboard';
     import PublicPage from './pages/PublicPage';

     function App() {
       return (
         <BrowserRouter>
           <Routes>
             <Route path="/" element={<PublicPage />} />
             <Route path="/sign-in/*" element={<SignIn />} />
             <Route path="/sign-up/*" element={<SignUp />} />

             <Route element={<ProtectedRoute />}>
               <Route path="/app/dashboard" element={<Dashboard />} />
               <!-- Add other protected routes here -->
             </Route>
           </Routes>
         </BrowserRouter>
       );
     }
     export default App;
     ```

4. **Use Clerk hooks/components in React**  
   - Example: Display user info and sign-out button:
     ```jsx
     import { useUser, useClerk } from '@clerk/clerk-react';

     export default function ProfileButton() {
       const { user, isSignedIn } = useUser();
       const { signOut } = useClerk();
       if (!isSignedIn) return null;
       return (
         <div>
           <span>Welcome, {user.firstName}!</span>
           <button onClick={() => signOut()}>Sign Out</button>
         </div>
       );
     }
     ```

5. **Set environment variables in React**  
   - Create `.env` at the project root:
     ```
     REACT_APP_CLERK_FRONTEND_API=your_clerk_frontend_api_key
     ```
   - Add `.env` to `.gitignore`.
   - Provide `.env.example` with placeholder:
     ```
     REACT_APP_CLERK_FRONTEND_API=<your_frontend_api_key>
     ```

---

## 3. Backend (Express) Integration

1. **Install Clerk Node and Express SDKs**  
   - Instruction: `npm install @clerk/clerk-sdk-node @clerk/clerk-express` (or `yarn add ...`).

2. **Configure environment variables on the server**  
   - Create `.env` in the server folder:
     ```
     CLERK_SECRET_KEY=your_clerk_secret_key
     CLERK_API_URL=https://api.clerk.dev
     ```
   - Ensure `.env` is in `.gitignore`.

3. **Initialize Clerk middleware in Express**  
   - In `server.js` (or `app.js`), at the top:
     ```js
     require('dotenv').config();
     const express = require('express');
     const { ClerkExpressWithAuth } = require('@clerk/clerk-express');
     const app = express();

     // Enable CORS if frontend and backend run separately
     const cors = require('cors');
     app.use(
       cors({
         origin: 'http://localhost:3000',
         credentials: true,
       })
     );

     // Parse JSON
     app.use(express.json());

     // Clerk middleware adds req.auth
     app.use(
       ClerkExpressWithAuth({
         secretKey: process.env.CLERK_SECRET_KEY,
         apiUrl: process.env.CLERK_API_URL,
       })
     );

     const PORT = process.env.PORT || 4000;
     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
     });
     ```

4. **Protect Express routes**  
   - Import and use `requireAuth()`:
     ```js
     const { requireAuth } = require('@clerk/clerk-express');

     // Public route
     app.get('/api/public', (req, res) => {
       res.json({ message: 'This endpoint is public.' });
     });

     // Protected route
     app.get('/api/me', requireAuth(), (req, res) => {
       const { userId, sessionId } = req.auth;
       res.json({ userId, sessionId });
     });
     ```

5. **Fetch Clerk token in React and send to Express**  
   - In React component:
     ```jsx
     import React, { useEffect, useState } from 'react';
     import { useAuth } from '@clerk/clerk-react';

     export default function Dashboard() {
       const { getToken } = useAuth();
       const [profile, setProfile] = useState(null);

       useEffect(() => {
         async function loadProfile() {
           const token = await getToken();
           const response = await fetch('http://localhost:4000/api/me', {
             headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
             },
           });
           const data = await response.json();
           setProfile(data);
         }
         loadProfile();
       }, [getToken]);

       if (!profile) return <div>Loading…</div>;
       return (
         <div>
           <h2>User Profile</h2>
           <pre>{JSON.stringify(profile, null, 2)}</pre>
         </div>
       );
     }
     ```

---

## 4. Security Best Practices

1. **Never expose the Secret Key in frontend code**  
   - Only `REACT_APP_CLERK_FRONTEND_API` belongs in React; all other Clerk secrets must stay server-side.

2. **Use HTTPS in production**  
   - Ensure Express is served over HTTPS so cookies marked `Secure` can be transmitted.

3. **Configure cookies correctly**  
   - Clerk’s default HTTP-only, secure cookies are recommended.  
   - If setting cookies manually, include:
     ```js
     res.cookie('session', token, {
       httpOnly: true,
       secure: true,
       sameSite: 'Lax',
     });
     ```

4. **Set up CORS if domains differ**  
   - In Express:
     ```js
     app.use(
       cors({
         origin: 'https://your-frontend-domain.com',
         credentials: true,
       })
     );
     ```
   - In React’s fetch:
     ```js
     fetch('https://your-backend.com/api/me', {
       credentials: 'include',
       headers: { 'Content-Type': 'application/json' },
     });
     ```

5. **Verify tokens server-side**  
   - Rely on `requireAuth()` middleware or use `verifyToken()` from `@clerk/clerk-sdk-node` to decode and validate JWTs.

6. **Implement role-based access controls**  
   - If your app defines roles, add middleware:
     ```js
     const requireAdmin = () => {
       return (req, res, next) => {
         const { sessionClaims } = req.auth;
         if (sessionClaims.role !== 'admin') {
           return res.status(403).json({ error: 'Access denied' });
         }
         next();
       };
     };

     app.post('/api/admin-only', requireAuth(), requireAdmin(), (req, res) => {
       res.json({ message: 'Admin action successful' });
     });
     ```

7. **Rotate and revoke credentials**  
   - Use Clerk’s API to revoke sessions if needed:
     ```js
     import { Clerk } from '@clerk/clerk-sdk-node';
     await Clerk.users.revokeAllSessions(userId);
     ```

---

## 5. Example Folder Structure

```
/project-root
├─ /client                     # React application
│   ├─ .env                     # REACT_APP_CLERK_FRONTEND_API
│   ├─ src/
│   │   ├─ index.js
│   │   ├─ App.jsx
│   │   ├─ ProtectedRoute.jsx
│   │   └─ … other components
│   └─ package.json
│
├─ /server                     # Express application
│   ├─ .env                     # CLERK_SECRET_KEY, CLERK_API_URL
│   ├─ server.js                # Express + Clerk middleware
│   ├─ /routes
│   │   └─ user.js              # Protected endpoints
│   └─ package.json
│
└─ README.md
```

---

## 6. Summary of Tasks for the LLM

1. **Install dependencies**  
   - `@clerk/clerk-react` in React.  
   - `@clerk/clerk-sdk-node` and `@clerk/clerk-express` in Express.

2. **Configure environment variables**  
   - Create `.env` files with `REACT_APP_CLERK_FRONTEND_API` in client and `CLERK_SECRET_KEY`, `CLERK_API_URL` in server.  
   - Add `.env` to `.gitignore`.

3. **Wrap React app with `<ClerkProvider>`**  
   - Use `process.env.REACT_APP_CLERK_FRONTEND_API`.

4. **Implement `<ProtectedRoute>`**  
   - Check `isSignedIn`, redirect to `/sign-in` if false.

5. **Set up Express middleware**  
   - Use `ClerkExpressWithAuth` to populate `req.auth`.

6. **Protect Express endpoints**  
   - Use `requireAuth()` for routes that need authentication.

7. **Fetch and send JWT from React to Express**  
   - Use `getToken()`, include in `Authorization: Bearer <token>` header.

8. **Ensure security best practices**  
   - HTTPS in production, correct CORS settings, cookie flags, token verification, role checks, and credential rotation.

---

**End of Markdown Instructions**
