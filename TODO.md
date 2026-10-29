# TODO — Aleesha Travel & Tours

Custom travel and vehicle visuals have been requested from the image generator and are wired through its managed URLs. Until the image-generation results arrive, photo-dependent criteria below remain open; do not claim those final image assets are complete.

## 1. Home page and booking widget
- [x] Build a premium homepage for Aleesha Travel & Tours with a clear, accessible wordmark/logo; desktop links Home, Destinations, Our Fleet, How It Works, My Bookings; Book a Trip action; and compact, accessible mobile navigation.
- [x] Use the headline **Your Journey. Your Comfort. Your Way.** and supporting text “Book comfortable and reliable road travel from Al-Istiqama University, Sumaila, to destinations across Nigeria — and back to campus.” Put the booking widget prominently within or directly beneath the hero.
- [x] The widget must offer **Going Home** and **Returning to Campus** tabs; departure location, destination, travel date, passenger count and preferred vehicle; and vehicle choices **Any Vehicle, Bus, Luxury Bus, Toyota Sienna, Toyota Hiace, SUV, Executive Car**. Its primary action is **Find Available Rides**. Search selections must flow into results and subsequent pages.
- [x] Include concise homepage sections for Popular Student Routes, Explore Our Vehicle Types, About Travelling from AUSU, How Booking Works, Why Choose Aleesha, Frequently Asked Questions, a final booking CTA and a professional footer; avoid repetitive or excessively long sections.

## 2. Search results, filtering and trip cards
- [x] Show the route title (for example AUSU, Sumaila → Abuja), departure date, passenger count, and Edit Search action. Support vehicle type, price range, departure time and available-seat filters plus Lowest Price / Earliest Departure sorting.
- [ ] Every result card must contain representative vehicle imagery, vehicle category/model where available, departure time, pickup point, destination/drop-off point, capacity, available-seat count, comfort features, fare per passenger in Nigerian Naira, and a clear Select Ride action. Distinguish standard, luxury and executive options. **Vehicle image files are still being generated.**
- [x] Use prototype/sample records only. Prominently label availability, fares and schedules illustrative. Do not invent a real operator, verified availability or verified service features.

## 3. Vehicle detail screen
- [ ] Present large vehicle photography, type/name, route overview, pickup and drop-off, departure date and time, passenger capacity, included features, fare breakdown, travel guidelines and seat availability. Provide **Continue to Seat Selection** and enough detail to reassure travellers before proceeding. **Vehicle image files are still being generated.**

## 4. Interactive, vehicle-specific seat selection
- [x] Provide different seating plans suitable for **Bus, Luxury Bus, Sienna, Hiace, SUV and Executive Car**; do not show a single repeated layout. Clearly identify the driver and numbered passenger seats.
- [x] Show Available, Selected and Unavailable seat states with a legend; enforce the passenger count; update the selected-seat list and total fare live; and provide a sticky summary and Continue action. Keep the chart readable/selectable on mobile.

## 5. Passenger information
- [x] Collect full name, phone number, email address, optional emergency contact, and the passenger information for additional travellers. Validate required data and show informative, accessible error states.
- [x] Show a journey summary with origin, destination, travel date, selected vehicle, seat numbers and fare.

## 6. Booking review and payment placeholder
- [x] On desktop use a two-column checkout with trip information, passenger details, seat selection and booking terms on the left, and fare summary, passenger count, total, payment-method section and Confirm Booking on the right. On mobile use one column plus a sticky total/payment CTA.
- [x] Clearly disclose that payment processing/integration is not implemented. A prototype confirmation may be recorded as pending payment, but never claim or imply that payment succeeded.

## 7. Booking confirmation ticket
- [x] Present an elegant ticket-like confirmation with booking reference, passenger name, vehicle type, departure date/time, origin/destination, seat number(s), booking status and fare details.
- [x] Include View My Booking, a disabled/future-enabled Print or Download Ticket action, and Back to Homepage. Display pending payment honestly when no payment integration exists.

## 8. My Bookings
- [x] Create Upcoming, Completed and Cancelled tabs. A booking card shows booking reference, route, date, vehicle, seat numbers, total fare, booking status and View Details.
- [x] Provide a professional first-time-user empty state. Browser-local prototype bookings must be presented as demo/local history, not as a live authenticated account or carrier reservation.

## 9. Returning-to-campus flow
- [x] Create a dedicated page with the exact headline **Heading Back to AUSU?**. Automatically set Al-Istiqama University, Sumaila as destination and let students choose their home city as departure. Continue into the same search, vehicle, seat, passenger and review journey as Going Home.

## 10. Fleet catalogue
- [ ] Feature **Standard Bus, Luxury Bus, Toyota Sienna, Toyota Hiace, SUV and Executive Car** with accurate representative vehicle imagery, a short explanation, capacity and Select Vehicle action. Do not use sports cars or unrelated sedans as substitutes for buses, Sienna or Hiace. **Vehicle image files are still being generated.**

## 11. AUSU campus information
- [x] Include the title **Your Journey Starts at Al-Istiqama University**, university name/location, student holiday transportation context, clearly identified campus pickup-information placeholder, return-to-campus options and Book from AUSU action.
- [x] This must be independent transport-service design, not a misleading official-university website. Use genuine university imagery only when an authentic, properly licensed source is available; do not label generic imagery as AUSU.

## 12. Shared design system, mobile experience and prototype scope
- [x] Maintain a unified premium, contemporary visual design system across real, separately addressable HTML pages: restrained primary/secondary colors; display/heading/body/label/caption hierarchy; 8px spacing system; button states; navigation; form/searchable-select/date controls; vehicle cards; Naira prices/status indicators; progress stepper; modal/drawer; empty/error/toast; consistent image ratios; hover/focus/active/disabled/loading states.
- [x] Implement complete responsive screens for mobile widths 375px and 430px, tablet 768px, and desktop 1440px. Provide compact mobile header, full-width inputs, touch-friendly vehicle filters, readable result cards, bottom-sheet interactions where appropriate, sticky booking CTA, readable seat layout and simplified checkout. No horizontal overflow; preserve a consistent visual system at each size.
- [x] Include popular illustrative sample routes **AUSU → Kano, Kaduna, Abuja, Jos, Katsina, Bauchi, Lagos** and corresponding return journeys. Use Nigerian Naira, Nigerian phone-number formats and familiar local travel terminology. Label prototype schedules/fares illustrative.
- [x] Use restrained 150–350ms transitions, subtle hover/selection feedback and smooth page/step transitions. Respect `prefers-reduced-motion`; no bouncing, distracting parallax or excessive reveal effects. Do not fabricate ratings, testimonials, operational statistics, university affiliation or successful payment.
- [x] Deliver a true multi-page implementation in HTML5/CSS3/vanilla JS, with working navigation and shared browser-local state; not a generic dashboard or an app that stops at the homepage. Keep any future-only action clearly marked.
