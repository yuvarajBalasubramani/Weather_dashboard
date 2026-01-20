import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icon missing in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update map center when coords change
const RecenterMap = ({ lat, lon }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon]);
    }, [lat, lon, map]);
    return null;
};

const MapCard = ({ lat, lon, city }) => {
    if (!lat || !lon) return null;

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 z-0 relative">
            <MapContainer
                center={[lat, lon]}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', minHeight: '300px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lon]}>
                    <Popup>
                        {city}
                    </Popup>
                </Marker>
                <RecenterMap lat={lat} lon={lon} />
            </MapContainer>
        </div>
    );
};

export default MapCard;
