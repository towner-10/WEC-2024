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
import prisma from "~/lib/db.server";
import { Disaster } from "@prisma/client";
import { useEffect, useState } from "react";
import { ModeToggle } from "~/components/mode-toggle";
import { cn } from "~/lib/utils";
import { Slider } from "~/components/ui/slider";

export const meta: MetaFunction = () => {
  return [
    { title: "Tempests" },
    { name: "description", content: "Welcome to the Tempests App!" },
  ];
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return (Math.PI / 180) * deg;
}

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
  const [dname, setdname] = useState("");
  const [dtype, setdtype] = useState("");
  const [dregion, setdregion] = useState(["", "", ""]);
  const [dintensity, setdintensity] = useState(0);
  const [ddate, setddate] = useState("");
  const [disasters, setDisasters] = useState<Disaster[]>([]);

  // Convert date strings to Date objects
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

  useEffect(() => {
    setDisasters(disasterRef);
  }, [disasterRef]);

  return (
    <>
      <header className="flex flex-row justify-between items-center">
        <h1>
          Tempest <span className="font-light">Tracker</span>
        </h1>
        <ModeToggle />
      </header>
      <div className="h-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="col-span-1 lg:col-span-3 h-full">
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
              <Input
                id="disastername"
                placeholder='For example, "Hurricane Dave"'
                onChange={(e) => setdname(e.target.value)}
              />
              <Label>Type</Label>
              <Select
                onValueChange={(e) => {
                  setdtype(e);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {data.disasterTypes.map((disType) => {
                      return (
                        <>
                          <SelectItem value={disType.typeName}>
                            {disType.typeName}
                          </SelectItem>
                        </>
                      );
                    })}

                    <SelectItem value="any type">any type</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label>Region</Label>
              <div className="flex space-x-4">
                <Input placeholder="Lat. (°)" onChange={(e) => setdregion([Number.parseFloat(e.target.value), dregion[1], dregion[2]])} />
                <Input placeholder="Long. (°)" onChange={(e) => setdregion([dregion[0], Number.parseFloat(e.target.value), dregion[2]])} />
                <Input placeholder="Radius (km)" onChange={(e) => setdregion([dregion[0], dregion[1], Number.parseFloat(e.target.value)])} />
              </div>
              <Label>Intensity</Label>
              <div className="flex space-x-4"><div
                className={cn(
                  "flex flex-row w-full items-center justify-between",
                )}
              >
                <div className="flex-grow">
                  <Slider
                    defaultValue={[0]}
                    max={10}
                    min={0}
                    step={1}
                    onValueChange={e => setdintensity(e[0])}
                  />
                </div>
                <h3 className="flex-shrink-0 w-8 pl-2">{dintensity == 0 ? "off" : dintensity}</h3>
              </div>
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
              <Button
                type="submit"
                className="flex-grow"
                onClick={() => {
                  setDisasters(
                    disasterRef.filter((disaster) => {
                      let pass = true;
                      if (dname != "") {
                        if (!RegExp(disaster.name, "i").test(disaster.name))
                          pass = false;
                      }

                      if (dtype != "any type" && dtype != "") {
                        if (disaster.typeId != dtype) pass = false;
                      }

                      if (dregion.reduce((pval, cval) => {
                        if (!pval || cval == "") { return false }
                        else return true
                      }, true)) {
                        if (getDistanceFromLatLonInKm(Number(dregion[0]), Number(dregion[1]), disaster.latitude, disaster.longitude) > Number.parseFloat(dregion[2])) pass = false;
                      }

                      if (dintensity != 0) {
                        if (dintensity != Number(disaster.intensity)) pass = false
                      }

                      if (ddate != "") {
                        if (new Date(ddate) != disaster.date) {
                          pass = false
                        } else console.log('a')
                      }

                      return pass;
                    })
                  );
                }}
              >
                Filter results
              </Button>
            </CardFooter>
          </Card>
          <Button
            className="w-full"
            onClick={() => (window.location.href = "/new")}
          >
            Add a new event
          </Button>
        </div>
      </div>
    </>
  );
}
