// Import Mapbox as an ESM module
import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken =
  'pk.eyJ1IjoiamF6ZWx5dG9uZyIsImEiOiJjbXAyNHhtZ2YwY2x3MnJxMm1lZGFzaHZ5In0.mCQyozrrTtID46miwkEaNg';

// Create the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 5,
  maxZoom: 18,
});

// Select SVG overlay
const svg = d3.select('#map').select('svg');

// Convert longitude/latitude into pixel coordinates
function getCoords(station) {
  const point = new mapboxgl.LngLat(+station.lon, +station.lat);

  const { x, y } = map.project(point);

  return { cx: x, cy: y };
}

// Wait for the map to fully load before adding data
map.on('load', async () => {
  // Boston bike lanes
  map.addSource('boston_route', {
    type: 'geojson',
    data: 'https://bostonopendata-boston.opendata.arcgis.com/datasets/boston::existing-bike-network-2022.geojson',
  });

  map.addLayer({
    id: 'bike-lanes',
    type: 'line',
    source: 'boston_route',
    paint: {
      'line-color': '#32D400',
      'line-width': 5,
      'line-opacity': 0.6,
    },
  });

  // Cambridge bike lanes
  map.addSource('cambridge_route', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/cambridgegis/cambridgegis_data/main/Recreation/Bike_Facilities/RECREATION_BikeFacilities.geojson',
  });

  map.addLayer({
    id: 'cambridge-bike-lanes',
    type: 'line',
    source: 'cambridge_route',
    paint: {
      'line-color': '#32D400',
      'line-width': 5,
      'line-opacity': 0.6,
    },
  });

  // Load Bluebikes station data
  let jsonData;

  try {
    const jsonurl =
      'https://dsc106.com/labs/lab07/data/bluebikes-stations.json';

    jsonData = await d3.json(jsonurl);

    console.log('Loaded JSON Data:', jsonData);
  } catch (error) {
    console.error('Error loading JSON:', error);
  }

  let stations = jsonData.data.stations;

  console.log('Stations Array:', stations);

  // Add circles for stations
  const circles = svg
    .selectAll('circle')
    .data(stations)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('fill', 'steelblue')
    .attr('stroke', 'white')
    .attr('stroke-width', 1)
    .attr('opacity', 0.8);

  // Update circle positions
  function updatePositions() {
    circles
      .attr('cx', (d) => getCoords(d).cx)
      .attr('cy', (d) => getCoords(d).cy);
  }

  // Reposition circles when map changes
  map.on('move', updatePositions);
  map.on('zoom', updatePositions);
  map.on('resize', updatePositions);
  map.on('moveend', updatePositions);

  // Initial position update
  updatePositions();
});