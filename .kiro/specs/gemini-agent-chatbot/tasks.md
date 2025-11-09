# Implementation Plan

- [x] 1. Set up environment configuration and API key management





  - Update .env file to use Vite-compatible environment variable naming (VITE_ prefix)
  - Create vite.config.js if not exists to properly load environment variables
  - Add environment variable validation on application startup
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 2. Create API service module for external integrations





  - [x] 2.1 Implement Gemini API integration


    - Create api-service.js module with Gemini API call function
    - Implement request formatting with system prompt and user message
    - Configure JSON response mode in generationConfig
    - Add response parsing to extract text and optional keywords
    - _Requirements: 1.1, 1.2, 1.5_
  
  - [x] 2.2 Implement SerpAPI image search integration

    - Add fetchImages function to call SerpAPI Google Images endpoint
    - Parse image results to extract URLs, thumbnails, and titles
    - Implement result limiting (max 3 images)
    - _Requirements: 2.1, 2.2, 2.5_
  
  - [x] 2.3 Implement SerpAPI video search integration

    - Add fetchVideos function to call SerpAPI YouTube endpoint
    - Parse video results to extract URLs, titles, and thumbnails
    - Implement result limiting (max 2 videos)
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [x] 2.4 Implement SerpAPI scholar search integration

    - Add fetchScholarPapers function to call SerpAPI Google Scholar endpoint
    - Parse paper results to extract title, authors, link, and snippet
    - Implement result limiting (max 2 papers)
    - _Requirements: 4.1, 4.2, 4.4_
  
  - [x] 2.5 Implement SerpAPI web search integration

    - Add fetchSearchResults function to call SerpAPI Google Search endpoint
    - Parse search results to extract title, link, and snippet
    - Implement result limiting (max 3 results)
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [x] 2.6 Add comprehensive error handling to API service

    - Implement try-catch blocks for all API calls
    - Add retry logic for Gemini API (1 retry with 1s delay)
    - Set timeouts (10s for Gemini, 5s for SerpAPI)
    - Return graceful fallbacks for failed requests
    - _Requirements: 1.4, 2.4, 3.5, 4.5, 5.5_

- [x] 3. Update chat controller with AI-powered response logic





  - [x] 3.1 Refactor sendMessage function for async API calls


    - Replace getBotResponse with callGeminiAPI from api-service
    - Add loading state management (show/hide)
    - Implement error handling with user-friendly messages
    - _Requirements: 1.1, 7.1, 7.3_
  

  - [x] 3.2 Create response processing function

    - Implement processGeminiResponse to parse API response
    - Extract text content for thought bubble display
    - Identify and extract optional keywords (Image, Video, paper, Search)
    - Orchestrate parallel SerpAPI calls using Promise.all()
    - _Requirements: 1.2, 1.3_
  


  - [x] 3.3 Implement multi-modal content display function

    - Create displayMultiModalContent function
    - Handle rendering of images, videos, papers, and search results
    - Clear previous multi-modal content before displaying new content
    - Implement content sanitization for security
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  


  - [x] 3.4 Add loading state UI controls

    - Implement showLoadingState function with animated indicator
    - Implement hideLoadingState function
    - Disable input field during processing
    - Add timeout handling (10s) with timeout message
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 4. Create UI components for multi-modal content display




  - [x] 4.1 Add HTML structure for multi-modal container


    - Add multi-modal-container div to aibot.html
    - Create separate sections for images, videos, papers, and search results
    - Add loading indicator HTML with animated dots
    - Position container appropriately in the layout
    - _Requirements: 8.1_
  
  - [x] 4.2 Style multi-modal content sections


    - Create CSS for image gallery (horizontal scroll, rounded corners)
    - Style video cards with thumbnails and play icons
    - Format paper citations with distinct typography
    - Style search result cards with title, snippet, and domain
    - Ensure space theme consistency with existing design
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [x] 4.3 Implement responsive design for multi-modal content


    - Add mobile breakpoints for stacked vertical layout
    - Adjust image gallery to single column on small screens
    - Ensure touch targets are minimum 44x44px
    - Test on multiple viewport sizes (320px, 768px, 1024px, 1920px)
    - _Requirements: 8.5_
  
  - [x] 4.4 Style loading indicator


    - Create animated dots or pulsing effect
    - Use cosmic colors matching space theme
    - Position within thought bubble
    - Add smooth fade-in/fade-out transitions
    - _Requirements: 7.2_

- [x] 5. Enhance system prompt for optimal Gemini responses










  - Create comprehensive system prompt defining Meteor's personality
  - Include instructions for JSON output format
  - Add guidelines for when to include multi-modal keywords
  - Specify keyword formatting rules (2-5 words, specific, descriptive)
  - Test prompt with various query types to ensure consistent JSON responses
  - _Requirements: 1.1, 1.2, 1.5_

- [x] 6. Implement security and performance optimizations





  - [x] 6.1 Add content sanitization


    - Sanitize all text content before rendering to prevent XSS
    - Validate URLs from SerpAPI before creating links
    - Add rel="noopener noreferrer" to all external links
    - _Requirements: 6.3_
  
  - [x] 6.2 Implement client-side rate limiting


    - Track request timestamps in memory
    - Limit to max 10 requests per minute
    - Display friendly message when limit reached
    - _Requirements: 6.4_
  

  - [x] 6.3 Add input debouncing

    - Prevent rapid-fire message sending with 500ms debounce
    - Disable send button during debounce period
    - _Requirements: 7.1_

- [x] 7. Testing and validation




  - [x] 7.1 Test Gemini API integration
    - Test with simple meteor questions
    - Test with complex multi-part queries
    - Verify JSON response parsing
    - Test error handling with invalid API key
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 7.2 Test SerpAPI integrations

    - Test image search with various keywords
    - Test video search and verify YouTube links
    - Test scholar search and verify citation formatting
    - Test web search and verify result links
    - Test error handling for each endpoint
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 4.1, 4.2, 5.1, 5.2_
  
  - [x] 7.3 Test UI and user experience






    - Verify loading states appear and disappear correctly
    - Test multi-modal content rendering for all types
    - Test responsive design on multiple screen sizes
    - Verify no API keys visible in browser console
    - Test rapid message sending and debouncing
    - _Requirements: 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 7.4 Test error scenarios
    - Test with no internet connection
    - Test with invalid API keys
    - Test timeout scenarios
    - Test malformed JSON responses from Gemini
    - Verify graceful degradation for failed SerpAPI calls
    - _Requirements: 1.4, 2.4, 3.5, 4.5, 5.5, 7.5_
