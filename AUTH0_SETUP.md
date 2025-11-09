# Auth0 Integration Setup Guide

This guide will walk you through setting up Auth0 authentication for the Antarikhs Space Landing Page.

## Prerequisites

- An Auth0 account (sign up at https://auth0.com)
- Node.js and npm installed
- This project set up and running

## Step 1: Create Auth0 Application

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Name your application (e.g., "Antarikhs Space App")
5. Select **Single Page Web Applications** as the application type
6. Click **Create**

## Step 2: Configure Application Settings

In your Auth0 application settings, configure the following:

### URLs
- **Allowed Callback URLs**: `http://localhost:3000`
- **Allowed Logout URLs**: `http://localhost:3000`
- **Allowed Web Origins**: `http://localhost:3000`

For production, add your production URLs:
- `https://your-domain.com`
- `https://your-domain.com/login`
- etc.

### Advanced Settings
- Go to **Advanced Settings** → **Grant Types**
- Ensure the following are enabled:
  - ✅ Authorization Code
  - ✅ Refresh Token
  - ✅ Implicit (if needed)

## Step 3: Enable Authentication Methods

### Passwordless Email (Magic Link)
1. Navigate to **Authentication** → **Passwordless**
2. Enable **Email** passwordless connection
3. Configure email templates if needed

### Social Connections
1. Navigate to **Authentication** → **Social**
2. Enable desired connections:
   - **Google**: Configure with Google OAuth credentials
   - **GitHub**: Configure with GitHub OAuth credentials
   - **Facebook**, **Twitter**, etc. as needed

### Database Connection
1. Navigate to **Authentication** → **Database**
2. Ensure **Username-Password-Authentication** is enabled

## Step 4: Enable Multi-Factor Authentication (MFA)

1. Navigate to **Security** → **Multi-factor Auth**
2. Enable **Multi-factor Authentication**
3. Select authentication methods:
   - ✅ Google Authenticator
   - ✅ SMS (optional)
   - ✅ Push notifications (optional)
4. Enable **Adaptive MFA** for risk-based authentication
5. Configure MFA policies:
   - Always require MFA
   - Require MFA for specific conditions (e.g., new devices, suspicious activity)

## Step 5: Enable Attack Protection

1. Navigate to **Security** → **Attack Protection**
2. Enable the following:
   - ✅ **Brute Force Protection**: Protect against brute force attacks
   - ✅ **Breached Password Detection**: Check passwords against known breaches
   - ✅ **Suspicious IP Throttling**: Block suspicious IP addresses
   - ✅ **Bot Detection**: Detect and block bots

### Configure Breached Password Detection
- Set up integration with Have I Been Pwned API
- Configure password strength requirements

## Step 6: Create API (for Audience)

1. Navigate to **Applications** → **APIs**
2. Click **Create API**
3. Fill in:
   - **Name**: "Antarikhs API" (or your preferred name)
   - **Identifier**: `https://api.krishnaiot.org` (must match your .env.local)
   - **Signing Algorithm**: RS256
4. Click **Create**

## Step 7: Configure Roles and Permissions (RBAC)

1. Navigate to **User Management** → **Roles**
2. Create roles as needed:
   - `admin`: Full access
   - `user`: Standard user access
   - `viewer`: Read-only access
3. Navigate to **User Management** → **Permissions**
4. Create permissions as needed:
   - `read:dashboard`
   - `write:dashboard`
   - `admin:all`
5. Assign permissions to roles

## Step 8: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Auth0 credentials:
   ```env
   VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=https://api.krishnaiot.org
   ```

   You can find these values in your Auth0 Dashboard:
   - **Domain**: Found in your application's settings
   - **Client ID**: Found in your application's settings
   - **Audience**: The API identifier you created in Step 6

## Step 9: Customize Login UI (Optional)

### Universal Login
1. Navigate to **Branding** → **Universal Login**
2. Customize the login page:
   - Add your logo
   - Customize colors to match Mizzou branding
   - Add custom CSS
   - Customize text and messaging

### Login Box Customization
The login UI in this app is already styled with a space theme. You can further customize it in:
- `src/index.css` - Auth0 login styles
- `src/components/AuthButtons.jsx` - Login button component

## Step 10: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click **Log In**
4. Test different authentication methods:
   - Email/password
   - Social login (Google, GitHub)
   - Passwordless email (magic link)
   - MFA (if enabled)

## Step 11: Configure Production

Before deploying to production:

1. Update Auth0 Application Settings:
   - Add production URLs to Callback, Logout, and Web Origins
   - Update CORS settings if needed

2. Update Environment Variables:
   - Set production Auth0 domain and client ID
   - Update audience if different for production

3. Deploy to your hosting platform:
   - **Netlify**: Add environment variables in site settings
   - **Vercel**: Add environment variables in project settings
   - **Other platforms**: Follow platform-specific instructions

## Step 12: Monitor and Logs (Optional)

### Auth0 Logs
1. Navigate to **Monitoring** → **Logs**
2. View authentication logs
3. Set up alerts for suspicious activity

### Integration with CloudWatch/Datadog
1. Navigate to **Monitoring** → **Streams**
2. Create a new stream
3. Configure to stream logs to:
   - AWS CloudWatch
   - Datadog
   - Other monitoring services

## Security Best Practices

1. **Always use HTTPS in production**
2. **Enable Attack Protection** (already configured in Step 5)
3. **Regularly review Auth0 logs** for suspicious activity
4. **Keep Auth0 SDK updated**:
   ```bash
   npm update @auth0/auth0-react
   ```
5. **Use environment variables** - Never commit `.env.local` to version control
6. **Implement rate limiting** on your API endpoints
7. **Use secure token storage** - The app uses `localStorage` by default (configured in `src/index.jsx`)

## Troubleshooting

### Common Issues

1. **"Invalid callback URL"**
   - Check that your callback URL is added in Auth0 Dashboard
   - Ensure the URL matches exactly (including http/https, port, trailing slash)

2. **"Invalid client"**
   - Verify your Client ID in `.env.local`
   - Check that the application type is "Single Page Application"

3. **"Access denied"**
   - Check API audience configuration
   - Verify API permissions and roles

4. **MFA not working**
   - Ensure MFA is enabled in Auth0 Dashboard
   - Check that the user has a verified email/phone number

## Additional Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 Universal Login](https://auth0.com/docs/authenticate/login/auth0-universal-login)
- [Auth0 Attack Protection](https://auth0.com/docs/secure/attack-protection)
- [Auth0 Multi-Factor Authentication](https://auth0.com/docs/secure/multi-factor-authentication)

## Support

For issues or questions:
1. Check Auth0 Documentation
2. Review Auth0 Community Forums
3. Contact Auth0 Support (if you have a support plan)

