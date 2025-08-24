# Sight Moon

A Next.js application that displays the moon's position in the sky using the API Verse moon position service. Features include geolocation detection, manual coordinate input, date selection, and a beautiful compass visualization.

## Features

- 🌍 **Geolocation**: Get your current location automatically
- 📍 **Manual Coordinates**: Enter latitude and longitude manually
- 📅 **Date Selection**: Choose any date to see moon position
- 🧭 **Compass Visualization**: Interactive compass showing moon direction
- 📊 **Moon Data**: Display altitude, distance, phase, and illumination
- 🎨 **Modern UI**: Beautiful dark theme with shadcn/ui components
- 🔒 **Secure API**: Server-side API calls with environment variables

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **API**: API Verse Moon Position Service

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

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   API_VERSE_API_KEY=your_api_key_here
   ```
   
   Get your API key from [API Verse](https://apiverve.com/)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Get Current Location**: Click the "Get Current Location" button to automatically detect your coordinates
2. **Manual Coordinates**: Enter latitude and longitude manually if geolocation is not available
3. **Select Date**: Use the date picker to choose any date (defaults to current date)
4. **View Moon Data**: The app will automatically fetch and display:
   - Moon direction (azimuth) on the compass
   - Altitude above the horizon
   - Distance from Earth
   - Moon phase
   - Illumination percentage

## API Endpoints

- `GET /api/moon-position?lat={latitude}&lon={longitude}&date={MM-DD-YYYY}`
  - Returns moon position data for the specified location and date
  - Requires valid API key in environment variables

## Project Structure

```
src/
├── app/
│   ├── api/moon-position/
│   │   └── route.ts          # API route for moon position
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── Compass.tsx           # Custom compass component
└── lib/
    └── utils.ts              # Utility functions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_VERSE_API_KEY` | Your API Verse API key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
