import { NextResponse } from 'next/server';
import { cities, type CityWeather } from '../../../lib/weather';
export const revalidate = 900;
async function getJson(url: string) {
  const response = await fetch(url, { next: { revalidate: 900 } });
  if (!response.ok) throw new Error(`Weather provider error (${response.status})`);
  return response.json();
}
export async function GET() {
  try {
    const results: CityWeather[] = await Promise.all(cities.map(async (city) => {
      const coords = `latitude=${city.lat}&longitude=${city.lon}`;
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?${coords}&timezone=${encodeURIComponent(city.zone)}&forecast_days=7&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,relative_humidity_2m_mean,sunrise,sunset,uv_index_max,wind_speed_10m_max`;
      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?${coords}&timezone=${encodeURIComponent(city.zone)}&current=us_aqi,pm2_5,pm10&hourly=us_aqi&forecast_days=7`;
      const [forecast, air] = await Promise.all([getJson(weatherUrl), getJson(airUrl).catch(() => ({}))]);
      return { city, forecast, air };
    }));
    return NextResponse.json({ cities: results, updatedAt: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load forecast' }, { status: 502 });
  }
}
