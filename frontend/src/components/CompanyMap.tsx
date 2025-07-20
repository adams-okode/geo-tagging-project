/**
 * Company Map Component using React Leaflet.
 */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Company } from '@/types/company';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CompanyMapProps {
    companies: Company[];
    onMarkerClick?: (company: Company) => void;
    center?: [number, number];
    zoom?: number;
}

// Component to handle map updates when companies change
function MapUpdater({ companies }: { companies: Company[] }) {
    const map = useMap();

    useEffect(() => {
        if (companies.length > 0) {
            const bounds = L.latLngBounds(
                companies.map(company => [company.latitude, company.longitude])
            );
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [companies, map]);

    return null;
}

const CompanyMap: React.FC<CompanyMapProps> = ({
    companies,
    onMarkerClick,
    center = [40.7128, -74.0060], // Default to New York
    zoom = 10
}) => {
    const [mapKey, setMapKey] = useState(0);

    // Force map re-render when companies change significantly
    useEffect(() => {
        setMapKey(prev => prev + 1);
    }, [companies.length]);

    return (
        <div className="company-map" style={{ height: '100%', width: '100%' }}>
            <MapContainer
                key={mapKey}
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                className="leaflet-container"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={process.env.NEXT_PUBLIC_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                />

                {companies.map((company) => (
                    <Marker
                        key={company.id}
                        position={[company.latitude, company.longitude]}
                        eventHandlers={{
                            click: () => onMarkerClick?.(company),
                        }}
                    >
                        <Popup>
                            <div className="company-popup">
                                <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Industry:</strong> {company.industry}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <strong>Location:</strong> {company.location}
                                </p>
                                <p className="text-xs text-gray-500">
                                    <strong>Coordinates:</strong> {company.latitude.toFixed(6)}, {company.longitude.toFixed(6)}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <MapUpdater companies={companies} />
            </MapContainer>
        </div>
    );
};

export default CompanyMap; 