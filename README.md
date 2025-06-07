# Umami Tracker Usage Guide

A comprehensive utility package for enhanced Umami Analytics tracking that handles clicks, scroll depth, time on page, element visibility, and more.

## Installation & Setup

### Basic Setup

```html
<!-- Include your Umami script first -->
<script async src="https://analytics.yourdomain.com/script.js" data-website-id="your-website-id"></script>

<!-- Include the UmamiTracker -->
<script src="umami-tracker.js"></script>

<!-- Auto-initialize (optional) -->
<div data-umami-auto-track></div>

<script>
// Or initialize manually
const tracker = new UmamiTracker({
  debug: true, // Enable console logging
  scrollDepthThresholds: [25, 50, 75, 90], // Custom scroll thresholds
  heartbeatInterval: 30000 // Send time updates every 30 seconds
});
</script>
```

### Configuration Options

```javascript
const tracker = new UmamiTracker({
  // Scroll tracking
  scrollDepthThresholds: [25, 50, 75, 90], // Percentage thresholds
  scrollDebounceMs: 100, // Debounce scroll events
  
  // Time tracking
  heartbeatInterval: 30000, // Heartbeat interval (30 seconds)
  idleTimeout: 60000, // Consider user idle after 1 minute
  
  // Click tracking
  autoTrackClicks: true, // Enable automatic click tracking
  clickSelector: '[data-umami-track]', // Elements to track
  
  // Visibility tracking
  visibilityThreshold: 0.5, // 50% visibility threshold
  visibilitySelector: '[data-umami-visible]',
  
  // Debug
  debug: false // Set to true for console logging
});
```

## Automatic Tracking Features

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
tracker.trackEvent('button-click');

// With custom data
tracker.trackEvent('purchase-completed', {
  product: 'premium-plan',
  price: 29.99,
  currency: 'USD'
});
```

### Form Tracking

```javascript
// Track all forms with class 'contact-form'
tracker.trackForm('.contact-form', 'contact-form-submit');

// Track specific form
tracker.trackForm('#newsletter-form', 'newsletter-signup');
```

### Download Tracking

```javascript
// Track common file downloads (PDF, ZIP, DOC)
tracker.trackDownloads();

// Custom selector
tracker.trackDownloads('a[href$=".pdf"], a[href$=".xlsx"]');
```

### Search Tracking

```javascript
// Track internal search
tracker.trackSearch('#search-input', 'site-search');
tracker.trackSearch('.search-box', 'product-search');
```

## Advanced Usage

### Custom E-commerce Tracking

```javascript
// Product view
tracker.trackEvent('product-view', {
  productId: 'PROD123',
  category: 'electronics',
  price: 199.99
});

// Add to cart
tracker.trackEvent('add-to-cart', {
  productId: 'PROD123',
  quantity: 2,
  value: 399.98
});

// Purchase
tracker.trackEvent('purchase', {
  orderId: 'ORDER456',
  revenue: 399.98,
  items: 2
});
```

### Content Engagement

```javascript
// Article reading progress
tracker.trackEvent('article-25-percent', {
  articleId: 'blog-post-123',
  title: 'How to Use Analytics'
});

// Video interactions
tracker.trackEvent('video-play', {
  videoId: 'intro-video',
  duration: 120
});

tracker.trackEvent('video-complete', {
  videoId: 'intro-video',
  watchTime: 115
});
```

### User Journey Tracking

```javascript
// Funnel step completion
tracker.trackEvent('signup-step-1', { step: 'email-entered' });
tracker.trackEvent('signup-step-2', { step: 'password-created' });
tracker.trackEvent('signup-complete', { method: 'email' });

// Feature usage
tracker.trackEvent('feature-used', {
  feature: 'advanced-search',
  userType: 'premium'
});
```

## Getting Tracking Statistics

```javascript
// Get current session stats
const stats = tracker.getStats();
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
tracker.trackEvent('product-click', {
  productId: 'PROD123',
  category: 'electronics',
  price: 199.99,
  position: 3
});

// Avoid
tracker.trackEvent('click', {
  stuff: 'thing',
  x: 'y'
});
```

### 3. Performance Considerations
- The tracker debounces scroll events automatically
- Idle detection prevents unnecessary heartbeat events
- Use `visibilityThreshold` to avoid tracking barely visible elements

### 4. Privacy Compliance
- All tracking respects Umami's privacy-first approach
- No personal data is collected automatically
- Custom data you add should also respect privacy guidelines

## Cleanup

```javascript
// When done (e.g., SPA route change)
tracker.destroy();
```

## Debug Mode

Enable debug mode to see what's being tracked:

```javascript
const tracker = new UmamiTracker({ debug: true });
// Console will show: [UmamiTracker] Event tracked: scroll-depth { depth: 25, percentage: "25%" }
```

## Integration Examples

### React Integration

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const tracker = new UmamiTracker({
      debug: process.env.NODE_ENV === 'development'
    });

    // Track React-specific events
    tracker.trackEvent('app-loaded', { 
      version: process.env.REACT_APP_VERSION 
    });

    return () => tracker.destroy();
  }, []);

  const handlePurchase = (product) => {
    tracker.trackEvent('purchase', {
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
    this.tracker = new UmamiTracker();
  },
  
  beforeDestroy() {
    if (this.tracker) {
      this.tracker.destroy();
    }
  },
  
  methods: {
    trackPurchase() {
      this.tracker.trackEvent('purchase-click', {
        product: this.product.name,
        price: this.product.price
      });
    }
  }
}
</script>
```

This utility package provides comprehensive tracking capabilities while maintaining Umami's privacy-first philosophy and giving you full control over what data is collected.