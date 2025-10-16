import {AssetLocationResponse, AssetResponse} from "@/lib/api/services/assetServiceAPI";
import {useMemo, useState} from "react";
import Map, {FullscreenControl, Marker, NavigationControl, Popup, ScaleControl} from "react-map-gl/mapbox";
import Pin from "@/components/map/Pin";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import 'mapbox-gl/dist/mapbox-gl.css';
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import {ExpandMore} from "@mui/icons-material";


type MouseCoords = {
  longitude: number,
  latitude: number
};

type ColorKey = {
  assetId: string,
  assetName?: string,
  color: string
};

export function LocationMap({assets, assetLocations, pingLatest = false, pingAll = false}: {
  assets: AssetResponse[],
  assetLocations: AssetLocationResponse[],
  pingLatest?: boolean,
  pingAll?: boolean
}) {

  const mapBoxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
  const [popupInfo, setPopupInfo] = useState<AssetLocationResponse | null>(null);
  const [mouseCoords, setMouseCoords] = useState<MouseCoords>({longitude: 0, latitude: 0});

  const colorKeys: ColorKey[] = useMemo(() => {
    const colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'];
    return assets.map((asset, idx) => {
      return {assetId: asset.id as string, color: colors[idx % colors.length], assetName: asset.name};
    });
  }, [assets]);

  const pins = useMemo(() => assetLocations.map((location, idx) => {
    // We can use the idx here to ping the latest, because assetLocations are always sorted from API Request
    return (
      <Marker
        key={location.id}
        longitude={location.longitude as number}
        latitude={location.latitude as number}
        anchor="bottom"
        onClick={e => {
          e.originalEvent.stopPropagation();
          setPopupInfo(location);
        }}
      >
        <Pin pinStyle={{
          fill: colorKeys.find(c => c.assetId === location.assetId)?.color || '#d00'
        }}
             ping={pingAll ? true : pingLatest && idx === 0}
        />
      </Marker>
    );
  }), [assetLocations, colorKeys, pingAll, pingLatest]);

  return (
    <Box position="relative" width="100%" height="600px">
      <Map
        reuseMaps
        style={{width: '100%', height: '100%'}}
        mapboxAccessToken={mapBoxAccessToken}
        mapStyle={"mapbox://styles/mapbox/dark-v9"}
        onMouseMove={e => {
          setMouseCoords({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat
          })
        }}
      >
        <FullscreenControl position="top-left"/>
        <NavigationControl position="top-left"/>
        <ScaleControl/>
        {pins}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude as number}
            latitude={popupInfo.latitude as number}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <Typography variant="h3" fontSize="small">
                <strong>Asset: </strong> {assets.find(a => a.id === popupInfo.assetId)?.name || "Unknown Asset"}
              </Typography>
              <Typography variant="body1" fontSize="small">
                <strong>Timestamp:</strong> <br/>{new Date(popupInfo.timestamp as string).toLocaleString()}
              </Typography>
              <Typography variant="body1" fontSize="small">
                <strong>Latitude:</strong> <br/>{popupInfo.latitude}
              </Typography>
              <Typography variant="body1" fontSize="small">
                <strong>Longitude:</strong> <br/>{popupInfo.longitude}
              </Typography>
            </div>

          </Popup>
        )}
      </Map>
      <Box position="absolute" top={4} right={4} p={2} borderRadius="12px" component={Card} display="flex"
           flexDirection="column" gap={2}>
        <MouseCoordinates mouseCoords={mouseCoords}/>
        <ColorKeyLegend colorKeys={colorKeys}/>
      </Box>
    </Box>
  );
}

function MouseCoordinates({mouseCoords}: { mouseCoords: MouseCoords }) {
  return (
    <Box>
      <Typography variant="h3" fontSize="small">
        <strong>Mouse Position:</strong>
      </Typography>
      <Typography variant="body2" fontSize="small">
        <strong>Latitude:</strong> {mouseCoords.latitude.toFixed(4)} <br/>
      </Typography>
      <Typography variant="body2" fontSize="small">
        <strong>Longitude:</strong> {mouseCoords.longitude.toFixed(4)}
      </Typography>
    </Box>
  );
}

function ColorKeyLegend({colorKeys}: { colorKeys: ColorKey[] }) {
  return (
    <Accordion defaultExpanded sx={{m: 0}}>
      <AccordionSummary expandIcon={<ExpandMore/>}>
        <Typography variant="h3" fontSize="small">
          <strong>Asset Color Legend</strong>
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {colorKeys.map(ck => (
          <Box key={ck.assetId} display="inline-flex" alignItems="center" gap={1}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: ck.color,
            }}/>
            <Typography variant="body2" fontSize="small">
              {ck.assetName || ck.assetId}
            </Typography>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  )
}