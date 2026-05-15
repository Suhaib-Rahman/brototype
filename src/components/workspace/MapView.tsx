"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { useProjectStore } from "@/store/useProjectStore";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);
  
  const { coordinates, setCoordinates, setLocation } = useProjectStore();
  const lat = coordinates?.lat || 9.9312;
  const lng = coordinates?.lng || 76.2673;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);
      
      // Allow clicking on map to change location
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            const nameParts = data.display_name.split(',');
            const shortName = nameParts.length > 1 ? `${nameParts[0].trim()}, ${nameParts[1].trim()}` : nameParts[0];
            setLocation(shortName);
          } else {
            setLocation(`Custom Plot: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
        } catch {
          setLocation(`Custom Plot: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.setView([lat, lng], 14);

    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (polygonRef.current) {
      polygonRef.current.remove();
    }

    markerRef.current = L.marker([lat, lng]).addTo(map);
    
    // Draw polygon around the marker dynamically
    polygonRef.current = L.polygon([
      [lat + 0.0008, lng - 0.0006],
      [lat + 0.0008, lng + 0.0006],
      [lat - 0.0005, lng + 0.0006],
      [lat - 0.0005, lng - 0.0006]
    ], {
      color: "var(--accent)", fillColor: "var(--accent-dim)", fillOpacity: 0.3, weight: 2, dashArray: "8,6"
    }).addTo(map);

    const iconHtml = `
      <div class="pulse" style="width:28px;height:28px;background:var(--gradient-ai);border-radius:50%;border:4px solid white;box-shadow:var(--shadow-glow);"></div>
    `;
    const premiumIcon = L.divIcon({
      html: iconHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      className: "",
    });
    markerRef.current.setIcon(premiumIcon);

  }, [lat, lng, setCoordinates, setLocation]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%", background: "var(--surface-2)", zIndex: 1 }} />;
}
