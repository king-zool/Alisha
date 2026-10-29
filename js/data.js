export const AUSU = "Al-Istiqama University, Sumaila";
export const AUSU_SHORT = "AUSU, Sumaila";

export const destinations = [
  { name: "Kano", fare: 8500, hours: 2.5 },
  { name: "Kaduna", fare: 12000, hours: 4.5 },
  { name: "Abuja", fare: 18000, hours: 6 },
  { name: "Jos", fare: 16500, hours: 5.5 },
  { name: "Katsina", fare: 12000, hours: 4 },
  { name: "Bauchi", fare: 15000, hours: 5 },
  { name: "Lagos", fare: 40000, hours: 14 },
];

export const vehicles = [
  {
    id: "standard-bus", name: "Standard Bus", category: "Bus", label: "Standard coach",
    capacity: 30, multiplier: 1, seats: 30,
    image: "/manus-storage/async-images/iIlir6gQMFy5QeFCYS3VEk/image-2.webp",
    description: "A practical, shared coach option for longer student journeys.",
    features: ["Shared coach", "Luggage space", "Air conditioning*"],
    layout: "standard",
  },
  {
    id: "luxury-bus", name: "Luxury Bus", category: "Luxury Bus", label: "Premium coach",
    capacity: 27, multiplier: 1.45, seats: 27,
    image: "/manus-storage/async-images/iIlir6gQMFy5QeFCYS3VEk/image-3.webp",
    description: "A premium coach layout for students who prefer extra room.",
    features: ["Premium seating*", "Luggage bay*", "Air conditioning*"],
    layout: "luxury",
  },
  {
    id: "toyota-sienna", name: "Toyota Sienna", category: "Toyota Sienna", label: "Passenger minivan",
    capacity: 7, multiplier: 1.8, seats: 7,
    image: "/manus-storage/async-images/iIlir6gQMFy5QeFCYS3VEk/image-4.webp",
    description: "A small-group passenger minivan for shared road travel.",
    features: ["Small-group seating", "Luggage space*", "Air conditioning*"],
    layout: "sienna",
  },
  {
    id: "toyota-hiace", name: "Toyota Hiace", category: "Toyota Hiace", label: "Passenger minibus",
    capacity: 12, multiplier: 1.55, seats: 12,
    image: "/manus-storage/async-images/iIlir6gQMFy5QeFCYS3VEk/image-5.webp",
    description: "A high-roof passenger minibus for students travelling together.",
    features: ["Passenger minibus", "Luggage area*", "Air conditioning*"],
    layout: "hiace",
  },
  {
    id: "suv", name: "SUV", category: "SUV", label: "Passenger SUV",
    capacity: 4, multiplier: 2.15, seats: 4,
    image: "/manus-storage/async-images/RgZiteXsBlOCFDgvs0vgk5/image-1.webp",
    description: "A compact vehicle option for a small group.",
    features: ["Small-group seating", "Air conditioning*", "Seatbelts*"],
    layout: "suv",
  },
  {
    id: "executive-car", name: "Executive Car", category: "Executive Car", label: "Executive saloon",
    capacity: 3, multiplier: 2.45, seats: 3,
    image: "/manus-storage/async-images/RgZiteXsBlOCFDgvs0vgk5/image-2.webp",
    description: "An executive-style car option for a very small group.",
    features: ["Small-group seating", "Air conditioning*", "Seatbelts*"],
    layout: "executive",
  },
];

export const seatLayouts = {
  standard: {
    name: "Standard coach", driverLabel: "Driver", rows: [
      [1, 2, "aisle", 3, 4], [5, 6, "aisle", 7, 8], [9, 10, "aisle", 11, 12],
      [13, 14, "aisle", 15, 16], [17, 18, "aisle", 19, 20], [21, 22, "aisle", 23, 24],
      [25, 26, "aisle", 27, 28], [29, 30],
    ], unavailable: [3, 4, 6, 7, 8, 10, 12, 14, 15, 16, 18, 20, 22, 24, 26, 27, 28, 29],
  },
  luxury: {
    name: "Luxury coach", driverLabel: "Driver", rows: [
      [1, "aisle", 2, 3], [4, "aisle", 5, 6], [7, "aisle", 8, 9],
      [10, "aisle", 11, 12], [13, "aisle", 14, 15], [16, "aisle", 17, 18],
      [19, "aisle", 20, 21], [22, "aisle", 23, 24], [25, "aisle", 26, 27],
    ], unavailable: [2, 4, 5, 6, 7, 8, 10, 11, 12, 14, 16, 17, 18, 20, 22, 23, 24, 26, 27],
  },
  sienna: {
    name: "Sienna", driverLabel: "Driver", rows: [[1], [2, 3, 4], [5, 6, 7]], unavailable: [4, 7],
  },
  hiace: {
    name: "Hiace", driverLabel: "Driver", rows: [
      [1, 2, "aisle"], [3, 4, "aisle"], [5, 6, "aisle"],
      [7, 8, "aisle"], [9, 10, "aisle"], [11, 12],
    ], unavailable: [2, 3, 5, 9, 10],
  },
  suv: {
    name: "SUV", driverLabel: "Driver", rows: [[1], [2, 3, 4]], unavailable: [2, 4],
  },
  executive: {
    name: "Executive car", driverLabel: "Driver", rows: [[1], [2, 3]], unavailable: [2, 3],
  },
};

export function makeRides(search) {
  const destinationName = search.direction === "return" ? "Sumaila" : (search.to || "Abuja");
  const originName = search.direction === "return" ? (search.from || "Abuja") : AUSU;
  const route = destinations.find((item) => destinationName.toLowerCase().includes(item.name.toLowerCase()))
    || destinations.find((item) => originName.toLowerCase().includes(item.name.toLowerCase()))
    || destinations[2];
  const returnTrip = search.direction === "return";
  const times = returnTrip ? ["06:30", "08:00", "10:15", "13:00", "15:30", "17:15"] : ["06:45", "08:30", "10:00", "12:20", "15:00", "17:30"];
  return vehicles.map((vehicle, index) => {
    const fare = Math.round((route.fare * vehicle.multiplier * (returnTrip ? 1.04 : 1)) / 100) * 100;
    return {
      ...vehicle,
      id: `${vehicle.id}-${returnTrip ? "return" : "home"}`,
      vehicleId: vehicle.id,
      origin: originName,
      destination: destinationName === "Sumaila" ? AUSU : destinationName,
      departure: times[index],
      duration: `${Math.floor(route.hours)}h ${Math.round((route.hours % 1) * 60)}m`,
      pickup: returnTrip ? `${originName} — sample pickup point` : "AUSU main gate area — pickup point to be confirmed",
      dropoff: returnTrip ? "Al-Istiqama University, Sumaila — sample drop-off" : `${destinationName} — sample drop-off point`,
      fare,
      available: Math.max(1, Math.min(vehicle.seats, [12, 8, 5, 7, 2, 1][index])),
      illustrative: true,
    };
  });
}
