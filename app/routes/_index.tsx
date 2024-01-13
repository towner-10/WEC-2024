import { json, LinksFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Heatmap from "~/components/heatmap";
import mapboxStyles from "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";

export const meta: MetaFunction = () => {
  return [
    { title: "Tempests" },
    { name: "description", content: "Welcome to the Tempests App!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: mapboxStyles },
];

export async function loader() {
  return json({
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <header>
        <h1>Tempests</h1>
      </header>
      <div className="h-full p-4 grid grid-cols-4 gap-4">
        <Card className="col-span-3 h-full">
          <CardHeader>
            <CardTitle>Event Heatmap</CardTitle>
            <CardDescription>
              Natural disaster events at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.MAPBOX_TOKEN && (
              <Heatmap
                token={data.MAPBOX_TOKEN}
                disasters={[]}
              />
            )}
          </CardContent>
        </Card>
        <div className="flex-col col-span-1 h-full space-y-4">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>Filter Tools</CardTitle>
              <CardDescription>Quickly locate specific events</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Label>Name</Label>
              <Input placeholder='For example, "Hurricane Dave"' />
              <Label>Type</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select an event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* TODO: Replace with unique list of types from database */}
                    <SelectItem value="placeholder">
                      Placeholder (REPLACE THIS!)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label>Region</Label>
              <div className="flex space-x-4">
                <Input placeholder="Lat. (°)" />
                <Input placeholder="Long. (°)" />
                <Input placeholder="Radius (km)" />
              </div>
              <Label>Intensity</Label>
              <div className="flex space-x-4">
                <Slider defaultValue={[5]} max={10} step={1} />
                {/* TODO: Add text for the slider value and remove placeholder */}
                <h3>2</h3>
              </div>
              <Label>Date</Label>
              <div className="flex space-x-4 items-center">
                <Input placeholder="MM" />
                <h3>/</h3>
                <Input placeholder="DD" />
                <h3>/</h3>
                <Input placeholder="YYYY" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              <Button className="flex-grow" variant="secondary">
                Reset filters
              </Button>
              <Button className="flex-grow">Filter results</Button>
            </CardFooter>
          </Card>
          <Button className="w-full">Add a new event</Button>
        </div>
      </div>
    </>
  );
}
