import { Disaster } from "@prisma/client";
import { useRef, useState } from "react";
import {
  CircleLayer,
  HeatmapLayer,
  Layer,
  Map,
  Popup,
  Source,
} from "react-map-gl";
import { Theme, useTheme } from "remix-themes";

interface HeatmapProps {
  token: string;
  disasters: Disaster[];
  children?: React.ReactNode;
}

const MAX_ZOOM_LEVEL = 9;

const circleLayer: CircleLayer = {
  id: "circle",
  minzoom: MAX_ZOOM_LEVEL - 1,
  type: "circle",
  paint: {
    // Size circle radius by earthquake magnitude and zoom level
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      MAX_ZOOM_LEVEL - 1,
      ["interpolate", ["linear"], ["get", "intensity"], 1, 1, 6, 4],
      16,
      ["interpolate", ["linear"], ["get", "intensity"], 1, 5, 6, 50],
    ],
    // Color circle by earthquake magnitude
    "circle-color": [
      "interpolate",
      ["linear"],
      ["get", "intensity"],
      1,
      "rgba(33,102,172,0)",
      2,
      "rgb(103,169,207)",
      4,
      "rgb(209,229,240)",
      5,
      "rgb(253,219,199)",
      7,
      "rgb(239,138,98)",
      10,
      "rgb(178,24,43)",
    ],
    "circle-stroke-color": "white",
    "circle-stroke-width": 1,
    // Transition from heatmap to circle layer by zoom level
    "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
  },
};

const heatmapLayer: HeatmapLayer = {
  id: "heatmap",
  maxzoom: MAX_ZOOM_LEVEL,
  type: "heatmap",
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    "heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    "heatmap-intensity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      1,
      MAX_ZOOM_LEVEL,
      3,
    ],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      "rgba(33,102,172,0)",
      0.2,
      "rgb(103,169,207)",
      0.4,
      "rgb(209,229,240)",
      0.6,
      "rgb(253,219,199)",
      0.8,
      "rgb(239,138,98)",
      0.9,
      "rgb(255,201,101)",
    ],
    // Adjust the heatmap radius by zoom level
    "heatmap-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      2,
      MAX_ZOOM_LEVEL,
      20,
    ],
    // Transition from heatmap to circle layer by zoom level
    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
  },
};

export default function Heatmap(props: HeatmapProps) {
  const popupRef = useRef<mapboxgl.Popup>(null);
  const [theme] = useTheme();
  const [popupInfo, setPopupInfo] = useState<Disaster | null>(null);

  return (
    <div className="h-[500px]">
      <Map
        mapboxAccessToken={props.token}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 0.1,
        }}
        interactiveLayerIds={[circleLayer.id]}
        mapStyle={
          theme === Theme.LIGHT
            ? "mapbox://styles/mapbox/light-v10"
            : "mapbox://styles/mapbox/dark-v10"
        }
        attributionControl={false}
        onClick={(event) => {
          // Find the tweet that was clicked and check if it is a point
          const { features } = event;

          console.log(features);
          if (features && features.length > 0) {
            if (
              features[0].geometry.type === "Point" &&
              features[0].properties
            ) {
              // If it is a point, set the popup info
              const disaster: Disaster = {
                longitude: Number(features[0].geometry.coordinates[0]),
                latitude: Number(features[0].geometry.coordinates[1]),
                intensity: Number(features[0].properties.intensity),
                name: features[0].properties.name,
                id: features[0].properties.id,
                typeId: features[0].properties.typeId,
                date: new Date(features[0].properties.date),
              };
              return setPopupInfo(disaster);
            }
          }

          return setPopupInfo(null);
        }}
      >
        <Source
          id="disasters"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: props.disasters.map((disaster) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [disaster.longitude, disaster.latitude],
              },
              properties: {
                id: disaster.id,
                name: disaster.name,
                intensity: disaster.intensity,
                typeId: disaster.typeId,
                date: disaster.date,
              },
            })),
          }}
        >
          <Layer {...heatmapLayer} />
          <Layer {...circleLayer} />
        </Source>
        {popupInfo && (
          <Popup
            ref={popupRef}
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            anchor="bottom"
            closeOnClick={true}
            onClose={() => setPopupInfo(null)}
          >
            <h3 className="text-lg">{popupInfo.name}</h3>
            <p className="text-sm">{popupInfo.date.toLocaleDateString()}</p>
            <p className="text-sm">Type: {popupInfo.typeId}</p>
          </Popup>
        )}
        {props.children}
      </Map>
    </div>
  );
}
