export const cities = [
  { id: 'pune', name: 'Pune', country: 'India', lat: 18.5204, lon: 73.8567, zone: 'Asia/Kolkata' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, zone: 'Asia/Dubai' },
  { id: 'new-york', name: 'New York', country: 'USA', lat: 40.7128, lon: -74.006, zone: 'America/New_York' },
] as const;
export type City = (typeof cities)[number];
export type Forecast = {
  current: { temperature_2m: number; relative_humidity_2m: number; apparent_temperature: number; weather_code: number; wind_speed_10m: number; is_day: number };
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: (number|null)[]; precipitation_sum: number[]; relative_humidity_2m_mean: (number|null)[]; sunrise: string[]; sunset: string[]; uv_index_max: number[]; wind_speed_10m_max: number[] };
};
export type AirQuality = { current?: { us_aqi?: number; pm2_5?: number; pm10?: number }; hourly?: { time: string[]; us_aqi: (number|null)[] } };
export type CityWeather = { city: City; forecast: Forecast; air: AirQuality };
export function condition(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Clear sky', icon: '☀️' };
  if (code <= 2) return { label: 'Partly cloudy', icon: '🌤️' };
  if (code === 3) return { label: 'Overcast', icon: '☁️' };
  if (code <= 48) return { label: 'Foggy', icon: '🌫️' };
  if (code <= 57) return { label: 'Drizzle', icon: '🌦️' };
  if (code <= 67) return { label: 'Rainy', icon: '🌧️' };
  if (code <= 77) return { label: 'Snowy', icon: '❄️' };
  if (code <= 82) return { label: 'Showers', icon: '🌦️' };
  if (code <= 86) return { label: 'Snow showers', icon: '🌨️' };
  return { label: 'Thunderstorms', icon: '⛈️' };
}
export function aqiLabel(aqi?: number | null): { label: string; tone: string } {
  if (aqi == null) return { label: 'Unavailable', tone: 'unknown' };
  if (aqi <= 50) return { label: 'Good', tone: 'good' };
  if (aqi <= 100) return { label: 'Moderate', tone: 'moderate' };
  if (aqi <= 150) return { label: 'Unhealthy for sensitive groups', tone: 'sensitive' };
  if (aqi <= 200) return { label: 'Unhealthy', tone: 'unhealthy' };
  if (aqi <= 300) return { label: 'Very unhealthy', tone: 'very-unhealthy' };
  return { label: 'Hazardous', tone: 'hazardous' };
}
