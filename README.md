# Ulkaa - Live Meteor & NEO Tracker

A React + Three.js web application featuring an **interactive real-time 3D globe** for tracking meteors, fireballs, and near-Earth objects (NEOs) with live data from NASA, AMS, and GMN.

## ✨ Features

- 🌍 **Interactive 3D Globe**: Real-time WebGL globe with Earth, Moon, starfield, and orbit controls
- 🌠 **Live Meteor Tracking**: Particle-based meteor visualization with atmospheric entry effects
- 🔴 **Real-Time Data**: Fetch live NEO/fireball data from NASA, AMS, and GMN APIs
- �️ **Location Search**: Geocoding-powered search with smooth camera transitions
- 🎛️ **Layer Controls**: Toggle meteors, NEOs, and GMN camera layers independently
- ⚙️ **Quality Settings**: LOD (Level of Detail) with low/medium/high particle density
- ♿ **Accessibility**: ARIA labels, keyboard shortcuts (H, G, R, ?), and responsive design
- 🔐 **Auth0 Integration**: Secure authentication for protected routes
- 📦 **Caching & Offline**: localStorage-based cache with TTL for offline fallback
- 🚀 **Deployment Ready**: Vercel config, Cypress E2E tests, and monitoring placeholders

## 🛠️ Tech Stack

- **Frontend**: React 19, Three.js, Vite
- **Authentication**: Auth0
- **APIs**: NASA NEO Feed, AMS Fireballs, GMN Observations, OpenCage Geocoding
- **Testing**: Jest (unit), Cypress (E2E)
- **Deployment**: Vercel
- **Monitoring**: Sentry/LogRocket placeholders

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- Auth0 account (optional for local dev)
- API keys for NASA, OpenCage (optional; app runs with stubbed data)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SteveRogersBD/Space.git
   cd Space
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   # Auth0 (optional for local dev without auth)
   VITE_AUTH0_DOMAIN=your-domain.us.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=https://api.krishnaiot.org

   # API Keys for live data
   VITE_NASA_API_KEY=DEMO_KEY
   VITE_OPENCAGE_KEY=your-opencage-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3001/live-tracking` in your browser to see the globe!

## 🔑 API Keys Setup

### NASA NEO Feed API
1. Visit [NASA API Portal](https://api.nasa.gov/)
2. Sign up and get your API key
3. Add `VITE_NASA_API_KEY=your_key` to `.env.local`

### OpenCage Geocoding API
1. Visit [OpenCage](https://opencagedata.com/)
2. Sign up for a free account (2500 requests/day)
3. Add `VITE_OPENCAGE_KEY=your_key` to `.env.local`

### Auth0 (for authentication)
See [AUTH0_SETUP.md](./AUTH0_SETUP.md) for detailed setup instructions.

## 📂 Project Structure

```
Space/
├── src/
│   ├── components/
│   │   ├── ThreeScene.jsx       # Main 3D globe scene
│   │   ├── Hero.jsx             # Hero section with CTA
│   │   ├── ControlPanel.jsx     # Floating control panel
│   │   ├── SearchBox.jsx        # Geocoding search input
│   │   ├── LayerToggles.jsx     # Layer visibility toggles
│   │   ├── Settings.jsx         # Dark mode & quality settings
│   │   ├── InfoCard.jsx         # Recent events info card
│   │   └── AuthButtons.jsx      # Login/Logout buttons
│   ├── controllers/
│   │   ├── GlobeController.js   # OrbitControls & camera focus
│   │   ├── ParticleSystem.js    # Meteor particle rendering
│   │   ├── LayerManager.js      # Layer state management
│   │   ├── APIService.js        # NASA/AMS/GMN/Geocoding API
│   │   ├── CacheManager.js      # localStorage caching
│   │   └── SearchController.js  # Geocoding wrapper
│   ├── store/
│   │   └── StateManager.js      # Lightweight global state
│   ├── utils/
│   │   ├── performance.js       # throttle/debounce helpers
│   │   ├── keyboard.js          # Keyboard shortcuts manager
│   │   └── monitoring.js        # Sentry/LogRocket placeholder
│   ├── pages/
│   │   ├── LiveTracking.jsx     # Live tracking page
│   │   └── ...                  # Other pages
│   ├── tests/
│   │   ├── APIService.test.js   # Unit tests
│   │   └── setup.js             # Jest setup
│   ├── App.jsx                  # Main app with routing
│   └── index.jsx                # App entry point
├── cypress/
│   └── e2e/
│       └── live-tracking.cy.js  # E2E smoke tests
├── .env.local                   # Environment variables (gitignored)
├── vercel.json                  # Vercel deployment config
├── jest.config.json             # Jest unit test config
├── cypress.config.js            # Cypress E2E config
└── package.json                 # Dependencies
```

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `H` | Scroll to Hero section |
| `G` | Scroll to Globe |
| `R` | Reset globe view to default |
| `?` | Show keyboard shortcuts help |

## 🎨 UI Components

### Hero Section
- Eye-catching title with gradient CTA button
- Smooth scroll to globe section

### Control Panel (Floating)
- **Search**: Enter city/country to focus camera
- **Layer Toggles**: Show/hide Meteors, NEOs, GMN Cameras
- **Settings**: Dark mode, ambient mode, particle quality (low/medium/high)

### Info Card
- Displays recent meteor events (bottom-left)
- Shows event type, time, magnitude, location

## 🧪 Testing

### Run Unit Tests (Jest)
```bash
npm test
```

### Run E2E Tests (Cypress)
```bash
# Start dev server first
npm run dev

# In another terminal
npx cypress open
```

## 📦 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel Dashboard:
   - `VITE_NASA_API_KEY`
   - `VITE_OPENCAGE_KEY`
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`
   - `VITE_AUTH0_AUDIENCE`

4. Commit and push to trigger automatic deployments

### Monitoring & Analytics
- Add Sentry DSN: `VITE_SENTRY_DSN` for error monitoring
- See `src/utils/monitoring.js` for integration placeholder

## 🎯 Available Scripts

- `npm run dev` - Start development server (default port 3001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run Jest unit tests
- `npx cypress open` - Open Cypress E2E test runner

## 🔐 Authentication Features

### Login Methods
- ✅ Email/Password
- ✅ Passwordless Email (Magic Link)
- ✅ Social Login (Google, GitHub, etc.)
- ✅ Multi-Factor Authentication (MFA)
- ✅ Adaptive MFA (risk-based)

### Security Features
- ✅ Attack Protection (brute-force, breached password, IP blocking)
- ✅ CAPTCHA protection
- ✅ Token management with refresh tokens
- ✅ Secure logout
- ✅ Role-Based Access Control (RBAC)

## 🛣️ Protected Routes

The following routes require authentication:
- `/dashboard` - User dashboard
- `/mission` - Mission control

Public routes:
- `/` - Home
- `/live-tracking` - Live meteor & NEO tracker (main feature)
- `/fun-zone` - Fun zone
- `/impact-simulator` - Impact simulator
- `/info` - Information
- `/insights` - Insights
- `/astro-strike` - Astro Strike game
- `/projects` - Projects

## 🌐 API Endpoints Used

### NASA NEO Feed API
- **Endpoint**: `https://api.nasa.gov/neo/rest/v1/feed`
- **Rate Limit**: 1000 requests/hour (with API key)
- **Response**: Near-Earth Objects data (asteroids, comets)

### AMS Fireball API
- **Endpoint**: `https://fireballs.amsmeteors.org/json/`
- **Rate Limit**: Public (best effort)
- **Response**: Fireball event reports

### GMN (Global Meteor Network)
- **Endpoint**: `https://globalmeteornetwork.org/observations.json`
- **Rate Limit**: Public (best effort)
- **Response**: Camera observation data

### OpenCage Geocoding API
- **Endpoint**: `https://api.opencagedata.com/geocode/v1/json`
- **Rate Limit**: 2500 requests/day (free tier)
- **Response**: Latitude/longitude from place names

## 🎨 Design Features

- **Glassmorphism UI**: Floating panels with blur and transparency
- **Neon Highlights**: Cyan (#00d4ff) accents throughout
- **Responsive Layout**: Mobile, tablet, desktop optimized
- **Dark Theme**: Space-optimized dark background
- **Smooth Animations**: Camera transitions, particle fading, ring pulses

## 🐛 Troubleshooting

### WebGL Not Supported
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Update your graphics drivers
- Enable hardware acceleration in browser settings

### API Rate Limits
- Use `DEMO_KEY` for NASA API (lower limits)
- Sign up for free API keys to increase limits
- App caches responses locally to reduce API calls

### Auth0 Errors
- Verify `.env.local` has correct Auth0 credentials
- Check callback URLs in Auth0 Dashboard match `window.location.origin`
- Clear browser cache and localStorage

### Dev Server Won't Start
- Kill processes on port 3000/3001: `npx kill-port 3001`
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- NASA Open APIs for NEO data
- American Meteor Society for fireball reports
- Global Meteor Network for camera observations
- OpenCage for geocoding services
- Three.js community for WebGL excellence

---

**Built with ❤️ for space enthusiasts and meteor watchers worldwide** 🌠

- `/` - Home page
- `/live-tracking` - Live tracking (public)
- `/fun-zone` - Fun zone (public)
- `/impact-simulator` - Impact simulator (public)
- `/info` - Information (public)
- `/insights` - Insights (public)
- `/astro-strike` - Astro Strike (public)

## Deployment

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. Update Auth0 URLs:
   - Add production URL to Auth0 Dashboard
   - Update callback URLs, logout URLs, and web origins

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

4. Update Auth0 URLs as described above

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AUTH0_DOMAIN` | Your Auth0 domain | Yes |
| `VITE_AUTH0_CLIENT_ID` | Your Auth0 client ID | Yes |
| `VITE_AUTH0_AUDIENCE` | Your Auth0 API audience | Yes |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Note: WebGL support is required for the 3D scene.

## Troubleshooting

### Common Issues

1. **"Missing Auth0 configuration" error**
   - Ensure `.env.local` exists and contains all required variables
   - Restart the development server after changing environment variables

2. **"Invalid callback URL" error**
   - Check Auth0 Dashboard → Applications → Your App → Settings
   - Ensure callback URL matches exactly: `http://localhost:3000`

3. **3D scene not rendering**
   - Check browser console for WebGL errors
   - Ensure your browser supports WebGL
   - Try a different browser

4. **Authentication not working**
   - Verify Auth0 credentials in `.env.local`
   - Check Auth0 Dashboard for application settings
   - Review browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check [AUTH0_SETUP.md](./AUTH0_SETUP.md) for Auth0 setup help
- Review Auth0 documentation: https://auth0.com/docs
- Open an issue on GitHub

