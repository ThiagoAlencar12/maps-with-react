import { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'


const containerStyle = {
    width: '100%',
    height: '95vh',
}

const center = {
    lat: -3.745,
    lng: -38.523,
}

interface Marker {
    lat: number;
    lng: number;
}

export function Home() {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyA4pbbv8wwJ-r4MhFNZpUU-h0mVbGrX8Rk',
        libraries: ['places']
    })
    const [coords, setCoords] = useState({});
    const [distance, setDistance] = useState(0);
    const [markers, setMarkers] = useState<Marker[]>([])

    const onMapClick = (e) => {
        setMarkers((prevState) => [
            ...prevState,
            {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            }
        ]);
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {

                const { latitude, longitude, accuracy } = position.coords;

                setCoords({ lat: latitude, lng: longitude });
                setDistance(accuracy);
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
                height: '100vh',
                border: '1px solid black',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Cabeçalho */}
            <Box sx={{ display: 'flex', borderBottom: '1px solid black' }}>
                <Box
                    sx={{
                        width: '50%',
                        textAlign: 'center',
                        borderRight: '1px solid black',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ padding: 1 }}
                    >
                        Contatos
                    </Typography>
                </Box>
                <Box sx={{ width: '50%', textAlign: 'center' }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ padding: 1 }}
                    >
                        Mapa
                    </Typography>
                </Box>
            </Box>

            {/* Conteúdo com duas colunas */}
            <Grid container sx={{ flex: 1 }}>
                {/* Coluna Esquerda - Contatos */}
                <Grid
                    item
                    xs={2}
                    sx={{
                        borderRight: '1px solid black',
                    }}
                >
                    <Button onClick={handleLocation}> Teste</Button>
                </Grid>

                {/* Coluna Direita - Mapa */}
                <Grid item xs={10}>
                    {isLoaded && (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={6}
                            onClick={onMapClick}
                        >
                            {/* Pontos marcados no mapa */}
                            {markers.map((marker) => (
                                <Marker
                                    position={{
                                        lat: marker.lat,
                                        lng: marker.lng
                                    }} />
                            ))}
                        </GoogleMap>)}
                </Grid>
            </Grid>
        </Box>
    );
}