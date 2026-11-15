'use client';
import { useEffect, useState } from 'react';
import { Activity, ArrowDown, ArrowUp, CloudSun, Droplets, Gauge, RefreshCw, Wind } from 'lucide-react';
import { aqiLabel, condition, type CityWeather } from '../lib/weather';

type Payload = { cities: CityWeather[]; updatedAt: string };
function temp(n: number, fahrenheit: boolean) { return `${Math.round(fahrenheit ? n * 9 / 5 + 32 : n)}°`; }
function dayLabel(date: string, zone: string) { return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: zone }).format(new Date(`${date}T12:00:00Z`)); }
function dateLabel(date: string) { return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); }
function hourLabel(value: string) { return value?.split('T')[1] ?? '—'; }
function dailyAqi(data: CityWeather, date: string): number | null {
  const hourly = data.air.hourly;
  if (!hourly) return null;
  const samples = hourly.time.flatMap((t, i) => t.startsWith(date) && hourly.us_aqi[i] != null ? [hourly.us_aqi[i] as number] : []);
  return samples.length ? Math.round(Math.max(...samples)) : null;
}
function Trend({ values }: { values: number[] }) {
  const width = 680, height = 140, pad = 16;
  const min = Math.min(...values) - 2, max = Math.max(...values) + 2;
  const pts = values.map((v, i) => `${pad + i * (width - pad * 2) / (values.length - 1)},${height - pad - (v - min) / (max - min || 1) * (height - pad * 2)}`).join(' ');
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Seven-day maximum temperature trend" className="trend"><line x1="0" y1="110" x2={width} y2="110" stroke="#dce7ef" strokeDasharray="5 6"/><polyline points={pts} fill="none" stroke="#4c85e8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>{values.map((v, i) => { const x = pad + i * (width - pad * 2) / (values.length - 1), y = height - pad - (v - min) / (max - min || 1) * (height - pad * 2); return <g key={i}><circle cx={x} cy={y} r="5" fill="#4c85e8" stroke="white" strokeWidth="2"/><text x={x} y={Math.max(12, y - 12)} textAnchor="middle" fontSize="14" fill="#38567e">{Math.round(v)}°</text></g>; })}</svg>;
}
export default function Home() {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [fahrenheit, setFahrenheit] = useState(false);
  const [selected, setSelected] = useState('pune');
  async function refresh() {
    setLoading(true); setError('');
    try { const res = await fetch('/api/weather', { cache: 'no-store' }); const json = await res.json(); if (!res.ok) throw new Error(json.error || 'Could not fetch weather'); setPayload(json); }
    catch (e) { setError(e instanceof Error ? e.message : 'An unexpected error occurred'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  const active = payload?.cities.find(x => x.city.id === selected) ?? payload?.cities[0];
  return <main className="shell">
    <header className="topbar"><div className="brand"><div className="brand-icon"><CloudSun size={27}/></div><div><strong>skyline</strong><span>WEATHER INTELLIGENCE</span></div></div><div className="top-actions"><div className="unit-toggle"><button className={!fahrenheit ? 'active' : ''} onClick={() => setFahrenheit(false)}>°C</button><button className={fahrenheit ? 'active' : ''} onClick={() => setFahrenheit(true)}>°F</button></div><button className="refresh" onClick={() => void refresh()} disabled={loading}><RefreshCw size={17} className={loading ? 'spin' : ''}/> Refresh</button></div></header>
    <section className="intro"><div className="eyebrow">YOUR GLOBAL WEATHER OUTLOOK</div><h1>Weather, beautifully clear<span>.</span></h1><p>Seven-day forecasts and air quality insights for your favorite cities.</p></section>
    {error && <div className="error" role="alert">{error} <button onClick={() => void refresh()}>Try again</button></div>}
    {!payload && loading && <div className="loading">Loading live weather forecasts…</div>}
    {payload && <><div className="section-head"><h2>City overview</h2><span>Live conditions · 3 cities</span></div><div className="city-grid">{payload.cities.map(data => { const { city, forecast, air } = data; const weather = condition(forecast.current.weather_code), aqi = air.current?.us_aqi, status = aqiLabel(aqi); return <button key={city.id} className={`city-card ${selected === city.id ? 'selected' : ''}`} onClick={() => setSelected(city.id)}><div className="city-card-head"><div><h3>{city.name}</h3><span>{city.country}</span></div><span className="weather-emoji">{weather.icon}</span></div><div className="current-temp">{temp(forecast.current.temperature_2m, fahrenheit)}</div><div className="condition">{weather.label}</div><div className="high-low"><ArrowUp size={15}/>{temp(forecast.daily.temperature_2m_max[0], fahrenheit)} <ArrowDown size={15}/>{temp(forecast.daily.temperature_2m_min[0], fahrenheit)}</div><div className="card-divider"/><div className="mini-stats"><div><Droplets size={17}/><span>Humidity</span><strong>{forecast.current.relative_humidity_2m}%</strong></div><div><Wind size={17}/><span>Wind</span><strong>{Math.round(forecast.current.wind_speed_10m)} km/h</strong></div></div><div className="aqi-strip"><div><Gauge size={16}/> Air Quality Index</div><div><strong>{aqi ?? '—'}</strong><span className={`aqi-pill ${status.tone}`}>{status.label}</span></div></div></button>; })}</div>
    {active && <section className="details"><div className="section-head details-heading"><div><div className="eyebrow">DETAILED FORECAST</div><h2>{active.city.name} · Next 7 days</h2></div><span>Local dates · {active.city.zone.replace('_', ' ')}</span></div><div className="trend-card"><div className="trend-header"><div><Activity size={19}/><strong>Temperature trend</strong></div><span>Daily high · {fahrenheit ? '°F' : '°C'}</span></div><Trend values={active.forecast.daily.temperature_2m_max.map(n => fahrenheit ? n * 9 / 5 + 32 : n)}/><div className="trend-labels">{active.forecast.daily.time.map(d => <span key={d}>{dayLabel(d, active.city.zone)}</span>)}</div></div><div className="forecast-table-wrap"><table className="forecast-table"><thead><tr><th>Day</th><th>Conditions</th><th>High / Low</th><th>Humidity</th><th>Rain chance</th><th>Rainfall</th><th>AQI (US)</th></tr></thead><tbody>{active.forecast.daily.time.map((date, i) => { const weather = condition(active.forecast.daily.weather_code[i]); const aqi = dailyAqi(active, date); const status = aqiLabel(aqi); return <tr key={date}><td><strong>{i === 0 ? 'Today' : dayLabel(date, active.city.zone)}</strong><small>{dateLabel(date)}</small></td><td><span className="table-emoji">{weather.icon}</span>{weather.label}</td><td><strong>{temp(active.forecast.daily.temperature_2m_max[i], fahrenheit)}</strong> / {temp(active.forecast.daily.temperature_2m_min[i], fahrenheit)}</td><td>{active.forecast.daily.relative_humidity_2m_mean[i] ?? '—'}%</td><td>{active.forecast.daily.precipitation_probability_max[i] ?? '—'}%</td><td>{active.forecast.daily.precipitation_sum[i]} mm</td><td><span className={`aqi-pill ${status.tone}`}>{aqi ?? '—'} · {status.label}</span></td></tr>; })}</tbody></table></div><div className="more-info"><div><span>Feels like now</span><strong>{temp(active.forecast.current.apparent_temperature, fahrenheit)}</strong></div><div><span>Today's UV index</span><strong>{active.forecast.daily.uv_index_max[0]}</strong></div><div><span>Sunrise</span><strong>{hourLabel(active.forecast.daily.sunrise[0])}</strong></div><div><span>Sunset</span><strong>{hourLabel(active.forecast.daily.sunset[0])}</strong></div><div><span>PM2.5 now</span><strong>{active.air.current?.pm2_5 ?? '—'} µg/m³</strong></div></div></section>}
    <footer><span>Weather and AQI data by Open-Meteo · Daily AQI represents the highest forecast hourly US AQI for each day.</span><span>Updated {new Date(payload.updatedAt).toLocaleString()}</span></footer></>}
  </main>;
}
