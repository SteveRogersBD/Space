# Design Document

## Overview

This design transforms the Meteor chatbot from a simple pattern-matching system into an AI-powered agent using Google's Gemini API for intelligent responses and SerpAPI for multi-modal content retrieval. The architecture maintains the existing Three.js visual experience while replacing the hardcoded response logic with dynamic AI-generated content enriched with images, videos, scholarly papers, and web search results.

## Architecture

### High-Level Architecture

```
User Input → Frontend (aibot.js) → API Layer → Gemini API
                                              ↓
                                         Parse Response
                                              ↓
                                    Extract Keywords
                                              ↓
                                    ┌─────────┴─────────┐
                                    ↓                   ↓
                              SerpAPI Calls      Display Text
                         (Images/Videos/Papers)        ↓
                                    ↓            Thought Bubble
                                    └─────────→  + Multi-modal
                                                   Content
```

### Component Structure

The system consists of three main layers:

1. **Presentation Layer** (aibot.js, aibot.html, aibot.css)
   - Handles user interactions and UI updates
   - Manages the Three.js starfield animation
   - Displays responses in thought bubble and multi-modal content areas

2. **API Integration Layer** (new: api-service.js)
   - Manages Gemini API communication
   - Handles SerpAPI requests for multi-modal content
   - Implements error handling and retry logic

3. **Configuration Layer** (.env)
   - Stores API credentials securely
   - Provides environment-specific settings

## Components and Interfaces

### 1. API Service Module (api-service.js)

**Purpose:** Centralized module for all external API communications

**Key Functions:**

```javascript
// Gemini API Integration
async function callGeminiAPI(userMessage, conversationHistory = [])
  Input: userMessage (string), conversationHistory (array)
  Output: Promise<{text, Image?, Video?, paper?, Search?}>
  
// SerpAPI Integration
async function fetchImages(keyword, limit = 3)
  Input: keyword (string), limit (number)
  Output: Promise<Array<{url, title, thumbnail}>>

async function fetchVideos(keyword, limit = 2)
  Input: keyword (string), limit (number)
  Output: Promise<Array<{url, title, thumbnail, platform}>>

async function fetchScholarPapers(keyword, limit = 2)
  Input: keyword (string), limit (number)
  Output: Promise<Array<{title, authors, link, snippet}>>

async function fetchSearchResults(keyword, limit = 3)
  Input: keyword (string), limit (number)
  Output: Promise<Array<{title, link, snippet}>>
```

**API Key Management:**
- API keys will be accessed via environment variables
- Since this is a client-side application, we'll use Vite's environment variable system (`import.meta.env`)
- Keys will be prefixed with `VITE_` to be accessible in the browser

### 2. Enhanced Chat Controller (aibot.js modifications)

**New Functions:**

```javascript
async function sendMessage()
  - Validates user input
  - Shows loading state
  - Calls Gemini API via api-service
  - Processes response and triggers multi-modal content fetching
  - Updates UI with complete response

async function processGeminiResponse(response)
  - Extracts text content
  - Identifies keywords for multi-modal content
  - Orchestrates parallel SerpAPI calls
  - Returns combined response object

function displayMultiModalContent(content)
  - Renders images in a gallery format
  - Displays video links with thumbnails
  - Formats scholarly papers as citations
  - Shows search results as clickable cards

function showLoadingState()
  - Displays animated loading indicator in thought bubble
  - Disables input during processing

function hideLoadingState()
  - Removes loading indicator
  - Re-enables input
```

### 3. UI Components (aibot.html modifications)

**New HTML Structure:**

```html
<!-- Multi-modal content container -->
<div class="multi-modal-container" id="multiModalContainer">
  <div class="images-section" id="imagesSection"></div>
  <div class="videos-section" id="videosSection"></div>
  <div class="papers-section" id="papersSection"></div>
  <div class="search-section" id="searchSection"></div>
</div>

<!-- Loading indicator -->
<div class="loading-indicator" id="loadingIndicator">
  <div class="loading-dots">
    <span></span><span></span><span></span>
  </div>
</div>
```

## Data Models

### Gemini API Request Format

```javascript
{
  contents: [
    {
      role: "user",
      parts: [{ text: "System prompt + User message" }]
    }
  ],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
    responseMimeType: "application/json"
  }
}
```

### Gemini API Response Format

```javascript
{
  text: "AI-generated response text",
  Image: "meteor shower night sky",      // Optional
  Video: "perseid meteor shower 2024",   // Optional
  paper: "meteorite composition analysis", // Optional
  Search: "meteor impact craters"        // Optional
}
```

### SerpAPI Response Models

**Images:**
```javascript
{
  images_results: [
    {
      original: "https://...",
      thumbnail: "https://...",
      title: "Image title"
    }
  ]
}
```

**Videos:**
```javascript
{
  video_results: [
    {
      link: "https://youtube.com/...",
      title: "Video title",
      thumbnail: "https://..."
    }
  ]
}
```

**Scholar:**
```javascript
{
  organic_results: [
    {
      title: "Paper title",
      link: "https://...",
      publication_info: { authors: [...] },
      snippet: "Abstract excerpt"
    }
  ]
}
```

**Search:**
```javascript
{
  organic_results: [
    {
      title: "Result title",
      link: "https://...",
      snippet: "Description"
    }
  ]
}
```

## Error Handling

### Error Scenarios and Responses

1. **Gemini API Failure**
   - Retry once after 1 second delay
   - If retry fails, display: "I'm having trouble connecting right now. Please try again in a moment."
   - Log error to console for debugging

2. **SerpAPI Failure**
   - Continue with text response only
   - Log which content type failed
   - Don't block the main response

3. **Invalid API Keys**
   - Check for key existence on initialization
   - Display clear error message: "Configuration error. Please check API keys."
   - Prevent message sending until resolved

4. **Network Timeout**
   - Set 10-second timeout for Gemini API
   - Set 5-second timeout for each SerpAPI call
   - Display timeout message and allow retry

5. **Malformed JSON from Gemini**
   - Attempt to extract text content using regex
   - Fall back to displaying raw response if extraction fails
   - Skip multi-modal content if keywords can't be parsed

### Error Handling Flow

```
API Call → Try/Catch → Error?
                         ↓ Yes
                    Log Error
                         ↓
                  Retry Logic?
                    ↓         ↓
                  Yes        No
                    ↓         ↓
              Retry Once   Fallback
                    ↓         ↓
              Success?   Display Error
                ↓    ↓        ↓
              Yes   No       Continue
                ↓    ↓
            Continue Fallback
```

## Testing Strategy

### Unit Testing Focus

1. **API Service Functions**
   - Test Gemini API request formatting
   - Test response parsing with various JSON structures
   - Test error handling for network failures
   - Mock API responses for consistent testing

2. **Response Processing**
   - Test keyword extraction from Gemini responses
   - Test handling of optional fields (Image, Video, etc.)
   - Test multi-modal content aggregation

3. **UI Update Functions**
   - Test loading state transitions
   - Test multi-modal content rendering
   - Test error message display

### Integration Testing

1. **End-to-End Flow**
   - Test complete user message → AI response → multi-modal content flow
   - Test with various query types (simple questions, complex topics)
   - Test error recovery scenarios

2. **API Integration**
   - Test actual Gemini API calls with test prompts
   - Test SerpAPI calls for each content type
   - Verify response format compatibility

### Manual Testing Checklist

- [ ] Send simple meteor question and verify AI response
- [ ] Trigger image search and verify images display
- [ ] Trigger video search and verify video links work
- [ ] Trigger paper search and verify citations format correctly
- [ ] Trigger web search and verify results are clickable
- [ ] Test with no internet connection
- [ ] Test with invalid API keys
- [ ] Test rapid message sending
- [ ] Test very long user messages
- [ ] Test on mobile viewport
- [ ] Verify no API keys visible in browser console
- [ ] Verify loading states appear and disappear correctly

## Implementation Notes

### Gemini API Configuration

The system prompt will be enhanced to guide Gemini's behavior:

```
You are Meteor, an enthusiastic and knowledgeable AI assistant specializing in meteors, meteoroids, asteroids, comets, and space phenomena. Your mission is to educate users with accurate, engaging information.

When responding:
- Provide clear, concise explanations suitable for general audiences
- Use analogies and comparisons to make concepts relatable
- Show enthusiasm for the subject matter
- Determine when visual or reference materials would enhance understanding

You have access to supplementary content tools:
- Image search: Use when visual examples would clarify concepts
- Video search: Use when demonstrations or footage would be valuable
- Scholar search: Use when citing research or detailed scientific information
- Web search: Use for current events, recent discoveries, or general reference

Output Format (JSON):
{
  "text": "Your detailed response here",
  "Image": "specific search keyword" (optional),
  "Video": "specific search keyword" (optional),
  "paper": "specific search keyword" (optional),
  "Search": "specific search keyword" (optional)
}

Guidelines for keywords:
- Be specific and descriptive
- Use 2-5 words per keyword
- Focus on visual or informational value
- Only include when truly beneficial to the response
```

### SerpAPI Endpoint Selection

- **Images:** `https://serpapi.com/search?engine=google_images`
- **Videos:** `https://serpapi.com/search?engine=youtube`
- **Scholar:** `https://serpapi.com/search?engine=google_scholar`
- **Search:** `https://serpapi.com/search?engine=google`

### Performance Considerations

1. **Parallel API Calls:** Execute all SerpAPI calls concurrently using `Promise.all()`
2. **Response Caching:** Consider caching common queries to reduce API usage
3. **Lazy Loading:** Load images progressively as they become visible
4. **Debouncing:** Prevent rapid-fire message sending with 500ms debounce

### Security Considerations

1. **API Key Protection:**
   - Use Vite environment variables (`VITE_GEMINI_API_KEY`, `VITE_SERP_API_KEY`)
   - Document that this is a development setup
   - Recommend backend proxy for production deployment

2. **Content Sanitization:**
   - Sanitize all text content before rendering to prevent XSS
   - Validate URLs from SerpAPI before creating links
   - Use `rel="noopener noreferrer"` on external links

3. **Rate Limiting:**
   - Implement client-side rate limiting (max 10 requests per minute)
   - Display friendly message when limit reached
   - Track request timestamps in memory

## Styling Guidelines

### Multi-Modal Content Styling

- **Images:** Display in a horizontal scrollable gallery with rounded corners and subtle shadows
- **Videos:** Show as cards with thumbnail, title, and play icon overlay
- **Papers:** Format as citation blocks with distinct typography
- **Search Results:** Display as compact cards with title, snippet, and domain

### Loading Indicator

- Use animated dots or pulsing effect
- Match the space theme with cosmic colors
- Position within the thought bubble
- Subtle animation to avoid distraction

### Responsive Design

- Stack multi-modal content vertically on mobile
- Reduce image gallery to single column on small screens
- Ensure touch targets are at least 44x44px
- Test on viewport widths: 320px, 768px, 1024px, 1920px
