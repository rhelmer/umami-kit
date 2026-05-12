# umami-kit

**umami-kit** is a small browser script that layers engagement tracking (scroll depth, dwell time with idle detection, element visibility, exit summaries, and delegated clicks) on top of the official [Umami](https://umami.is/) tracking script. It only talks to Umami through `window.umami.track(eventName, data)` as described in the current [Tracker functions](https://docs.umami.is/docs/tracker-functions) documentation.

The npm package and project name are **umami-kit**. The JavaScript class is **`UmamiTracker`** (that name comes from **this library**, not from Umami; their embed exposes **`window.umami`**). `require('umami-kit')` and **`window.UmamiTracker`** are that class. **`window.UmamiKit`** is the same constructor, kept only as a short alias tied to the package name.

See [this blog post](https://www.rhelmer.org/blog/automatic-event-tracking-with-umami-kit/) for background.

## Compatibility

Use the **modern embed** from your Umami install or [Umami Cloud](https://cloud.umami.is/) (typically `script.js`). The kit waits until `window.umami.track` is a function, then starts.

| Umami (app / release) | Tracker expectations | umami-kit |
| --- | --- | --- |
| **Before v2.0.0** | Legacy tracker may not support custom events via `umami.track(name, data)` as in current docs | **Unsupported** — upgrade and use the current `script.js` |
| **v2.0.0 – latest v2.x** | [Track events](https://docs.umami.is/docs/track-events), [Tracker functions](https://docs.umami.is/docs/tracker-functions) | **Supported** |
| **v3.x** | Same `umami.track` API; optional native [`data-performance`](https://docs.umami.is/docs/performance) (Core Web Vitals, from v3.1+) is independent of this kit | **Supported** |
| **Umami Cloud** | Current production tracker | **Supported** with the embed URL from your workspace |

Patch releases within a major line should remain compatible. If your host renames the script, keep the same `data-website-id` (and optional [`data-host-url`](https://docs.umami.is/docs/tracker-configuration)) as in Umami’s docs.

## Built-in Umami vs this kit

| Area | Umami (latest docs) | This kit |
| --- | --- | --- |
| Declarative clicks | [`data-umami-event`](https://docs.umami.is/docs/track-events) + `data-umami-event-*` (string properties) | **`data-umami-track`** + optional `data-umami-data-*`; calls `umami.track()` from JavaScript |
| Custom events | `umami.track('event', { … })` | Same — the kit emits opinionated event names (`scroll-depth`, `time-on-page`, etc.) |
| Outbound links | Documented pattern with `data-umami-event` or a small attribute injector | Automatic `external-link-click` for external `<a href>` without annotating each link |
| Web Vitals | Optional `data-performance="true"` on the Umami script (v3.1+) | Not included — use Umami’s native switch if you want CWV |

You can mix native `data-umami-event` elements and this kit on the same page.

## Installation and setup

### Basic setup

Load **Umami’s script first**, then this file (both `defer` is a common pattern). See [Tracker configuration](https://docs.umami.is/docs/tracker-configuration) for `data-host-url`, `data-auto-track`, `data-do-not-track`, etc.

```html
<script
  defer
  src="https://analytics.example.com/script.js"
  data-website-id="00000000-0000-0000-0000-000000000000"
></script>
<script defer src="umami-kit.js"></script>
```

In Node or a bundled app, `const UmamiTracker = require('umami-kit')` is that class (you still need the Umami embed on the page for `window.umami`).

Auto-initialize by putting **`data-umami-auto-track`** on `html` or `body`, or construct **`new UmamiTracker(options)`** yourself (see below). When auto-init runs, the instance is **`window.umamiTracker`**.

```html
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
```

```html
<script>
  const kit = new UmamiTracker({
    debug: true,
    autoTrackAllClicks: true,
    scrollDepthThresholds: [25, 50, 75, 90],
    heartbeatInterval: 30000
  });
</script>
```

### Configuration options

```javascript
const kit = new UmamiTracker({
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

### Basic event tracking

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

### Form tracking

```javascript
// Track all forms with class 'contact-form'
kit.trackForm('.contact-form', 'contact-form-submit');

// Track specific form
kit.trackForm('#newsletter-form', 'newsletter-signup');
```

### Download tracking

```javascript
// Track common file downloads (PDF, ZIP, DOC)
kit.trackDownloads();

// Custom selector
kit.trackDownloads('a[href$=".pdf"], a[href$=".xlsx"]');
```

### Search tracking

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

### 1. Event naming and Umami limits

Umami applies limits to custom events (see [Track events](https://docs.umami.is/docs/track-events) and [Tracker functions](https://docs.umami.is/docs/tracker-functions)): for example, **event names up to 50 characters**, and structured limits on event payload size and property counts. Stay within those bounds for reliable ingestion.

Use consistent, descriptive names:
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
const kit = new UmamiTracker({ debug: true });
// Console will show: [UmamiTracker] Event tracked: scroll-depth { depth: 25, percentage: "25%" }
```

## Integration Examples

### React Integration

```jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const kit = new UmamiTracker({
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

### Vue.js integration

Use `beforeDestroy` instead of `beforeUnmount` if you are on Vue 2.

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

  beforeUnmount() {
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

**umami-kit** adds engagement-oriented events on top of Umami’s tracker while keeping the same privacy posture; you control what you mark up and which options you enable.
