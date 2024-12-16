import { useRef, useState } from "react";
import { Box,  Grid } from "@mui/material";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { RegisterAddressForm } from "./components/RegisterContacts";


const containerStyle = {
    width: '100%',
    height: '90vh',
}

const center = {
    lat: -3.745,
    lng: -38.523,
}

export function Home() {
    const { isLoaded, loadError } = useJsApiLoader({ 
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: ['places']
    })
    const [addressLatAndLong, setAddressLatAndLong] = useState({
        latitude: 0,
        longitude: 0
    })
    const mapRef = useRef<google.maps.Map | null>(null);

    const onMapLoad = (map: google.maps.Map) => {
        mapRef.current = map; // Salva a instância do mapa na ref
    };

    const handleAddressChange = (newCoordinates: { latitude: number; longitude: number }) => {
        setAddressLatAndLong(newCoordinates);
        if (mapRef.current) {
            mapRef.current.panTo({
                lat: newCoordinates.latitude,
                lng: newCoordinates.longitude
            });
        }
    };
    if (loadError) {
        return <div>Error loading maps</div>;
    }
    if (!isLoaded) {
        return <div>Loading maps ...</div>;
    }
    return (
        <Box
            sx={{
                width: '100%',
                height: '95vh',
                border: '1px solid black',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Conteúdo com duas colunas */}
            <Grid container sx={{ flex: 1 }}>
                {/* Coluna Esquerda - Contatos */}
                <Grid
                    item
                    xs={4}
                    sx={{
                        borderRight: '1px solid black',
                    }}
                >
                    <RegisterAddressForm handleAddressChange={handleAddressChange} />
                </Grid>

                {/* Coluna Direita - Mapa */}
                <Grid item xs={8}>
                    {isLoaded && (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            onLoad={onMapLoad}
                            center={center}
                            zoom={6}
                            
                        >
                            {/* Pontos marcados no mapa */}
                               {addressLatAndLong.latitude && (
                                 <Marker
                                 position={{
                                     lat: addressLatAndLong.latitude,
                                     lng: addressLatAndLong.longitude
                                 }} />
                               )}
                        </GoogleMap>)}
                </Grid>
            </Grid>
        </Box>
    );
}