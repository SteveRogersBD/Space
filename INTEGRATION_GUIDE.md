# Meteor AI Bot - API Integration Guide

## Overview
The Meteor AI bot now integrates with Gemini AI and your backend APIs to provide rich, multimodal responses including images, news articles, and research papers.

## How It Works

### 1. Gemini Prompt Structure
The bot uses an enhanced prompt that instructs Gemini to return structured JSON:

```json
{
  "text": "Your actual response",
  "image": "image search keyword (optional)",
  "news": "news search keyword (optional)",
  "paper": "paper search keyword (optional)"
}
```

### 2. API Integration
When Gemini provides keywords, the bot automatically fetches data from:
- **Images API**: `GET /api/images?search={keyword}`
- **News API**: `GET /api/news?search={keyword}`
- **Papers API**: `GET /api/papers?search={keyword}`

### 3. Display Features

#### Images
- Grid layout with responsive columns
- Hover effects with glow
- Click to open full size in new tab

#### News Cards
- 70% image area at top
- 30% title area at bottom
- Hover animation with lift effect
- Click to open article in new tab

#### Paper Cards
- Document icon on the left
- Title and abstract/summary
- Hover animation with slide effect
- Click to open paper in new tab

### 4. Scrollability
- The thought bubble has a max height of 70vh (60vh on mobile)
- Scrollbar appears automatically when content overflows
- Custom styled scrollbar matching the theme
- Scroll is contained within the bubble only

## Backend Requirements

Make sure your Spring Boot backend (SpaceWeb) is running on `http://localhost:8080` with these endpoints:

1. **GET /api/images?search={query}**
   - Returns: Array of image URLs (strings)

2. **GET /api/news?search={query}**
   - Returns: Array of news objects with:
     - title (string)
     - description (string)
     - url (string)
     - urlToImage (string, optional)
     - publishedAt (string)
     - source (string)

3. **GET /api/papers?search={query}**
   - Returns: Array of paper objects with:
     - title (string)
     - authors (string)
     - abstract or summary (string)
     - url (string)
     - publishedDate (string)
     - journal (string)

## Testing

1. Start your backend server:
   ```bash
   cd SpaceWeb
   mvnw spring-boot:run
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Try these example queries:
   - "Tell me about meteor showers" (might trigger images)
   - "What's the latest news about asteroids?" (might trigger news)
   - "Show me research about meteorite composition" (might trigger papers)

## Customization

### Adjusting Card Layouts
Edit `aibot.css`:
- `.news-grid` - Change grid columns
- `.news-image` - Adjust image height percentage
- `.papers-grid` - Modify paper card layout

### Changing Scroll Height
Edit `aibot.css`:
- `.bubble-content` - Adjust `max-height` value

### Modifying Gemini Behavior
Edit `aibot.js` in the `getBotResponse` function:
- Adjust the prompt to change when keywords are provided
- Modify JSON structure if needed
