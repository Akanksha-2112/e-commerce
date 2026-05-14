# AWIK SPECTRUM — Luxury E-Commerce · PRD

## Original problem statement
User-provided existing MERN-stack luxury clothing e-commerce repo (frontend deployed at
https://e-commerce-xi-beige-81.vercel.app). Goal: read the codebase, fix issues, then
progressively make the project more functional. User has opted **not** to run the app
inside the Emergent pod — all work is code-only and pushed to GitHub for Vercel auto-deploy.

## Tech stack
- **Frontend** (`/app/client`): React 18 · React Router 6 · Axios · Framer Motion · Formik + Yup · React Icons
- **Backend** (`/app/server`): Node + Express 4 (ESM) · Mongoose 7 · JWT · Passport (Google OAuth) · bcryptjs · Nodemailer · Cloudinary · Multer · express-rate-limit · express-validator
- **DB**: MongoDB

## User personas
- **Guest visitor** — browses the boutique landing and category pages
- **Member (customer)** — registered user with cart, wishlist, recently-viewed, profile, 2FA opt-in
- **Admin** — manages products, categories and orders via `/admin/dashboard`

## Core requirements (static)
- Luxury / editorial aesthetic (obsidian + ivory + gold #D4AF37, Bodoni/Playfair + Montserrat/Inter)
- JWT + optional 2FA login + Google OAuth + email verification + password reset
- Product catalogue with categories, subcategories, sizes, colours, stock
- Cart + wishlist + recently-viewed (server-synced for logged-in users)
- Order placement with shipping address (currently COD-only)
- Admin product / category management
- Cloudinary image upload, Gmail OAuth2 / SMTP email with mock fallback

## What's been implemented in this session
### 2026-01 · Session 1
- **Repo discovery** — full read of `/app` (server + client), identified bugs/gaps.
- **Code fix #1** — replaced 18 files of hard-coded `https://e-commerce-2e5z.onrender.com` with `process.env.REACT_APP_API_URL` via new `client/src/config.js`. Added `client/.env.example`. Fallback to Render URL preserves existing deployment behaviour.
- **Code fix #2** — `GlobalContext.removeFromCart` now actually syncs to the server. Added `mapCart()` helper, captured cart-item `_id` (as `cartItemId`) from API responses, implemented DELETE with fallback path & error recovery, plus optimistic-update revert on failed `addToCart`.
- **Code fix #3** — `authController.registerUser` now fires a `welcomeEmail()` on registration (non-blocking; falls back gracefully via the existing mock email service).
- **Feature: brand-new Product Detail page** — `pages/ProductDetailPage.jsx` rewritten from scratch in luxury editorial style:
  - Image gallery (vertical thumb strip + animated main image)
  - Sticky right-side info column (brand, name, price, SKU, italic description)
  - Size selector (chip buttons), Colour swatches with name mapping, Quantity stepper
  - Add-to-Bag (opens drawer + toast) + Wishlist heart toggle
  - Stock indicator (in-stock / low / out)
  - Shipping/Returns/Authenticity reassurance row
  - "The Particulars" Framer-Motion accordion (Details · Fabric & Care · Shipping)
  - "The House Recommends" related products grid (same category)
  - Recently-viewed tracking for signed-in users
  - Loading + error + 404 states styled in-brand
  - Fully responsive (≤1100px stacked, ≤720px mobile)
  - All interactive elements have `data-testid` attributes
- **Route registration** — added `/product/:id` to `App.jsx`. The Landing Page already navigates here but the route was missing previously (would 404).
- **Enhancement** — `GlobalContext.addToCart(product, quantity = 1)` now accepts a quantity (backward-compatible). Optimistic revert subtracts the right amount on failure.
- **Feature: functional Luxury Checkout page** — `pages/LuxuryCheckout.jsx` rewritten from scratch:
  - Was a non-functional mock — no state, no onClick, no submission, $ instead of ₹, missing required `state`, `country`, `phone` fields
  - Now: controlled form, light validation, auto-fills email/name/phone from logged-in user
  - Adds missing required fields and a Country select (India / UK / US / UAE / SG / AU / CA)
  - Payment method picker — COD enabled, Card disabled with "Coming Soon" label
  - INR formatting via `Intl.NumberFormat` (₹) throughout summary
  - 18% GST line item; shipping shown as "Complimentary"
  - Submits to `POST /api/orders` with proper payload, surfaces backend validation errors
  - Auth guard (redirects to `/login` if not signed in) and empty-cart guard
  - Animated success state showing order reference + total, with "View Orders" / "Continue Browsing" CTAs
- **Cart Drawer polish** — `components/common/CartDrawer.jsx` switched $ → ₹, added remove-item trash button, disabled "Proceed to Checkout" when empty, added `data-testid`s.
- **`GlobalContext.clearCart`** — new function added (server-synced) and exposed via context; used after successful order placement.
- **Files added**: `client/src/config.js`, `client/.env.example`, `client/src/styles/ProductDetailLuxury.css`.
- **Lint**: full `client/src/**/*.{js,jsx}` ESLint pass — **no issues**.

## Prioritised backlog
### P0 — Should ship next
- Product reviews & ratings UI (backend already supports it)
- Functional search bar + filter sidebar on category pages
- Wishlist page polish — proper grid + "Move to Bag" + "Remove"

### P1 — High value
- Real payment integration (Stripe / Razorpay / PayPal)
- Order tracking page + order history with status timeline
- Admin product CRUD UI with Cloudinary image upload
- Admin order management (mark shipped / delivered)
- 2FA toggle in profile page (backend supports `twoFactorEnabled` already)

### P2 — Polish
- Email verification enforced on signup before access to checkout
- Cleanup of duplicate / experimental files (`components/CartContext.jsx`, `pages/Navbar.jsx`, `pages/CategoryPage.jsx`, alt landing pages)
- Mobile responsiveness audit across all pages
- Image lazy-loading + code-splitting

## Next tasks
1. Push current changes via "Save to GitHub" → Vercel auto-redeploys.
2. (Optional) Set `REACT_APP_API_URL` env var in Vercel → backend origin.
3. Begin Product Reviews UI on the new detail page (option **e** from the menu).

## Known gaps / mocked items
- **No real payment** — orders default to Cash-on-Delivery.
- **Email service** falls back to mock (console log) if SMTP / Gmail OAuth not configured. Welcome email uses fire-and-forget — failures don't block signup.
- **No tests run live** in this session (user opted out of running app in pod). Verification was static (ESLint + `node --check`).
- **`requirements.txt` at repo root** is documentation only (this is a JS/Node project, not Python).
