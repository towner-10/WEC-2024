import { Disaster } from "@prisma/client";
import { Map } from "react-map-gl";
import { Theme, useTheme } from "remix-themes";

interface HeatmapProps {
  token: string;
  disasters: Disaster[];
  children?: React.ReactNode;
}

export default function Heatmap(props: HeatmapProps) {
  const [theme] = useTheme();

  return (
    <div className="h-[400px]">
      <Map
        mapboxAccessToken={props.token}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        mapStyle={
          theme === Theme.LIGHT
            ? "mapbox://styles/mapbox/light-v10"
            : "mapbox://styles/mapbox/dark-v10"
        }
        attributionControl={false}
      >
        {props.children}
      </Map>
    </div>
  );
}
