# Sight Moon

A Next.js application that displays the moon's position in the sky using the SunCalc library. Features include geolocation detection, manual coordinate input, date selection, and a real compass that rotates with your device.

## Features

- 🌍 **Geolocation**: Get your current location automatically
- 📍 **Manual Coordinates**: Enter latitude and longitude manually
- 📅 **Date Selection**: Choose any date to see moon position (with real-time accuracy when viewing today)
- 🧭 **Real Compass**: Device orientation support—hold your phone and the compass points toward geographic north
- 📊 **Moon Data**: Altitude, azimuth, distance, and cardinal direction
- 🎨 **Modern UI**: Beautiful dark theme with shadcn/ui components
- 📱 **No API Key**: Moon position computed client-side with SunCalc—works offline

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Moon Calculations**: SunCalc (client-side, no API key)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sight-moon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Get Current Location**: Click the "Get Current Location" button to automatically detect your coordinates
2. **Manual Coordinates**: Enter latitude and longitude manually if geolocation is not available
3. **Select Date**: Use the date picker to choose any date (defaults to current date)
4. **View Moon Data**: The app will automatically compute and display:
   - Moon direction (azimuth) on the compass
   - Altitude above the horizon
   - Distance from Earth
5. **On mobile**: Tap "Enable compass" to use device orientation—the compass will rotate so North aligns with geographic north

## Project Structure

```
src/
├── app/
│   ├── api/moon-position/
│   │   └── route.ts          # Optional API route (legacy)
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── Compass.tsx           # Compass with device orientation
├── hooks/
│   └── useDeviceOrientation.ts
└── lib/
    └── utils.ts              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
