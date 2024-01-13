import { json, LinksFunction, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
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
import { useState } from "react";

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
  const disasterTypes = await prisma.disasterType.findMany();

  return json({
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    disasters,
    disasterTypes,
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [dname, setdname] = useState("");
  const [dtype, setdtype] = useState("");

  const disasterRef: Disaster[] = data.disasters.map((disaster) => {
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

  let disasters: Disaster[] = disasterRef.filter(() => true);

  return (
    <>
      <header>
        <h1>Tempest <span className="font-light">Tracker</span></h1>
      </header>
      <div className="h-full p-4 grid grid-cols-4 gap-4">
        <Card className="col-span-3 h-full">
          <CardHeader>
            <CardTitle>Event Heatmap</CardTitle>
            <CardDescription>
              Natural disaster events at a glance
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
              <Input id='disastername' placeholder='For example, "Hurricane Dave"' onChange={(e) => setdname(e.target.value)} />
              <Label>Type</Label>
              <Select onValueChange={(e) => { setdtype(e) }}>
                <SelectTrigger className="w-[180px]" >
                  <SelectValue placeholder="any type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      data.disasterTypes.map((disType) => {
                        return (<>
                          <SelectItem value={disType.typeName}>{disType.typeName}
                          </SelectItem>
                        </>);
                      })
                    }

                    <SelectItem value="any type">any type
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
              <Button type='submit' className="flex-grow" onClick={() => {
                disasters = disasterRef.filter((disaster) => {
                  let pass = true;
                  if (dname != "") {
                    if (!RegExp(disaster.name, "i").test(disaster.name)) pass = false;
                  }
                  if (dtype != "any type" && dtype != "") {
                    if (disaster.typeId != dtype) pass = false;
                    else console.log("oop")
                  }
                });
              }}>Filter results</Button>
            </CardFooter>
          </Card>
          <Button className="w-full" onClick={() => navigate('/new')}>Add a new event</Button>
        </div>
      </div >
    </>
  );
}
