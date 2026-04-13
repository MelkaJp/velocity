# VeloCity - Fuel Access Ecosystem Specification

## Project Overview

**Project Name:** VeloCity  
**Project Type:** Full-Stack Web Application  
**Core Functionality:** Digital fuel access ecosystem with QR-code based authentication, multi-channel access (Telegram, Web, Mobile), anti-fraud mechanisms, and municipal revenue tracking  
**Target Users:** Fuel station workers, fleet owners/drivers, municipality administrators, system auditors

---

## UI/UX Specification

### Layout Structure

**Pages:**
1. **Landing Page** - Hero section, features overview, channel access buttons
2. **Driver Portal** - Vehicle registration, wallet management, booking history
3. **Station Dashboard** - Worker interface, QR scanning, transaction logging
4. **Fleet Manager Portal** - Bulk vehicle management, cost analytics, subscriptions
5. **Admin Dashboard** - System oversight, audit trails, revenue reports, station monitoring

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Primary: `#0D1B2A` (Deep Navy)
- Secondary: `#1B263B` (Dark Slate)
- Accent Green (Bajaj): `#2EC4B6`
- Accent Blue (Automobile): `#3A86FF`
- Accent Black (Heavy Truck): `#212529`
- Warning: `#FF6B35`
- Success: `#06D6A0`
- Danger: `#EF476F`
- Background: `#0D1B2A`
- Surface: `#1B263B`
- Text Primary: `#FFFFFF`
- Text Secondary: `#8D99AE`

**Typography:**
- Headings: 'Outfit', sans-serif (700 weight)
- Body: 'DM Sans', sans-serif (400, 500 weight)
- Monospace (codes): 'JetBrains Mono', monospace

**Spacing System:**
- Base unit: 8px
- Sections: 64px vertical padding
- Cards: 24px padding
- Elements: 16px gap

**Visual Effects:**
- Glassmorphism cards with `backdrop-filter: blur(12px)`
- Subtle gradient overlays on hero
- Animated gradient borders on active elements
- Smooth 300ms transitions on all interactions
- Floating particle background on landing

### Components

**Navigation:**
- Top nav bar with logo, menu items, user avatar
- Mobile hamburger menu with slide-out drawer

**Cards:**
- Stats cards with icon, value, label, trend indicator
- Vehicle cards with QR code preview, status badge
- Transaction cards with timestamp, amount, verification status

**Buttons:**
- Primary: Filled with accent color, white text
- Secondary: Outlined with border
- Icon buttons: Circular with hover scale

**Forms:**
- Input fields with floating labels
- Select dropdowns with custom styling
- Toggle switches for status controls

**Modals:**
- Centered overlay with blur backdrop
- Slide-up animation on mobile

**QR Code Display:**
- Color-coded borders based on vehicle type
- Animated scan line effect
- Copy/download actions

---

## Functionality Specification

### Core Features

#### 1. Landing Page
- Animated hero with tagline "Fuel. Controlled. Transparent."
- Feature cards for each channel (Telegram Bot, TMA, WebApp, Native App)
- Live stats counter (vehicles registered, stations active, liters tracked)
- Call-to-action buttons for registration

#### 2. Driver Portal
- Vehicle registration form with:
  - Vehicle type selection (Bajaj/Automobile/Truck)
  - Plate number input
  - Tank capacity declaration
  - QR code generation with type-specific color
- Fuel wallet balance display
- Transaction history with digital receipts
- Booking management with time slot selection

#### 3. Station Dashboard
- QR scanner interface (simulated camera view)
- Manual liters input field
- GPS verification status indicator
- Transaction confirmation with anomaly detection
- Daily summary (total liters, valid scans, flagged transactions)

#### 4. Fleet Manager Portal
- Bulk vehicle import (CSV upload)
- Cost tracking per vehicle/team
- Subscription management
- Route verification for trucks
- Analytics dashboard with charts

#### 5. Admin Dashboard
- Real-time station map with load indicators
- Revenue split calculator (70/30)
- Audit trail with filters
- Anomaly alerts panel
- System health metrics

### User Interactions

- **Vehicle Registration:** Form → Validation → QR Generation → Download
- **Fuel Fill-up:** QR Scan → GPS Verify → Liters Input → Anomaly Check → Confirmation
- **Booking:** Select Station → Choose Time Slot → Confirm → Receive QR
- **Audit:** Select Date Range → View Transactions → Export Report

### Data Handling

- Local state management with React hooks
- Simulated API responses for demo
- Persistent storage in localStorage
- Sample data seeded on first load

### Edge Cases

- Invalid QR code display error
- GPS outside geofence warning
- Tank capacity exceeded alert
- Station inventory depleted notification
- Network offline mode indicator

---

## Acceptance Criteria

1. ✅ Landing page loads with animated hero and all feature sections
2. ✅ Driver can register vehicle and receive colored QR code
3. ✅ Station dashboard shows QR scanner interface with GPS status
4. ✅ Transactions log with proper timestamps and verification status
5. ✅ Admin dashboard displays revenue calculations and audit features
6. ✅ All pages are responsive across mobile/tablet/desktop
7. ✅ Smooth animations and transitions throughout
8. ✅ No console errors on page load
9. ✅ All interactive elements have hover states
10. ✅ Navigation works between all sections