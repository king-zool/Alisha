import { AUSU, AUSU_SHORT, destinations, makeRides, seatLayouts, vehicles } from "./data.js";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const KEYS = { search: "aleesha.search.v1", ride: "aleesha.ride.v1", seats: "aleesha.seats.v1", passengers: "aleesha.passengers.v1", bookings: "aleesha.bookings.v1", currentBooking: "aleesha.current-booking" };
const HOME_URL = "index.html";
const BOOKINGS_URL = "my-bookings.html";
const AUSU_LABEL = `${AUSU} (AUSU)`;

function read(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}
function money(value) { return `₦${Number(value || 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`; }
function dateForInput(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
function displayDate(value) {
  if (!value) return "Select a travel date";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
function displayPlace(value = "") {
  if (/al-istiqama|ausu|sumaila/i.test(value)) return AUSU_SHORT;
  return value;
}
function getSearch() {
  return read(KEYS.search, { direction: "home", from: AUSU_LABEL, to: "Abuja", date: dateForInput(new Date(Date.now() + 86400000)), passengers: 1, vehicle: "any" });
}
function getRide() {
  const selected = read(KEYS.ride);
  if (selected) return selected;
  return makeRides(getSearch())[0];
}
function getSeats() { return read(KEYS.seats, []); }
function getBookingByRef(ref) { return (read(KEYS.bookings, []) || []).find((booking) => booking.reference === ref) || null; }

function showToast(message, kind = "info") {
  let region = $("#toast-region");
  if (!region) {
    region = document.createElement("div"); region.id = "toast-region"; region.className = "toast-region"; region.setAttribute("aria-live", "polite"); document.body.append(region);
  }
  const toast = document.createElement("div"); toast.className = `toast toast--${kind}`; toast.textContent = message; region.append(toast);
  window.setTimeout(() => toast.remove(), 3400);
}
function commonChrome() {
  const current = document.body.dataset.page || "home";
  const headerHost = $("[data-site-header]");
  if (headerHost) headerHost.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="announcement"><span class="status-dot"></span>Student journeys, made a little easier <span class="announcement-note">Prototype · sample fares only</span></div>
    <header class="site-header"><div class="container header-inner">
      <a class="brand" href="${HOME_URL}" aria-label="Aleesha Travel and Tours home"><span class="brand-mark" aria-hidden="true"><img src="assets/images/brand-mark.png" alt="" width="40" height="40"></span><span class="brand-copy"><strong>ALEESHA</strong><small>TRAVEL &amp; TOURS</small></span></a>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-menu-toggle><span></span><span></span></button>
      <nav class="primary-nav" data-menu><a href="index.html" ${current === "home" ? 'aria-current="page"' : ""}>Home</a><a href="index.html#destinations">Destinations</a><a href="fleet.html" ${current === "fleet" ? 'aria-current="page"' : ""}>Our Fleet</a><a href="index.html#how-it-works">How It Works</a><a href="my-bookings.html" ${current === "bookings" ? 'aria-current="page"' : ""}>My Bookings</a><a class="nav-mobile-cta" href="index.html#booking">Book a Trip</a></nav>
      <a class="button button--small header-cta" href="index.html#booking">Book a Trip <span aria-hidden="true">↗</span></a>
    </div></header>
    <nav class="mobile-bar" aria-label="Quick navigation"><a href="index.html" class="${current === "home" ? "is-active" : ""}"><span class="mobile-icon">⌂</span>Find a ride</a><a href="fleet.html" class="${current === "fleet" ? "is-active" : ""}"><span class="mobile-icon">◉</span>Our fleet</a><a href="my-bookings.html" class="${current === "bookings" ? "is-active" : ""}"><span class="mobile-icon">▤</span>My trips</a></nav>`;
  const stepIndex = { results: 0, details: 1, seats: 2, passengers: 3, review: 4, confirmation: 5 }[current];
  const stepLabels = ["Rides", "Vehicle", "Seats", "Passengers", "Review", "Done"];
  const pageTop = $("#main-content .page-top");
  if (stepIndex !== undefined && pageTop) {
    const progress = document.createElement("nav"); progress.className = "booking-progress"; progress.setAttribute("aria-label", "Booking progress");
    progress.innerHTML = `<div class="container"><ol class="progress-list">${stepLabels.map((label, index) => `<li class="progress-step ${index < stepIndex ? "progress-step--complete" : index === stepIndex ? "progress-step--current" : ""}" ${index === stepIndex ? 'aria-current="step"' : ""}><span class="progress-node">${index < stepIndex ? "✓" : String(index + 1).padStart(2, "0")}</span><span class="progress-label">${label}</span></li>`).join("")}</ol></div>`;
    pageTop.after(progress);
  }
  const footerHost = $("[data-site-footer]");
  if (footerHost) footerHost.innerHTML = `<footer class="site-footer"><div class="container footer-grid"><div class="footer-brand"><a class="brand brand--footer" href="index.html"><span class="brand-mark" aria-hidden="true"><img src="assets/images/brand-mark.png" alt="" width="40" height="40"></span><span class="brand-copy"><strong>ALEESHA</strong><small>TRAVEL &amp; TOURS</small></span></a><p>Independent student travel from AUSU to destinations across Nigeria—and back to campus.</p></div><div><h3>Explore</h3><a href="index.html#destinations">Popular routes</a><a href="fleet.html">Our fleet</a><a href="campus.html">AUSU information</a></div><div><h3>Your journey</h3><a href="index.html#booking">Going home</a><a href="return-to-campus.html">Returning to AUSU</a><a href="my-bookings.html">My bookings</a></div><div class="footer-note"><span class="eyebrow">A NOTE ABOUT THIS DEMO</span><p>Illustrative sample fares and schedules. Pickup information and vehicle features are placeholders; no transport operator or payment service is connected.</p></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Aleesha Travel &amp; Tours · Prototype concept</span><a href="campus.html">Independent service; not affiliated with AUSU</a></div></footer>`;
  const menuButton = $("[data-menu-toggle]");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    $("[data-menu]")?.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
}
function bindDateDefaults(root = document) {
  const min = dateForInput();
  $$('input[type="date"]', root).forEach((input) => { input.min = min; if (!input.value) input.value = getSearch().date || dateForInput(new Date(Date.now() + 86400000)); });
}
function optionList(search = getSearch()) {
  const cityOptions = destinations.map((destination) => `<option value="${escapeHTML(destination.name)}"></option>`).join("");
  const origin = search.direction === "return" ? `<input id="from" name="from" type="search" list="nigerian-cities" value="${escapeHTML(search.from === AUSU_LABEL ? "Abuja" : search.from || "Abuja")}" required autocomplete="off" placeholder="Choose your home city">` : `<input id="from" name="from" type="text" value="${AUSU_LABEL}" readonly aria-readonly="true">`;
  return { cityOptions, origin };
}
function bindSearchForm(form, direction = "home") {
  if (!form) return;
  bindDateDefaults(form);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const returning = direction === "return" || data.get("direction") === "return";
    const from = returning ? String(data.get("from") || "").trim() : AUSU_LABEL;
    const to = returning ? AUSU_LABEL : String(data.get("to") || "").trim();
    const search = {
      direction: returning ? "return" : "home", from, to,
      date: String(data.get("date") || dateForInput(new Date(Date.now() + 86400000))),
      passengers: Math.max(1, Math.min(8, Number(data.get("passengers") || 1))),
      vehicle: String(data.get("vehicle") || "any"),
    };
    if (!returning && (!destinations.some((item) => item.name.toLowerCase() === to.toLowerCase()))) {
      showToast("Choose one of the listed destination cities.", "error"); return;
    }
    if (returning && !destinations.some((item) => item.name.toLowerCase() === from.toLowerCase())) {
      showToast("Choose a home city from the listed destinations.", "error"); return;
    }
    save(KEYS.search, search); localStorage.removeItem(KEYS.ride); localStorage.removeItem(KEYS.seats); localStorage.removeItem(KEYS.passengers);
    window.location.href = "search-results.html";
  });
}
function renderHome() {
  const form = $("#home-search-form");
  bindSearchForm(form, "home");
  const cityOptions = destinations.map((item) => `<option value="${escapeHTML(item.name)}"></option>`).join("");
  const datalist = $("#home-city-options"); if (datalist) datalist.innerHTML = cityOptions;
  const saved = getSearch();
  const to = $("#home-to"); if (to) to.value = saved.direction === "home" ? saved.to : "Abuja";
  if (form) {
    form.elements.date.value = saved.date || form.elements.date.value;
    form.elements.passengers.value = String(Math.min(6, saved.passengers || 1));
    form.elements.vehicle.value = saved.vehicle || "any";
  }
  $("[data-journey-tab='return']")?.addEventListener("click", () => { window.location.href = "return-to-campus.html"; });
  $$("[data-destination]").forEach((button) => button.addEventListener("click", () => {
    const search = getSearch(); search.direction = "home"; search.from = AUSU_LABEL; search.to = button.dataset.destination; save(KEYS.search, search); window.location.href = "search-results.html";
  }));
}
function rideTitle(ride) { return `${displayPlace(ride.origin)} → ${displayPlace(ride.destination)}`; }
function resultCard(ride) {
  return `<article class="ride-card ${ride.multiplier >= 2 ? "ride-card--executive" : ride.multiplier > 1.4 ? "ride-card--premium" : ""}">
    <a class="ride-image" href="vehicle-details.html" data-select-ride="${escapeHTML(ride.id)}" aria-label="View ${escapeHTML(ride.name)} details"><img src="${ride.image}" alt="Illustrative ${escapeHTML(ride.name)} sample vehicle" loading="lazy"><span class="image-chip">${escapeHTML(ride.category)}</span></a>
    <div class="ride-card-body"><div class="ride-main"><div class="ride-title-row"><div><p class="eyebrow">ILLUSTRATIVE SAMPLE RIDE</p><h2>${escapeHTML(ride.name)}</h2></div><div class="price-block"><strong>${money(ride.fare)}</strong><span>per passenger · sample fare</span></div></div>
      <div class="route-times"><div><strong>${escapeHTML(ride.departure)}</strong><span>${escapeHTML(displayPlace(ride.origin))}</span></div><div class="route-connector"><span>${escapeHTML(ride.duration)}</span><i></i></div><div><strong>Est. arrival</strong><span>${escapeHTML(displayPlace(ride.destination))}</span></div></div>
      <div class="ride-meta"><span>◷ ${escapeHTML(displayDate(getSearch().date))}</span><span>♙ ${ride.available} sample seats</span><span>Up to ${ride.capacity} seats</span></div>
      <div class="feature-chips">${ride.features.slice(0, 2).map((feature) => `<span>${escapeHTML(feature)}</span>`).join("")}</div>
      <div class="sample-note">Sample route and vehicle details. Pickup and included features are not verified.</div></div>
      <div class="ride-actions"><button type="button" class="button button--outline" data-select-ride="${escapeHTML(ride.id)}">View ride</button><button type="button" class="button button--primary" data-select-ride="${escapeHTML(ride.id)}">Select ride <span aria-hidden="true">→</span></button></div>
    </div></article>`;
}
function renderResults() {
  const root = $("#results-list"); if (!root) return;
  const search = getSearch();
  $("#results-route-title").textContent = rideTitle({ origin: search.from, destination: search.to });
  $("#results-date").textContent = displayDate(search.date);
  $("#results-passengers").textContent = `${search.passengers} ${search.passengers === 1 ? "traveller" : "travellers"}`;
  const allRides = makeRides(search);
  const vehicleFilter = $("#filter-vehicle");
  if (vehicleFilter) vehicleFilter.value = search.vehicle || "any";
  const update = () => {
    let rides = allRides.filter((ride) => ride.capacity >= search.passengers && ride.available >= search.passengers);
    const vehicle = vehicleFilter?.value || "any";
    if (vehicle !== "any") rides = rides.filter((ride) => ride.vehicleId === vehicle);
    const minPrice = Number($("#filter-min-price")?.value || 0);
    const maxPrice = Number($("#filter-price")?.value || 0);
    if (minPrice > 0) rides = rides.filter((ride) => ride.fare >= minPrice);
    if (maxPrice > 0) rides = rides.filter((ride) => ride.fare <= maxPrice);
    const minSeats = Number($("#filter-seats")?.value || 0);
    if (minSeats) rides = rides.filter((ride) => ride.available >= minSeats);
    const time = $("#filter-time")?.value || "any";
    if (time === "morning") rides = rides.filter((ride) => Number(ride.departure.slice(0, 2)) < 10);
    if (time === "midday") rides = rides.filter((ride) => Number(ride.departure.slice(0, 2)) >= 10 && Number(ride.departure.slice(0, 2)) < 15);
    if (time === "evening") rides = rides.filter((ride) => Number(ride.departure.slice(0, 2)) >= 15);
    const sort = $("#sort-rides")?.value || "recommended";
    if (sort === "price") rides.sort((a, b) => a.fare - b.fare);
    else if (sort === "time") rides.sort((a, b) => a.departure.localeCompare(b.departure));
    $("#result-count").textContent = `${rides.length} illustrative ${rides.length === 1 ? "option" : "options"}`;
    root.innerHTML = rides.length ? rides.map(resultCard).join("") : `<div class="empty-state"><span class="empty-icon">⌕</span><h2>No sample rides match these filters</h2><p>Try another vehicle, time or seat filter. Sample schedules and fares are illustrative.</p><button class="button button--outline" type="button" data-clear-filters>Clear filters</button></div>`;
    root.setAttribute("aria-busy", "false");
    $$('[data-select-ride]', root).forEach((button) => button.addEventListener("click", () => {
      const ride = rides.find((item) => item.id === button.dataset.selectRide) || allRides.find((item) => item.id === button.dataset.selectRide);
      if (ride) { save(KEYS.ride, ride); localStorage.removeItem(KEYS.seats); window.location.href = "vehicle-details.html"; }
    }));
    $("[data-clear-filters]")?.addEventListener("click", () => { if (vehicleFilter) vehicleFilter.value = "any"; $("#filter-min-price").value = ""; $("#filter-price").value = ""; $("#filter-seats").value = ""; $("#filter-time").value = "any"; update(); });
  };
  ["#filter-vehicle", "#filter-min-price", "#filter-price", "#filter-seats", "#filter-time", "#sort-rides"].forEach((selector) => $(selector)?.addEventListener("input", update));
  const panel = $("#filters-panel"); const drawerBackdrop = $("#filter-backdrop"); const openFilters = $("#open-filters");
  const setFilterDrawer = (open) => {
    if (!panel || !drawerBackdrop) return;
    panel.classList.toggle("is-open", open); panel.setAttribute("role", open ? "dialog" : "complementary"); panel.setAttribute("aria-modal", String(open));
    drawerBackdrop.hidden = !open; drawerBackdrop.classList.toggle("is-visible", open); document.body.classList.toggle("filter-drawer-open", open);
    openFilters?.setAttribute("aria-expanded", String(open));
    if (open) $("#filter-vehicle", panel)?.focus(); else openFilters?.focus();
  };
  openFilters?.addEventListener("click", () => setFilterDrawer(true));
  $("#close-filters")?.addEventListener("click", () => setFilterDrawer(false));
  drawerBackdrop?.addEventListener("click", () => setFilterDrawer(false));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && panel?.classList.contains("is-open")) setFilterDrawer(false); });
  $("#edit-search")?.addEventListener("click", () => { window.location.href = search.direction === "return" ? "return-to-campus.html" : "index.html#booking"; });
  update();
}
function renderRideDetails() {
  const ride = getRide();
  if (!$("#vehicle-detail")) return;
  $("#vehicle-detail").innerHTML = `<div class="detail-gallery"><img class="detail-hero-image" src="${ride.image}" alt="Illustrative ${escapeHTML(ride.name)} sample vehicle"><div class="detail-gallery-side"><div class="gallery-note">Illustrative vehicle image</div><div class="gallery-wash"><span class="eyebrow">${escapeHTML(ride.category)}</span><strong>Room to travel, space to settle in.</strong><span>Sample vehicle details—not operator verified.</span></div></div></div>
    <div class="detail-grid"><div class="detail-content"><div class="eyebrow">VEHICLE OVERVIEW</div><h1>${escapeHTML(ride.name)} <span class="heading-muted">· ${escapeHTML(ride.label)}</span></h1><p class="lead">A sample ${escapeHTML(ride.category.toLowerCase())} option for the trip from ${escapeHTML(displayPlace(ride.origin))} to ${escapeHTML(displayPlace(ride.destination))}.</p>
      <div class="route-panel"><div class="route-stop"><span class="route-node"></span><div><span>DEPARTURE · ${escapeHTML(ride.departure)}</span><strong>${escapeHTML(ride.pickup)}</strong></div></div><div class="route-line"></div><div class="route-stop"><span class="route-node route-node--end"></span><div><span>ARRIVAL · EST. ${escapeHTML(ride.duration)}</span><strong>${escapeHTML(ride.dropoff)}</strong></div></div><div class="route-date">${escapeHTML(displayDate(getSearch().date))} <span>· Sample schedule</span></div></div>
      <div class="detail-stat-row"><div><strong>${ride.capacity}</strong><span>Illustrative seats</span></div><div><strong>${ride.available}</strong><span>Sample seats available</span></div><div><strong>${escapeHTML(ride.duration)}</strong><span>Estimated travel time</span></div></div>
      <section class="detail-section"><h2>Comfort, on the way</h2><p class="muted-copy">The following list is illustrative only. Vehicle condition and amenities are not verified for a real operator.</p><div class="feature-list">${ride.features.map((feature) => `<span><i>✓</i>${escapeHTML(feature.replace("*", ""))}</span>`).join("")}</div></section>
      <section class="guideline-box"><span class="guideline-icon">i</span><div><h2>A note before you travel</h2><p>Confirm the actual departure, pickup point, luggage rules and operator details before paying a carrier. Aleesha is an independent prototype and does not show live transport inventory.</p></div></section></div>
      <aside class="detail-summary"><span class="eyebrow">SAMPLE TRIP SUMMARY</span><p class="summary-route">${escapeHTML(rideTitle(ride))}</p><div class="summary-date">${escapeHTML(displayDate(getSearch().date))} <span>· ${escapeHTML(ride.departure)}</span></div><div class="summary-row"><span>Sample fare / passenger</span><strong>${money(ride.fare)}</strong></div><div class="summary-row"><span>Passengers</span><strong>${getSearch().passengers}</strong></div><div class="summary-row summary-total"><span>Estimated total</span><strong>${money(ride.fare * getSearch().passengers)}</strong></div><p class="fine-print">Illustrative fare only. Payment and seat availability are not live.</p><button class="button button--primary button--wide" type="button" id="continue-seats">Continue to Seat Selection <span>→</span></button><a class="back-link" href="search-results.html">← Back to sample rides</a></aside></div>`;
  const gallerySide = $(".detail-gallery-side");
  if (gallerySide) gallerySide.style.backgroundImage = `linear-gradient(0deg,rgba(20,39,30,.68),transparent 80%),url("${$(".detail-hero-image").getAttribute("src")}")`;
  $("#continue-seats")?.addEventListener("click", () => { window.location.href = "seat-selection.html"; });
}
function seatButton(seat, selected, unavailable) {
  const status = unavailable.includes(seat) ? "unavailable" : selected.includes(seat) ? "selected" : "available";
  return `<button type="button" class="seat seat--${status}" data-seat="${seat}" aria-pressed="${status === "selected"}" aria-label="Seat ${seat}, ${status}" ${status === "unavailable" ? "disabled" : ""}>${seat}</button>`;
}
function renderSeats() {
  const root = $("#seat-selection"); if (!root) return;
  const ride = getRide(); const search = getSearch(); const layout = seatLayouts[ride.layout] || seatLayouts.standard;
  let selected = getSeats();
  const makeRow = (row, index, last) => `<div class="seat-row ${last ? "seat-row--rear" : ""}" aria-label="Row ${index + 1}">${row.map((cell) => cell === "aisle" ? '<span class="seat-aisle" aria-hidden="true"></span>' : seatButton(cell, selected, layout.unavailable)).join("")}</div>`;
  const render = () => {
    const seatsHTML = layout.rows.map((row, index) => makeRow(row, index, index === layout.rows.length - 1 && ride.layout === "standard")).join("");
    root.innerHTML = `<div class="seat-column"><div class="seat-board"><div class="seat-board-head"><div><span class="eyebrow">${escapeHTML(layout.name.toUpperCase())}</span><h2>Choose your seats</h2></div><span class="seat-count-pill">${selected.length} of ${search.passengers} selected</span></div><div class="seat-note">Different sample layouts are shown for each vehicle. Seat availability here is illustrative.</div><div class="vehicle-cabin"><div class="cabin-front"><span class="cabin-caption">FRONT OF VEHICLE</span><span class="driver-badge"><i>◉</i> Driver</span></div><div class="seat-grid ${ride.layout === "standard" ? "seat-grid--coach" : "seat-grid--compact"}">${seatsHTML}</div><div class="cabin-tail">REAR OF VEHICLE</div></div><div class="seat-legend"><span><i class="legend-seat legend-seat--available"></i>Available</span><span><i class="legend-seat legend-seat--selected"></i>Selected</span><span><i class="legend-seat legend-seat--unavailable"></i>Unavailable</span></div></div><div class="seat-summary-card"><div class="eyebrow">YOUR SAMPLE BOOKING</div><h3>${escapeHTML(ride.name)}</h3><p>${escapeHTML(rideTitle(ride))}</p><div class="selected-seat-list"><span>Seats selected</span><strong>${selected.length ? selected.map((seat) => `<span class="seat-number-tag">${seat}</span>`).join(" ") : "Choose a seat"}</strong></div><div class="summary-row"><span>${search.passengers} passenger${search.passengers > 1 ? "s" : ""} × ${money(ride.fare)}</span><strong>${money(ride.fare * search.passengers)}</strong></div><div class="summary-total summary-row"><span>Total sample fare</span><strong>${money(ride.fare * search.passengers)}</strong></div><button class="button button--primary button--wide" type="button" id="continue-passengers" ${selected.length !== search.passengers ? "disabled" : ""}>Continue <span>→</span></button><p class="fine-print">Select exactly ${search.passengers} seat${search.passengers > 1 ? "s" : ""}. No live reservation is made.</p></div></div>`;
    $$('[data-seat]:not([disabled])', root).forEach((button) => button.addEventListener("click", () => {
      const seat = Number(button.dataset.seat);
      if (selected.includes(seat)) selected = selected.filter((item) => item !== seat);
      else if (selected.length < search.passengers) selected = [...selected, seat].sort((a, b) => a - b);
      else { showToast(`Choose ${search.passengers} seat${search.passengers > 1 ? "s" : ""} to match the passenger count.`, "error"); return; }
      save(KEYS.seats, selected); render();
    }));
    $("#continue-passengers")?.addEventListener("click", () => { if (selected.length === search.passengers) window.location.href = "passenger-details.html"; });
  };
  render();
}
function passengerTemplate(index, passenger = {}) {
  const isMain = index === 0;
  return `<fieldset class="passenger-card"><legend><span class="passenger-number">${String(index + 1).padStart(2, "0")}</span> Passenger ${index + 1}${isMain ? " <span class='primary-label'>BOOKING CONTACT</span>" : ""}</legend><div class="form-grid"><label class="field field--full"><span>Full name</span><input name="name-${index}" autocomplete="${isMain ? "name" : "off"}" required value="${escapeHTML(passenger.name || "")}" placeholder="As shown on your ID"><small>Enter the passenger’s full name.</small></label><label class="field"><span>Phone number</span><input name="phone-${index}" type="tel" inputmode="tel" pattern="(?:\\+234|234|0)?[789][01][0-9]{8}" title="Enter a Nigerian number, e.g. 08012345678 or +2348012345678" autocomplete="${isMain ? "tel" : "off"}" required value="${escapeHTML(passenger.phone || "")}" placeholder="0801 234 5678"><small>Use a Nigerian phone number.</small></label><label class="field"><span>Email address</span><input name="email-${index}" type="email" autocomplete="${isMain ? "email" : "off"}" required value="${escapeHTML(passenger.email || "")}" placeholder="name@example.com"></label>${isMain ? `<label class="field field--full"><span>Emergency contact <em>Optional</em></span><input name="emergency" type="tel" inputmode="tel" placeholder="Name and phone number"></label>` : ""}</div></fieldset>`;
}
function renderPassengers() {
  const form = $("#passenger-form"); if (!form) return;
  const search = getSearch(); const ride = getRide(); const seats = getSeats(); const existing = read(KEYS.passengers, []);
  const container = $("#passenger-fields");
  container.innerHTML = Array.from({ length: search.passengers }, (_, index) => passengerTemplate(index, existing[index])).join("");
  $("#passenger-summary").innerHTML = `<div class="journey-summary-line"><span>JOURNEY</span><strong>${escapeHTML(rideTitle(ride))}</strong></div><div class="journey-summary-line"><span>DATE &amp; TIME</span><strong>${escapeHTML(displayDate(search.date))} · ${escapeHTML(ride.departure)}</strong></div><div class="journey-summary-line"><span>VEHICLE</span><strong>${escapeHTML(ride.name)}</strong></div><div class="journey-summary-line"><span>SEAT${seats.length === 1 ? "" : "S"}</span><strong>${seats.map((seat) => `<span class="seat-number-tag">${seat}</span>`).join(" ")}</strong></div><div class="journey-summary-line journey-summary-line--total"><span>ILLUSTRATIVE TOTAL</span><strong>${money(ride.fare * search.passengers)}</strong></div><p class="fine-print">Sample details only. Payment is not connected.</p>`;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (seats.length !== search.passengers) { showToast("Please return and choose one seat for each passenger.", "error"); return; }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const passengers = Array.from({ length: search.passengers }, (_, index) => ({ name: data.get(`name-${index}`).toString().trim(), phone: data.get(`phone-${index}`).toString().trim(), email: data.get(`email-${index}`).toString().trim(), emergency: index === 0 ? (data.get("emergency") || "").toString().trim() : "" }));
    save(KEYS.passengers, passengers); window.location.href = "review-payment.html";
  });
}
function renderReview() {
  const root = $("#review-details"); if (!root) return;
  const ride = getRide(); const search = getSearch(); const seats = getSeats(); const passengers = read(KEYS.passengers, []);
  root.innerHTML = `<section class="review-card"><div class="review-card-head"><div><span class="eyebrow">YOUR JOURNEY</span><h2>${escapeHTML(rideTitle(ride))}</h2></div><a href="vehicle-details.html">Edit</a></div><div class="review-line"><span>Travel date &amp; departure</span><strong>${escapeHTML(displayDate(search.date))} · ${escapeHTML(ride.departure)}</strong></div><div class="review-line"><span>Pickup point</span><strong>${escapeHTML(ride.pickup)}</strong></div><div class="review-line"><span>Drop-off point</span><strong>${escapeHTML(ride.dropoff)}</strong></div><div class="review-line"><span>Vehicle</span><strong>${escapeHTML(ride.name)} · ${escapeHTML(ride.category)}</strong></div><div class="review-line"><span>Selected seats</span><strong>${seats.map((seat) => `<span class="seat-number-tag">${seat}</span>`).join(" ") || "Not selected"}</strong></div></section>
    <section class="review-card"><div class="review-card-head"><div><span class="eyebrow">PASSENGERS</span><h2>Traveller details</h2></div><a href="passenger-details.html">Edit</a></div>${passengers.map((passenger, index) => `<div class="passenger-review"><span class="passenger-number">${String(index + 1).padStart(2, "0")}</span><div><strong>${escapeHTML(passenger.name)}</strong><span>${escapeHTML(passenger.phone)} · ${escapeHTML(passenger.email)}</span></div></div>`).join("") || '<p class="muted-copy">Passenger details have not been entered.</p>'}</section>
    <section class="terms-card"><label class="check-field"><input type="checkbox" id="booking-terms" required><span>I have reviewed the trip details and understand schedules, availability and fares shown are illustrative. I understand no transport operator or payment service is connected.</span></label></section>`;
  $("#checkout-summary").innerHTML = `<div class="eyebrow">FARE SUMMARY · SAMPLE ONLY</div><div class="fare-summary-row"><span>${search.passengers} passenger${search.passengers === 1 ? "" : "s"} × ${money(ride.fare)}</span><strong>${money(ride.fare * search.passengers)}</strong></div><div class="fare-summary-row"><span>Seat selection</span><strong>Included in sample</strong></div><div class="fare-summary-total"><span>Total payable <small>· not a live quote</small></span><strong>${money(ride.fare * search.passengers)}</strong></div><div class="payment-placeholder"><span class="payment-lock">▣</span><div><strong>Payment connection unavailable</strong><p>This demo cannot collect payment. Selecting “Record prototype booking” will save a local request as pending payment only.</p></div><span class="payment-tag">PLACEHOLDER</span></div>`;
  const form = $("#review-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const terms = $("#booking-terms");
    if (!terms.checked) { terms.focus(); showToast("Please confirm that you understand this is an illustrative, unpaid prototype booking.", "error"); return; }
    if (!passengers.length || seats.length !== search.passengers) { showToast("Complete passenger information and seat selection first.", "error"); return; }
    const booking = {
      reference: `AT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      createdAt: new Date().toISOString(), status: "Pending payment · prototype", paymentStatus: "Not paid · no payment integration",
      origin: ride.origin, destination: ride.destination, date: search.date, departure: ride.departure,
      vehicle: ride.name, vehicleId: ride.vehicleId, seats, passengers, farePerPassenger: ride.fare,
      passengerCount: search.passengers, total: ride.fare * search.passengers,
    };
    const bookings = read(KEYS.bookings, []); bookings.unshift(booking); save(KEYS.bookings, bookings);
    save(KEYS.currentBooking, booking);
    window.location.href = `confirmation.html?ref=${encodeURIComponent(booking.reference)}`;
  });
}
function renderConfirmation() {
  const root = $("#ticket-content"); if (!root) return;
  const reference = new URLSearchParams(window.location.search).get("ref");
  const booking = (reference && getBookingByRef(reference)) || read(KEYS.currentBooking, null);
  if (!booking) {
    root.innerHTML = `<div class="empty-state"><span class="empty-icon">▤</span><h1>No prototype booking found</h1><p>Complete the sample booking flow first. Any bookings saved in this demo are kept only in this browser.</p><a class="button button--primary" href="index.html#booking">Find a sample ride</a></div>`; return;
  }
  root.innerHTML = `<div class="ticket-shell"><div class="ticket-main"><div class="ticket-success"><span class="ticket-check">✓</span><div><span class="eyebrow">PROTOTYPE REQUEST RECORDED</span><h1>Your trip is ready to review.</h1><p>This is not a transport reservation or a payment confirmation.</p></div></div><div class="ticket-route"><div><span>FROM</span><strong>${escapeHTML(displayPlace(booking.origin))}</strong><small>${escapeHTML(booking.departure)}</small></div><div class="ticket-route-line"><i></i><span>ROAD JOURNEY</span><i></i></div><div><span>TO</span><strong>${escapeHTML(displayPlace(booking.destination))}</strong><small>${escapeHTML(displayDate(booking.date))}</small></div></div><div class="ticket-divider"><span></span></div><div class="ticket-data-grid"><div><span>PASSENGER${booking.passengers.length > 1 ? "S" : ""}</span><strong>${booking.passengers.map((item) => escapeHTML(item.name)).join(", ")}</strong></div><div><span>VEHICLE</span><strong>${escapeHTML(booking.vehicle)}</strong></div><div><span>SEAT${booking.seats.length > 1 ? "S" : ""}</span><strong>${booking.seats.map((seat) => `<span class="seat-number-tag">${seat}</span>`).join(" ")}</strong></div><div><span>TRAVEL DATE</span><strong>${escapeHTML(displayDate(booking.date))}</strong></div></div><div class="ticket-reference"><div><span>BOOKING REFERENCE</span><strong>${escapeHTML(booking.reference)}</strong></div><div class="status-pill status-pill--pending">${escapeHTML(booking.status)}</div></div></div><aside class="ticket-stub"><div class="ticket-stub-brand"><span class="brand-mark"><img src="assets/images/brand-mark.png" alt="" width="40" height="40"></span><strong>ALEESHA</strong></div><span class="eyebrow">ILLUSTRATIVE TOTAL</span><strong class="ticket-price">${money(booking.total)}</strong><span class="stub-small">${booking.passengerCount} passenger${booking.passengerCount === 1 ? "" : "s"} · payment not received</span><div class="stub-barcode" aria-hidden="true"></div><span class="stub-small">${escapeHTML(booking.reference)}</span></aside></div><div class="ticket-notice"><span>i</span><p><strong>Payment is still pending.</strong> This prototype cannot process payments, issue a valid travel ticket or confirm vehicle availability. Contact a verified operator before travelling.</p></div><div class="ticket-actions"><a class="button button--primary" href="my-bookings.html">View My Booking</a><button type="button" class="button button--outline" disabled title="Ticket download is not implemented">Print or Download <span class="future-tag">Future feature</span></button><a class="back-link" href="index.html">Back to Homepage</a></div>`;
}
function renderBookings() {
  const root = $("#bookings-list"); if (!root) return;
  const bookings = read(KEYS.bookings, []);
  const render = (tab = "upcoming") => {
    const filtered = bookings.filter((booking) => tab === "upcoming" ? /pending|prototype/i.test(booking.status) : booking.status.toLowerCase() === tab);
    root.innerHTML = filtered.length ? filtered.map((booking) => `<article class="booking-card"><div class="booking-card-top"><span class="eyebrow">REF ${escapeHTML(booking.reference)}</span><span class="status-pill status-pill--pending">${escapeHTML(booking.status)}</span></div><div class="booking-route"><strong>${escapeHTML(displayPlace(booking.origin))}</strong><span>→</span><strong>${escapeHTML(displayPlace(booking.destination))}</strong></div><div class="booking-summary"><span>${escapeHTML(displayDate(booking.date))} · ${escapeHTML(booking.departure)}</span><span>${escapeHTML(booking.vehicle)}</span><span>Seat${booking.seats.length === 1 ? "" : "s"} ${booking.seats.join(", ")}</span><strong>${money(booking.total)}</strong></div><a class="button button--outline button--small" href="confirmation.html?ref=${encodeURIComponent(booking.reference)}">View Details</a><p class="sample-note">Saved only in this browser · no live reservation or payment.</p></article>`).join("") : `<div class="empty-state"><span class="empty-icon">▤</span><h2>${tab === "upcoming" ? "No prototype journeys yet" : `No ${tab} sample trips`}</h2><p>${tab === "upcoming" ? "Once you complete the sample booking flow, your local prototype requests will appear here." : `There are no ${tab} bookings in this browser prototype.`}</p><a class="button button--primary" href="index.html#booking">Find a sample ride</a></div>`;
  };
  $$("[data-booking-tab]").forEach((button) => button.addEventListener("click", () => {
    $$("[data-booking-tab]").forEach((tab) => { tab.classList.toggle("is-active", tab === button); tab.setAttribute("aria-selected", String(tab === button)); });
    render(button.dataset.bookingTab);
  }));
  render("upcoming");
}
function renderReturn() {
  const form = $("#return-search-form"); if (!form) return;
  const cityOptions = destinations.map((item) => `<option value="${escapeHTML(item.name)}"></option>`).join("");
  $("#return-city-options").innerHTML = cityOptions;
  bindSearchForm(form, "return"); bindDateDefaults(form);
  const saved = getSearch();
  if (saved.direction === "return") {
    form.elements.from.value = saved.from || "Abuja";
    form.elements.date.value = saved.date || form.elements.date.value;
    form.elements.passengers.value = String(Math.min(6, saved.passengers || 1));
    form.elements.vehicle.value = saved.vehicle || "any";
  }
}
function renderFleet() {
  const root = $("#fleet-grid"); if (!root) return;
  root.innerHTML = vehicles.map((vehicle, index) => `<article class="fleet-card ${index === 0 ? "fleet-card--featured" : ""}"><a class="fleet-image" href="index.html#booking" data-fleet-select="${escapeHTML(vehicle.id)}"><img src="${vehicle.image}" alt="Illustrative ${escapeHTML(vehicle.name)} sample vehicle" loading="lazy"><span class="fleet-image-number">0${index + 1}</span></a><div class="fleet-card-content"><div><span class="eyebrow">${escapeHTML(vehicle.category.toUpperCase())} · ILLUSTRATIVE</span><h2>${escapeHTML(vehicle.name)}</h2></div><p>${escapeHTML(vehicle.description)}</p><div class="fleet-card-bottom"><span>Up to ${vehicle.capacity} illustrative seats</span><button class="text-button" type="button" data-fleet-select="${escapeHTML(vehicle.id)}">Select vehicle <span>→</span></button></div><small class="fleet-disclaimer">Vehicle photo and capacity are sample only.</small></div></article>`).join("");
  $$('[data-fleet-select]').forEach((button) => button.addEventListener("click", (event) => {
    event.preventDefault(); const search = getSearch(); search.vehicle = button.dataset.fleetSelect; save(KEYS.search, search); window.location.href = "search-results.html";
  }));
}
function init() {
  commonChrome();
  bindDateDefaults();
  const page = document.body.dataset.page;
  const renderers = { home: renderHome, results: renderResults, details: renderRideDetails, seats: renderSeats, passengers: renderPassengers, review: renderReview, confirmation: renderConfirmation, bookings: renderBookings, returning: renderReturn, fleet: renderFleet };
  renderers[page]?.();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
