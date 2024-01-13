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
import FilterSlider from "~/components/filter-slider";
import prisma from "~/lib/db.server";
import { Disaster } from "@prisma/client";

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
  const disasters = await prisma.disaster.findMany();

  return json({
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    disasters,
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const disasters: Disaster[] = data.disasters.map((disaster) => {
    return {
      id: disaster.id,
      date: new Date(disaster.date),
      name: disaster.name,
      intensity: disaster.intensity,
      typeId: disaster.typeId,
      latitude: disaster.latitude,
      longitude: disaster.longitude,
    };
  });

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
            {data.MAPBOX_TOKEN && data.disasters && (
              <Heatmap token={data.MAPBOX_TOKEN} disasters={disasters} />
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
                <FilterSlider />
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
