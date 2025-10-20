---
description: Repository Information Overview
alwaysApply: true
---

# JENSAR Distillery Information

## Summary
JENSAR Distillery is a web-based inventory management system for distilleries. It's a Progressive Web App (PWA) with offline capabilities, built using vanilla JavaScript, HTML, and CSS. The application manages sales, purchases, production, and supplier information with a focus on offline-first functionality.

## Structure
- **HTML Pages**: Main entry points for different modules (index.html, sales.html, purchase.html, production.html, suppliers.html, reports.html)
- **JavaScript**: Core application logic in app.js and service worker in sw.js
- **CSS**: Styling in styles.css with responsive design
- **Documentation**: Several markdown files detailing the architecture and implementation

## Language & Runtime
**Language**: JavaScript (ES6+), HTML5, CSS3
**Build System**: None (vanilla JS)
**Package Manager**: None (no external dependencies)

## Dependencies
**Main Dependencies**:
- Chart.js (loaded from CDN when needed)

**Browser APIs**:
- localStorage (for data persistence)
- Service Worker API (for offline capabilities)
- Web Vitals API (for performance monitoring)

## Build & Installation
No build process required. The application can be served directly from any static web server.

```bash
# Example using a simple HTTP server
python -m http.server
# or
npx serve
```

## PWA Configuration
**Manifest**: manifest.json defines app metadata, icons, and display properties
**Service Worker**: sw.js provides offline caching with a network-first, cache-fallback strategy
**Cache Strategy**: Caches core assets (HTML, CSS, JS) and dynamically caches API responses

## Main Files
- **index.html**: Dashboard and main entry point
- **app.js**: Core application logic with module initialization
- **sw.js**: Service worker for offline capabilities
- **styles.css**: Complete styling for the application
- **manifest.json**: PWA configuration

## Data Management
**Storage**: Browser's localStorage
**Data Structure**: JSON objects for each module
**Storage Keys**:
- jensar_sales: Sales records
- jensar_purchases: Purchase orders
- jensar_production: Production batches
- jensar_suppliers: Supplier information

## Features
- **CRUD Operations**: Create, read, update, delete for all modules
- **Offline Support**: Full functionality without internet connection
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Theme toggle with system preference detection
- **Performance Monitoring**: Core Web Vitals tracking
- **Data Visualization**: Chart.js integration for sales data

## Architecture
The application follows a modular architecture with separate modules for sales, purchases, production, and suppliers. Each module has its own data manager object with CRUD operations. The application uses the browser's localStorage for data persistence, making it fully functional offline.

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers

## Performance Considerations
- Lazy loading for non-critical resources
- Service worker for caching and offline support
- Minimal DOM manipulation
- Optimized animations