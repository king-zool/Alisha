# Aleesha Travel & Tours — Implementation Plan

## Product and technical approach

Deliver a real multi-page, mobile-responsive student road-travel booking prototype for Aleesha Travel & Tours. Preserve the explicit HTML5, CSS3 and vanilla JavaScript constraint: each major screen is its own HTML document and URL, all pages use a shared stylesheet and common JavaScript/data modules, and normal links/navigation move between documents. Keep user-selected search, ride and passenger state in browser `localStorage`; clearly communicate this as a browser-only prototype, not a live account or transport reservation. Provide a small dependency-free Node HTTP server for the Manus preview, serving the distinct HTML files and a static route manifest on port 3000. Do not add a managed database, sign-in, external API, real operator availability or payment integration.

Seed a concise, realistic set of illustrative departures between Al-Istiqama University, Sumaila and Kano, Kaduna, Abuja, Jos, Katsina, Bauchi and Lagos, including return journeys. Mark every prototype fare, time, seat count and service/vehicle feature as illustrative. Use Naira amounts, local terminology and Nigerian phone validation. A prototype booking is stored locally and marked **Pending payment**; checkout must clearly identify payment as not connected and never represent a payment as successful.

## Multi-page information architecture

- `/` (`index.html`): Home, hero, search widget, routes and services overview.
- `/search-results.html`: searchable results, filters and sorting.
- `/vehicle-details.html`: selected trip detail and fare explanation.
- `/seat-selection.html`: vehicle-specific seat plan and live total.
- `/passenger-details.html`: passenger forms and summary.
- `/review-payment.html`: booking review, terms and payment placeholder.
- `/confirmation.html`: pending-payment ticket and reference.
- `/my-bookings.html`: upcoming, completed and cancelled tabs; browser-local prototype booking history and empty state.
- `/return-to-campus.html`: dedicated reverse-journey form with AUSU automatically set as destination.
- `/fleet.html`: six accurate vehicle-category cards: Standard Bus, Luxury Bus, Toyota Sienna, Toyota Hiace, SUV and Executive Car.
- `/campus.html`: independent service's AUSU location/pickup information and campus journey links; use a placeholder for unverified pickup operations and do not suggest university ownership or endorsement.

Each route is separately addressable. Shared header/footer, page progress where relevant and consistent cross-links make the journey navigable without turning pages into a client-side single-page app.

## Visual design

- **Design movement:** contemporary editorial travel, refined through the restraint and clarity of fintech products.
- **Core principles:** transparent, plain-language booking; strong readability; accurate, editorial transport imagery; mobile-first actions and consistent component behavior.
- **Color philosophy:** warm limestone backgrounds and deep ink/navy typography establish calm; forest-teal signals trusted booking actions; muted saffron is reserved for wayfinding and pending status rather than competing with the primary action. Indicative tokens: ink `#172321`, teal `#176C5B`, deeper teal `#105449`, soft mint `#E7F1EC`, warm canvas `#F8F7F3`, white `#FFFFFF`, body-muted `#68736E`, line `#E5E8E2`, saffron `#C48B35`, error `#B34B42`.
- **Layout paradigm:** an editorial, left-aligned content flow with asymmetric hero composition and a search panel that overlaps/tucks under the image on wide viewports; stacked, full-width form actions and horizontally scrollable chips on small screens. Results prioritize a readable trip summary beside transport cards; checkout uses a two-column desktop layout and a sticky mobile total.
- **Signature elements:** a custom wayfinding/road mark paired with the ALEESHA wordmark; route lines and stop dots that make journey direction legible; restrained ticket-stub / seat-number motifs for the booking stepper and confirmation.
- **Interaction philosophy and motion:** direct and calm, clear selected/focus/error states, 150–350 ms transitions for links, cards, drawers and seat feedback, no motion-dependent meaning, and reduced-motion support.
- **Typography:** Plus Jakarta Sans for branded display and headings, with Manrope for compact body/UI text and native sans-serif fallbacks. Use a restrained scale for display/section/card/body/label/caption hierarchy; avoid oversized display headings on narrow screens.
- **Brand essence:** dependable, student-aware road trips between AUSU and home; personality: clear, warm, capable.
- **Brand voice:** practical, reassuring and local. Example lines: “Your Journey. Your Comfort. Your Way.” and “Heading Back to AUSU?”
- **Wordmark and logo:** original inline road/compass monogram with a clean ALEESHA wordmark; use a separate, durable brand mark asset for platform project metadata.
- **Signature brand color:** forest teal.

Use consistent 8px-based spacing, accessible form labels, keyboard focus, adequate contrast and touch targets, restrained card borders/shadows, and image crops with stable aspect ratios. Status labels and price formatting must be reused across screens.

## Source layout

- Root HTML files: `index.html`, `search-results.html`, `vehicle-details.html`, `seat-selection.html`, `passenger-details.html`, `review-payment.html`, `confirmation.html`, `my-bookings.html`, `return-to-campus.html`, `fleet.html`, `campus.html`.
- `css/styles.css`: tokens, base typography, accessible controls, shared layout/components, responsive breakpoints and reduced-motion behavior.
- `js/data.js`: illustrative route/trip/vehicle seed data and vehicle-specific seat configuration.
- `js/app.js`: shared navigation/footer, state utilities, formatting, page initializers, validation, filters/sort and booking-state orchestration.
- `assets/images/`: brand-mark asset. Original hero and vehicle photography is served from the managed image URLs; no generated image is represented as a real AUSU photograph.
- `public/manus-routes.json`: all user-facing page routes, synchronized with the HTML pages.
- `server.mjs`: dependency-free preview server; `package.json` pins npm and contains a start script, with no runtime libraries.

## Constraints and scope

This is a front-end prototype: no login/accounts, third-party payment processing, customer notification, real carrier inventory, operational schedule, live availability or verified pickup address. Campus imagery is included only if an authentic, properly licensed asset is available; otherwise use a clearly identified campus-information presentation with no generic image labeled as AUSU. Never fabricate ratings, operator endorsements or verified service features. Keep all page navigation and booking state usable without external services, and keep future Print/Download disabled or explicitly future-enabled.
