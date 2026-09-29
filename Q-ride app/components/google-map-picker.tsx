'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

declare global { interface Window { google?: any; qRideGoogleMapsLoading?: Promise<void>; } }
type Props = { pickup: string; destination: string; onPickup: (value: string) => void; onDestination: (value: string) => void; };

function loadGoogleMaps() {
  if (window.google?.maps?.places) return Promise.resolve();
  if (window.qRideGoogleMapsLoading) return window.qRideGoogleMapsLoading;
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) return Promise.reject(new Error('missing-key'));
  window.qRideGoogleMapsLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
    script.async = true; script.onload = () => resolve(); script.onerror = () => reject(new Error('load-failed'));
    document.head.appendChild(script);
  });
  return window.qRideGoogleMapsLoading;
}

export function GoogleMapPicker({ pickup, destination, onPickup, onDestination }: Props) {
  const mapElement = useRef<HTMLDivElement>(null); const pickupInput = useRef<HTMLInputElement>(null); const destinationInput = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  useEffect(() => {
    let mounted = true;
    loadGoogleMaps().then(() => {
      if (!mounted || !window.google || !mapElement.current || !pickupInput.current || !destinationInput.current) return;
      const maps = window.google.maps; const center = { lat: 6.4281, lng: 3.4219 };
      const map = new maps.Map(mapElement.current, { center, zoom: 12, disableDefaultUI: true, zoomControl: true, styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }] });
      const bounds = new maps.LatLngBounds(); const markers: any[] = [];
      const setPlace = (input: HTMLInputElement, callback: (value: string) => void, color: string) => {
        const autocomplete = new maps.places.Autocomplete(input, { fields: ['formatted_address', 'geometry', 'name'], componentRestrictions: { country: 'ng' } });
        autocomplete.addListener('place_changed', () => { const place = autocomplete.getPlace(); const value = place.formatted_address || place.name; if (!value) return; callback(value); if (place.geometry?.location) { const marker = new maps.Marker({ map, position: place.geometry.location, icon: { path: maps.SymbolPath.CIRCLE, scale: 8, fillColor: color, fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 } }); markers.push(marker); bounds.extend(place.geometry.location); if (markers.length > 1) map.fitBounds(bounds, 55); else map.setCenter(place.geometry.location); } });
      };
      setPlace(pickupInput.current, onPickup, '#0e4a3c'); setPlace(destinationInput.current, onDestination, '#f26145'); setStatus('ready');
    }).catch(() => mounted && setStatus('unavailable'));
    return () => { mounted = false; };
  }, [onDestination, onPickup]);
  return <div className="map-picker"><div ref={mapElement} className="google-map" aria-label="Google map"><div className="map-placeholder"><Navigation size={21}/><b>{status === 'loading' ? 'Loading Google Maps…' : 'Add a Google Maps key to enable live location search'}</b><span>Search pickup and destination to set your route.</span></div></div><div className="locations map-locations"><label><span className="pickup-dot"/><input ref={pickupInput} aria-label="Pickup" value={pickup} onChange={e => onPickup(e.target.value)} placeholder="Pickup location"/></label><div className="route-dots"/><label><MapPin size={18}/><input ref={destinationInput} aria-label="Destination" value={destination} onChange={e => onDestination(e.target.value)} placeholder="Where to?"/></label></div>{status === 'ready' && <p className="map-status"><MapPin size={14}/> Powered by Google Maps · Nigeria results prioritized</p>}</div>;
}
