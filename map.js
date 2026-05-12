import mapboxgl from 'https://cdn.jsdelivr.net/npm/mapbox-gl@2.15.0/+esm';

mapboxgl.accessToken = 'pk.eyJ1IjoiamF6ZWx5dG9uZyIsImEiOiJjbXAyNHhtZ2YwY2x3MnJxMm1lZGFzaHZ5In0.mCQyozrrTtID46miwkEaNg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-71.09415, 42.36027],
  zoom: 12,
  minZoom: 5,
  maxZoom: 18,
});