# Umami Kit Usage Guide

A comprehensive utility package for enhanced Umami Analytics tracking that handles clicks, scroll depth, time on page, element visibility, and more.

## Installation & Setup

### Basic Setup

```html
<!-- Include your Umami script first -->
<script async src="https://analytics.yourdomain.com/script.js" data-website-id="your-website-id"></script>

<!-- Include the UmamiKit -->
<script defer src="umami-kit.js"></script>

<!-- Auto-initialize with basic tracking -->
<html data-umami-auto-track>

<!-- Auto-initialize with ALL click tracking enabled -->
<body 
  data-umami-auto-track
  data-umami-auto-track-all-clicks="true"
  data-umami-debug="true">

<!-- Auto-initialize with custom configuration -->
<html 
  data-umami-auto-track
  data-umami-scroll-thresholds="20,40,60,80,100"
  data-umami-heartbeat="15000"
  data-umami-debug="true">

<script>
// Or initialize manually with full control
const kit = new UmamiKit({
  debug: true,
  autoTrackAllClicks: true, // Track ALL clickable elements
  scrollDepthThresholds: [25, 50, 75, 90],
  heartbeatInterval: 30000
});
</script>
```

### Configuration Options

```javascript
const kit = new UmamiKit({
  // Scroll tracking
  scrollDepthThresholds: [25, 50, 75, 90], // Percentage thresholds
  scrollDebounceMs: 100, // Debounce scroll events
  
  // Time tracking
  heartbeatInterval: 30000, // Heartbeat interval (30 seconds)
  idleTimeout: 60000, // Consider user idle after 1 minute
  
  // Click tracking
  autoTrackClicks: true, // Enable click tracking system
  autoTrackAllClicks: false, // Track ALL clickable elements (buttons, links, etc.)
  clickSelector: '[data-umami-track]', // Specific elements to track
  
  // Visibility tracking
  visibilityThreshold: 0.5, // 50% visibility threshold
  visibilitySelector: '[data-umami-visible]',
  
  // Debug
  debug: false // Set to true for console logging
});
```

## Data Attribute Configuration

You can configure the kit directly via data attributes:

```html
<!-- Basic auto-initialization -->
<body data-umami-auto-track>

<!-- Track ALL clicks automatically -->
<body data-umami-auto-track data-umami-auto-track-all-clicks="true">

<!-- Custom configuration -->
<body 
  data-umami-auto-track
  data-umami-debug="true"
  data-umami-scroll-thresholds="20,40,60,80,100"
  data-umami-heartbeat="15000">
```

**Available Data Attributes:**
- `data-umami-auto-track-all-clicks="true"` - Track all clickable elements
- `data-umami-debug="true"` - Enable debug logging
- `data-umami-scroll-thresholds="25,50,75,90"` - Custom scroll percentages
- `data-umami-heartbeat="30000"` - Heartbeat interval in milliseconds

## Click Tracking Modes

### Mode 1: Selective Tracking (Default)
Only tracks elements with `data-umami-track` attribute:

```html
<button data-umami-track="cta-click">Subscribe</button>
<!-- This button will be tracked -->

<button>Regular Button</button>
<!-- This button will NOT be tracked -->
```

### Mode 2: All Clicks Tracking
Set `autoTrackAllClicks: true` to track ALL clickable elements:

```html
<html data-umami-auto-track data-umami-auto-track-all-clicks="true">
<!-- Now ALL buttons, links, and clickable elements are tracked automatically -->
```

**What gets tracked in "All Clicks" mode:**
- All `<button>` elements
- All `<a>` links  
- All `<input type="submit">` buttons
- All elements with `role="button"`



### 1. Scroll Depth Tracking
Automatically tracks when users scroll to 25%, 50%, 75%, and 90% of the page.

**Events Generated:**
- `scroll-depth` with data: `{ depth: 25, percentage: "25%", pixels: 1250 }`

### 2. Time on Page Tracking
Tracks active time spent on page with idle detection.

**Events Generated:**
- `time-on-page` every 30 seconds with data: `{ seconds: 90, minutes: 2 }`
- `user-idle` when user becomes inactive
- `user-active` when user returns from idle

### 3. Page Exit Tracking
Tracks comprehensive exit data when user leaves the page.

**Events Generated:**
- `page-exit` with data: `{ totalTimeSeconds: 245, maxScrollDepth: 75, scrollDepthsReached: 3 }`

## Manual Click Tracking

### HTML Data Attributes

```html
<!-- Basic click tracking -->
<button data-umami-track="cta-click">Subscribe Now</button>

<!-- Custom event name -->
<button data-umami-track="newsletter-signup">Join Newsletter</button>

<!-- With additional data -->
<button 
  data-umami-track="product-click" 
  data-umami-data-product="premium-plan"
  data-umami-data-price="29">
  Buy Premium
</button>

<!-- Track when element becomes visible -->
<div data-umami-visible="hero-section-viewed" id="hero">
  Hero Content
</div>
```

### External Link Tracking
Automatically tracks clicks on external links:

```html
<a href="https://external-site.com">External Link</a>
<!-- Generates: external-link-click with URL and link text -->
```

## Element Visibility Tracking

Track when important content becomes visible:

```html
<!-- Track when this section is viewed -->
<section data-umami-visible="pricing-section-viewed">
  <h2>Pricing Plans</h2>
  <!-- content -->
</section>

<!-- Custom visibility event -->
<div data-umami-visible="video-player-visible" data-umami-data-video="intro-video">
  <video>...</video>
</div>
```

## Programmatic API

### Basic Event Tracking

```javascript
// Simple event
kit.trackEvent('button-click');

// With custom data
kit.trackEvent('purchase-completed', {
  product: 'premium-plan',
  price: 29.99,
  currency: 'USD'
});
```

### Form Tracking

```javascript
// Track all forms with class 'contact-form'
kit.trackForm('.contact-form', 'contact-form-submit');

// Track specific form
kit.trackForm('#newsletter-form', 'newsletter-signup');
```

### Download Tracking

```javascript
// Track common file downloads (PDF, ZIP, DOC)
kit.trackDownloads();

// Custom selector
kit.trackDownloads('a[href$=".pdf"], a[href$=".xlsx"]');
```

### Search Tracking

```javascript
// Track internal search
kit.trackSearch('#search-input', 'site-search');
kit.trackSearch('.search-box', 'product-search');
```

## Advanced Usage

### Custom E-commerce Tracking

```javascript
// Product view
kit.trackEvent('product-view', {
  productId: 'PROD123',
  category: 'electronics',
  price: 199.99
});

// Add to cart
kit.trackEvent('add-to-cart', {
  productId: 'PROD123',
  quantity: 2,
  value: 399.98
});

// Purchase
kit.trackEvent('purchase', {
  orderId: 'ORDER456',
  revenue: 399.98,
  items: 2
});
```

### Content Engagement

```javascript
// Article reading progress
kit.trackEvent('article-25-percent', {
  articleId: 'blog-post-123',
  title: 'How to Use Analytics'
});

// Video interactions
kit.trackEvent('video-play', {
  videoId: 'intro-video',
  duration: 120
});

kit.trackEvent('video-complete', {
  videoId: 'intro-video',
  watchTime: 115
});
```

### User Journey Tracking

```javascript
// Funnel step completion
kit.trackEvent('signup-step-1', { step: 'email-entered' });
kit.trackEvent('signup-step-2', { step: 'password-created' });
kit.trackEvent('signup-complete', { method: 'email' });

// Feature usage
kit.trackEvent('feature-used', {
  feature: 'advanced-search',
  userType: 'premium'
});
```

## Getting Tracking Statistics

```javascript
// Get current session stats
const stats = kit.getStats();
console.log(stats);
// {
//   timeOnPage: 125,
//   scrollDepthsReached: [25, 50],
//   maxScrollDepth: 50,
//   isIdle: false,
//   elementsViewed: 3
// }
```

## Best Practices

### 1. Event Naming Convention
Use consistent, descriptive event names:
- `button-click` vs `btn_click` vs `buttonClick`
- `page-view` vs `pageview`
- `form-submit` vs `form_submission`

### 2. Data Structure
Keep event data consistent and meaningful:

```javascript
// Good
kit.trackEvent('product-click', {
  productId: 'PROD123',
  category: 'electronics',
  price: 199.99,
  position: 3
});

// Avoid
kit.trackEvent('click', {
  stuff: 'thing',
  x: 'y'
});
```

### 3. Performance Considerations
- The kit debounces scroll events automatically
- Idle detection prevents unnecessary heartbeat events
- Use `visibilityThreshold` to avoid tracking barely visible elements

### 4. Privacy Compliance
- All tracking respects Umami's privacy-first approach
- No personal data is collected automatically
- Custom data you add should also respect privacy guidelines

## Cleanup

```javascript
// When done (e.g., SPA route change)
kit.destroy();
```

## Debug Mode

Enable debug mode to see what's being tracked:

```javascript
const kit = new UmamiKit({ debug: true });
// Console will show: [UmamiKit] Event tracked: scroll-depth { depth: 25, percentage: "25%" }
```

## Integration Examples

### React Integration

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const kit = new UmamiKit({
      debug: process.env.NODE_ENV === 'development'
    });

    // Track React-specific events
    kit.trackEvent('app-loaded', { 
      version: process.env.REACT_APP_VERSION 
    });

    return () => kit.destroy();
  }, []);

  const handlePurchase = (product) => {
    kit.trackEvent('purchase', {
      productId: product.id,
      price: product.price
    });
  };

  return (
    <div>
      <button 
        onClick={() => handlePurchase(product)}
        data-umami-track="buy-button"
      >
        Buy Now
      </button>
    </div>
  );
}
```

### Vue.js Integration

```vue
<template>
  <div>
    <button @click="trackPurchase" data-umami-track="purchase-btn">
      Buy Now
    </button>
  </div>
</template>

<script>
export default {
  mounted() {
    this.kit = new UmamiKit();
  },
  
  beforeDestroy() {
    if (this.kit) {
      this.kit.destroy();
    }
  },
  
  methods: {
    trackPurchase() {
      this.kit.trackEvent('purchase-click', {
        product: this.product.name,
        price: this.product.price
      });
    }
  }
}
</script>
```

This utility package provides comprehensive tracking capabilities while maintaining Umami's privacy-first philosophy and giving you full control over what data is collected.
