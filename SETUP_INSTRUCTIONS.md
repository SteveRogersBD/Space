# Quick Setup Instructions

## 1. Install Dependencies

```bash
npm install
```

## 2. Create Environment File

Create a file named `.env.local` in the root directory with the following content:

```env
VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.krishnaiot.org
```

**Important**: Replace the placeholder values with your actual Auth0 credentials.

## 3. Configure Auth0

1. Sign up for Auth0 at https://auth0.com
2. Create a new Single Page Application
3. Configure the following in Auth0 Dashboard:
   - **Allowed Callback URLs**: `http://localhost:3000`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
4. Enable authentication methods:
   - Passwordless Email
   - Google
   - GitHub
5. Enable MFA and Adaptive MFA
6. Enable Attack Protection
7. Copy your Domain and Client ID to `.env.local`

For detailed instructions, see [AUTH0_SETUP.md](./AUTH0_SETUP.md).

## 4. Run the Application

```bash
npm run dev
```

The app will start on `http://localhost:3000`.

## 5. Test Authentication

1. Click the "Log In" button
2. Try different login methods:
   - Email/Password
   - Social login (Google, GitHub)
   - Passwordless email (magic link)
3. Test protected routes:
   - `/dashboard` - Requires authentication
   - `/mission` - Requires authentication

## Troubleshooting

### Environment Variables Not Working

- Make sure the file is named `.env.local` (not `.env`)
- Restart the development server after creating/editing `.env.local`
- Check that variable names start with `VITE_`

### Auth0 Errors

- Verify your Auth0 credentials are correct
- Check that callback URLs match exactly in Auth0 Dashboard
- Ensure your application type is "Single Page Application"

### Port Already in Use

If port 3000 is already in use, you can change it in `vite.config.js`:

```js
server: {
  port: 3001, // Change to any available port
}
```

Then update your Auth0 callback URLs accordingly.

