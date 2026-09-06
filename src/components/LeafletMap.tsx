import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Property } from '../types';

interface LeafletMapProps {
  properties?: Property[];
  onSelectProperty?: (property: Property) => void;
  center?: [number, number];
  zoom?: number;
  interactiveSelect?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLat?: number;
  selectedLng?: number;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  properties = [],
  onSelectProperty,
  center = [20.5937, 78.9629], // India Center
  zoom = 5,
  interactiveSelect = false,
  onLocationSelect,
  selectedLat,
  selectedLng,
  height = '400px',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Map if not initialized
    if (!leafletInstance.current) {
      const map = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletInstance.current = map;
      markersLayer.current = L.layerGroup().addTo(map);

      if (interactiveSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          if (onLocationSelect) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
          }
        });
      }
    } else {
      leafletInstance.current.setView(center, zoom);
    }

    return () => {
      // Don't destroy map on minor rerenders, keep instance
    };
  }, [center, zoom, interactiveSelect]);

  // Update Markers
  useEffect(() => {
    if (!leafletInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    // Default icon
    const createCustomIcon = (status: string) => {
      let color = '#0284c7'; // blue
      if (status === 'TRANSFERRED' || status === 'APPROVED') color = '#059669'; // emerald
      if (status === 'PENDING_GOVERNMENT_APPROVAL') color = '#d97706'; // amber
      if (status === 'LISTED') color = '#4f46e5'; // indigo

      return L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); flex; items-center; justify-content: center;"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
    };

    properties.forEach((prop) => {
      if (prop.lat && prop.lng) {
        const marker = L.marker([prop.lat, prop.lng], {
          icon: createCustomIcon(prop.status),
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 font-sans text-xs';
        popupContent.innerHTML = `
          <div class="font-bold text-slate-900 text-sm mb-0.5">${prop.title}</div>
          <div class="text-amber-700 font-mono font-semibold mb-1">${prop.id}</div>
          <div class="text-slate-600 mb-1">${prop.city}, ${prop.state} • ${prop.area} ${prop.areaUnit}</div>
          <div class="text-slate-800 font-semibold mb-2">Owner: ${prop.currentOwner}</div>
          <button id="btn-map-view-${prop.id}" class="w-full bg-slate-900 text-white font-medium py-1 px-2 rounded text-[11px] hover:bg-slate-800">
            View Property Details
          </button>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-map-view-${prop.id}`);
          if (btn && onSelectProperty) {
            btn.onclick = () => onSelectProperty(prop);
          }
        });

        markersLayer.current?.addLayer(marker);
      }
    });

    // If interactive location select mode
    if (interactiveSelect && selectedLat && selectedLng) {
      const pinIcon = L.divIcon({
        className: 'selected-location-marker',
        html: `<div style="background-color: #dc2626; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 0 10px rgba(220,38,38,0.6);"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const selectedMarker = L.marker([selectedLat, selectedLng], { icon: pinIcon });
      markersLayer.current.addLayer(selectedMarker);
    }
  }, [properties, selectedLat, selectedLng, interactiveSelect, onSelectProperty]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 shadow-inner">
      <div ref={mapRef} style={{ height }} className="w-full z-10" />
    </div>
  );
};
