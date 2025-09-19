import fetch from 'node-fetch';

/**
 * Get latitude and longitude using OpenStreetMap Nominatim API
 * @param name - location name / street
 * @param state - optional state / district
 * @param zipcode - optional postal code
 * @param country - default Bangladesh
 * @param limit - number of results to fetch, default 1
 * @returns { lat, lon, display_name, raw }
 */
export async function getLatLngByGoogle(
  name: string,
  state?: string,
  zipcode?: string,
  country: string = 'Bangladesh',
  limit: number = 1,
) {
  if (!name && !zipcode) {
    throw new Error('Provide at least name or zipcode');
  }

  const queryParts = [name, state, zipcode, country].filter(Boolean);
  const query = encodeURIComponent(queryParts.join(', '));

  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=${limit}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'my-geocoder-app/1.0 (your-email@example.com)', // polite usage
      'Accept-Language': 'en',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data) {
    throw new Error('No results found');
  }

  const top = data[0];

  return {
    lat: parseFloat(top.lat),
    lon: parseFloat(top.lon),
  };
}
