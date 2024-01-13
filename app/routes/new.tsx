import { useState } from "react";
import { Button } from "~/components/ui/button";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import prisma from "~/lib/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const name = body.get("name");
  const type = body.get("type");
  const latitude = body.get("latitude");
  const longitude = body.get("longitude");
  const intensity = body.get("intensity");
  const date = body.get("date");

  if (!name || !type || !latitude || !longitude || !intensity || !date) {
    return redirect("/new", {
      status: 400,
    });
  }

  try {
    const disasterType = await prisma.disasterType.upsert({
      create: {
        typeName: type.toString(),
      },
      update: {
        typeName: type.toString(),
      },
      where: { typeName: type.toString() },
    });

    await prisma.disaster.create({
      data: {
        name: name.toString(),
        longitude: Number.parseFloat(longitude.toString()),
        latitude: Number.parseFloat(latitude.toString()),
        date: new Date(date.toString()),
        intensity: Number.parseInt(intensity.toString()),
        dType: {
          connect: {
            typeName: disasterType.typeName,
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return redirect("/new", {
      status: 500,
    });
  }

  return redirect("/");
}

export default function New() {
  const [statusMsg, setStatusMsg] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [intensity, setIntensity] = useState([5]);
  const [date, setDate] = useState<Date>();
  const fetcher = useFetcher();

  const handleSubmit = () => {
    setStatusMsg("");

    //Input validation
    if (!name || !type || !latitude || !longitude || !intensity || !date) {
      setStatusMsg("Please fill out all fields");
      return;
    }

    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      setStatusMsg("Latitude and longitude must be numbers");
      return;
    }

    if (Number(latitude) < -90 || Number(latitude) > 90) {
      setStatusMsg("Latitude must be between -90 and 90");
      return;
    }

    if (Number(longitude) < -180 || Number(longitude) > 180) {
      setStatusMsg("Longitude must be between -180 and 180");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("intensity", intensity[0].toString());
    formData.append("date", date.toString());

    fetcher.submit(formData, {
      method: "POST",
    });
  };

  return (
    <>
      <h1>Add a new event to track</h1>
      <Card className="flex-grow mt-8">
        <CardHeader>
          <CardTitle>Event information</CardTitle>
          <CardDescription>
            Enter the key details about the event
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Label>Name</Label>
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='For example, "Mount St. Helens"'
          />
          <Label>Type</Label>
          <Input
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder='For example, "Mudslide"'
          />
          <Label>Location</Label>
          <div className="flex space-x-4">
            <Input
              name="lat"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude (°)"
            />
            <Input
              name="long"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude (°)"
            />
          </div>
          <Label>Intensity</Label>
          <div className="flex space-x-4">
            <Slider
              name="intensity"
              value={intensity}
              onValueCommit={setIntensity}
              defaultValue={[5]}
              max={10}
              step={1}
            />
            {/* TODO: Add text for the slider value and remove placeholder */}
            <h3>2</h3>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>Submit event</Button>
        </CardFooter>
        {statusMsg && (
          <h2 className="flex justify-center pb-4 text-red-500">{statusMsg}</h2>
        )}
      </Card>
    </>
  );
}
