import { Map } from "react-map-gl";

interface HeatmapProps {
  token: string;
  children?: React.ReactNode;
}

export default function Heatmap(props: HeatmapProps) {
  return (
    <Map
      mapboxAccessToken={props.token}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      attributionControl={false}
    />
  );
}
