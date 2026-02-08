import { Item } from '../models/Item.js';

const equipmentData = [
  {
    title: "3D Printer - Ultimaker S3",
    type: "equipment",
    desc: "Professional 3D printer with dual extrusion capability for prototyping and manufacturing",
    pricePerDay: 45.00,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "Laser Cutting Machine",
    type: "equipment", 
    desc: "High-precision laser cutter for materials up to 10mm thickness",
    pricePerDay: 75.00,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "CNC Milling Machine",
    type: "equipment",
    desc: "Computer-controlled milling machine for precise metal and plastic fabrication",
    pricePerDay: 120.00,
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "Oscilloscope - Tektronix MSO4",
    type: "equipment",
    desc: "Mixed-signal oscilloscope for electronic circuit analysis and debugging",
    pricePerDay: 35.00,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "Soldering Station Pro",
    type: "equipment",
    desc: "Professional temperature-controlled soldering station with multiple tips",
    pricePerDay: 15.00,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=300&fit=crop",
    available: false
  },
  {
    title: "Vinyl Cutting Plotter",
    type: "equipment",
    desc: "Precision vinyl cutter for creating decals, stickers, and signage",
    pricePerDay: 25.00,
    image: "https://images.unsplash.com/photo-1581092918484-8d6c4b7b7c93?w=500&h=300&fit=crop",
    available: true
  }
];

const labData = [
  {
    title: "Electronics Lab",
    type: "lab",
    desc: "Fully equipped electronics lab with workbenches, power supplies, and testing equipment",
    pricePerHour: 20,
    capacity: "12 students",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "3D Printing Workshop",
    type: "lab", 
    desc: "Dedicated space for 3D printing projects with multiple printers and post-processing tools",
    pricePerHour: 25,
    capacity: "8 students",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "Fabrication Lab",
    type: "lab",
    desc: "Complete fabrication facility with CNC machines, laser cutters, and hand tools",
    pricePerHour: 35,
    capacity: "10 students", 
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "IoT Development Lab",
    type: "lab",
    desc: "Internet of Things development lab with microcontrollers, sensors, and networking equipment",
    pricePerHour: 18,
    capacity: "15 students",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
    available: true
  },
  {
    title: "Robotics Workshop",
    type: "lab",
    desc: "Robotics laboratory with programmable robots, sensors, and building materials",
    pricePerHour: 30,
    capacity: "10 students",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
    available: false
  },
  {
    title: "Design Studio",
    type: "lab",
    desc: "Creative design space with computers, graphics tablets, and visualization tools",
    pricePerHour: 15,
    capacity: "20 students",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=300&fit=crop",
    available: true
  }
];

export async function seedItems() {
  try {
    // Check if items already exist
    const existingItems = await Item.countDocuments();
    
    if (existingItems > 0) {
      console.log(`[SEED] ${existingItems} items already exist, skipping seed`);
      return;
    }

    // Seed equipment
    console.log('[SEED] Creating equipment items...');
    await Item.insertMany(equipmentData);
    console.log(`[SEED] Created ${equipmentData.length} equipment items`);

    // Seed labs
    console.log('[SEED] Creating lab items...');
    await Item.insertMany(labData);
    console.log(`[SEED] Created ${labData.length} lab items`);

    console.log('[SEED] Successfully seeded all items!');
    
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed items:', error);
  }
}

// Function to clear all items (useful for development)
export async function clearItems() {
  try {
    const result = await Item.deleteMany({});
    console.log(`[SEED] Cleared ${result.deletedCount} items from database`);
  } catch (error) {
    console.error('[SEED ERROR] Failed to clear items:', error);
  }
}

// Function to reseed (clear and create new)
export async function reseedItems() {
  try {
    await clearItems();
    await seedItems();
    console.log('[SEED] Items reseeded successfully!');
  } catch (error) {
    console.error('[SEED ERROR] Failed to reseed items:', error);
  }
}