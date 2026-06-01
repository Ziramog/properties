/**
 * MapConfig
 * Standard map settings for all Mapbox instances across the app.
 * Import this in any component that renders <Map> to ensure consistent
 * scroll behavior, cooperative gestures, and attribution.
 */

export const MAP_STYLE = 'mapbox://styles/wolfim77/cmp93y2ft000s01qf5dxi9ar7';

export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const MAP_DEFAULT_PROPS = {
  scrollZoom: true,
  cooperativeGestures: true,
  attributionControl: false,
};
