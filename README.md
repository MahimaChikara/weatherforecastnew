# Skyline — 7-Day Weather & Air Quality Dashboard

A responsive Next.js dashboard showing **Pune, Dubai, and New York** with seven-day weather forecasts, humidity, and US Air Quality Index (AQI). Built for **GitHub + Vercel**.

## Features
- Current temperature, conditions, humidity, wind, today's high and low
- Seven-day daily high/low, precipitation chance, rainfall, humidity, weather conditions
- Daily forecast AQI (maximum hourly US AQI per local day), current AQI and PM2.5
- Temperature trend chart, Celsius/Fahrenheit toggle, selectable city cards
- Sunrise, sunset, UV index and feels-like temperature
- Responsive desktop and mobile layout; manual refresh

## Run locally

1. Install Node.js 20 or later.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit http://localhost:3000.

## Deploy with GitHub + Vercel

1. Create a new GitHub repository.
2. Upload the **contents** of this folder to the repository root (including `package.json` and `app/`).
3. Visit https://vercel.com/new and import the repository.
4. Keep the detected **Next.js** framework and default build settings.
5. Click **Deploy**. No API key or environment variables are required.

## Data source

Uses [Open-Meteo Forecast API](https://open-meteo.com/en/docs) and [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api), accessed through the Next.js server route `/api/weather`. Server fetches are cached for 15 minutes. AQI is **US AQI**, not India's national AQI; the two scales are not interchangeable. Daily AQI is the maximum available forecast hourly AQI on each local date; it is not a 24-hour average. Weather and AQI are forecasts/model estimates and may differ from local monitoring stations. Air quality is gracefully marked unavailable if that service fails.

Open-Meteo's free non-commercial API is subject to its terms and limits. Review licensing for commercial or high-traffic use.

## Notes

The three cities are configured in `lib/weather.ts`. Change the city coordinates and IANA timezone there to customize the dashboard. The app needs internet access for live data.
