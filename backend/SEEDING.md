# Database Seeding

This backend includes database seeding functionality to populate the database with sample lab and equipment data.

## Seed Data

The seeding script will create:
- **6 Equipment Items**: 3D printer, laser cutter, CNC machine, oscilloscope, soldering station, and vinyl cutter
- **6 Lab Spaces**: Electronics lab, 3D printing workshop, fabrication lab, IoT lab, robotics workshop, and design studio

## Usage

### Automatic Seeding
When you start the server with `npm run dev` or `npm start`, the database will be automatically seeded if no items exist.

### Manual Seeding Commands

```bash
# Add items to database (skip if items already exist)
npm run seed

# Clear all items from database
npm run seed:clear

# Clear and recreate all items (useful for development)
npm run seed:reseed
```

## Data Structure

Each equipment item includes:
- Title and description
- Price per day
- Image URL
- Availability status

Each lab item includes:
- Name and description  
- Price per hour
- Student capacity
- Image URL
- Availability status

## Development Notes

- Seeds are skipped if items already exist in the database
- Images use Unsplash URLs for placeholder content
- Some items are marked as unavailable for testing purposes
- The seeding runs automatically on server startup after MongoDB connection is established

## Environment Requirements

Make sure your `.env` file includes:
```
MONGODB_URI=mongodb://localhost:27017/sif_fab_lab
# or your MongoDB Atlas connection string
```