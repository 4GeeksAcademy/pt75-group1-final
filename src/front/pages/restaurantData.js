import r1_1 from "../assets/img/restaurants/r1/r1-1.jpg";
import r1_2 from "../assets/img/restaurants/r1/r1-2.jpg";
import r1_3 from "../assets/img/restaurants/r1/r1-3.jpg";
import r1_4 from "../assets/img/restaurants/r1/r1-4.jpg";
import r1_5 from "../assets/img/restaurants/r1/r1-5.jpg";

import r2_1 from "../assets/img/restaurants/r2/r2-1.jpg";
import r2_2 from "../assets/img/restaurants/r2/r2-2.jpg";
import r2_3 from "../assets/img/restaurants/r2/r2-3.jpg";
import r2_4 from "../assets/img/restaurants/r2/r2-4.jpg";
import r2_5 from "../assets/img/restaurants/r2/r2-5.jpg";

import r3_1 from "../assets/img/restaurants/r3/r3-1.jpg";
import r3_2 from "../assets/img/restaurants/r3/r3-2.jpg";
import r3_3 from "../assets/img/restaurants/r3/r3-3.jpg";
import r3_4 from "../assets/img/restaurants/r3/r3-4.jpg";
import r3_5 from "../assets/img/restaurants/r3/r3-5.jpg";

import r4_1 from "../assets/img/restaurants/r4/r4-1.jpg";
import r4_2 from "../assets/img/restaurants/r4/r4-2.jpg";
import r4_3 from "../assets/img/restaurants/r4/r4-3.jpg";
import r4_4 from "../assets/img/restaurants/r4/r4-4.jpg";
import r4_5 from "../assets/img/restaurants/r4/r4-5.jpg";

import r5_1 from "../assets/img/restaurants/r5/r5-1.jpg";
import r5_2 from "../assets/img/restaurants/r5/r5-2.jpg";
import r5_3 from "../assets/img/restaurants/r5/r5-3.jpg";
import r5_4 from "../assets/img/restaurants/r5/r5-4.jpg";
import r5_5 from "../assets/img/restaurants/r5/r5-5.jpg";




export const restaurantData = {
  r1: {
    name: "COTE Miami",
    cuisine: "🥩 Korean BBQ",
    price: "$$$",
    rating: 4.7,
    openNow: true,
    location: "📍 3900 NE 2nd Ave, Miami, FL",
    hours: "🕒 Open Daily: 5pm – 11pm",
    images: [r1_1, r1_2, r1_3, r1_4, r1_5],
    description:
      "COTE Miami blends the precision and quality of Korean BBQ with the elegance of a modern steakhouse. Featuring American Wagyu, premium USDA Prime cuts, and tableside grilling by expert staff, it’s an experience that balances bold flavor with upscale flair.",
    popularDishes: [
      "🥩 USDA Prime Ribeye",
      "🔥 Wagyu Hanger Steak",
      "🍚 Kimchi Fried Rice",
    ],
    amenities: [
      "🥩 Tableside Grilling",
      "🍷 Wine Pairing",
      "🌟 Chef’s Omakase",
    ],
  },
r2: {
    name: "Agliolio",
    cuisine: "🍝 Italian",
    price: "$$",
    rating: 4.3,
    openNow: true,
    location: "📍 12795 W Forest Hill Blvd, Wellington, FL",
    hours: "🕒 Mon–Sun: 11:30am – 9pm",
    images: [r2_1, r2_2, r2_3, r2_4, r2_5],
    description:
      "Agliolio is a cozy Italian kitchen known for generous portions, customizable pasta dishes, and homey vibes. It's a go-to spot for locals seeking comfort food without breaking the bank.",
    popularDishes: [
      "🍞 Garlicky Bruschetta Mozzarella Toast",
      "🐓 Chicken Saltimbocca",
      "🍝 Penne with Sunday Gravy",
    ],
    amenities: [
      "🥖 Fresh Baked Bread",
      "🍝 Build-Your-Own Pasta",
      "🎵 Casual Vibes",
    ],
  },
  r3: {
    name: "1000 NORTH",
    cuisine: "🥩 American Fine Dining",
    price: "$$$$",
    rating: 4.8,
    openNow: false,
    location: "📍 1000 North U.S. Highway 1, Jupiter, FL",
    hours: "🕒 Wed–Sun: 5pm – 10pm",
    images: [r3_1, r3_2, r3_3, r3_4, r3_5],
    description:
      "1000 NORTH is a luxurious waterfront restaurant offering elevated American cuisine with breathtaking views of the Jupiter Lighthouse. With multiple dining areas, including outdoor, bar, and formal seating, it’s a destination for upscale food and atmosphere.",
    popularDishes: [
      "🍖 Colorado Lamb Chops",
      "🥩 Ribeye with Bordelaise",
      "🥬 Wedge Salad with Pancetta",
    ],
    amenities: [
      "🍞 Truffle Butter Bread Service",
      "🌅 Waterfront View",
      "🍽 Indoor & Outdoor Seating",
    ],
  },
  r4: {
    name: "Common Grounds Brew & Roastery",
    cuisine: "☕ Coffee & Breakfast",
    price: "$",
    rating: 4.6,
    openNow: true,
    location: "📍 103 S Main Street, Delray Beach, FL",
    hours: "🕒 Daily: 7am – 4pm",
    images: [r4_1, r4_2, r4_3, r4_4, r4_5],
    description:
      "Common Grounds is a cozy neighborhood coffee spot known for its friendly atmosphere, customizable breakfast sandwiches, and excellent coffee. It’s a casual space where locals work, relax, and enjoy a good cup of joe.",
    popularDishes: [
      "🥪 Custom Breakfast Sandwich",
      "☕ Signature Brew Coffee",
      "🥐 Pastry of the Day",
    ],
    amenities: [
      "💻 Free Wi-Fi",
      "🪑 Mixed Indoor Seating",
      "☀️ Outdoor Tables Available",
    ],
  },
  
  r5: {
    name: "City Oyster & Sushi Bar",
    cuisine: "🍣 Seafood & Sushi",
    price: "$$$",
    rating: 4.5,
    openNow: true,
    location: "📍 213 E Atlantic Ave, Delray Beach, FL",
    hours: "🕒 Sun–Thu: 11:30am–10pm • Fri–Sat: 11:30am–11pm",
    images: [r5_1, r5_2, r5_3, r5_4, r5_5],
    description:
      "City Oyster is a vibrant seafood and sushi destination offering a wide-ranging menu in a bustling, upscale setting. Known for its fresh fish, creative rolls, and iconic key lime pie, it's a local favorite for celebrations and weekend dinners.",
    popularDishes: [
      "🦪 Mussels in Garlic Broth",
      "🍣 Chirashi Sushi Bowl",
      "🐟 Sweet Potato Crusted Mahi",
    ],
    amenities: [
      "🎂 Birthday Treats",
      "🍸 Full Cocktail Bar",
      "📦 Takeout & Delivery",
    ],
  },
};  