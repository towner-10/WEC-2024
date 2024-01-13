import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  console.log(body.get("name"));

  return redirect("/");
}

export default function New() {
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
        <Form method="post">
          <CardContent className="flex flex-col space-y-4">
            <Label>Name</Label>
            <Input name="name" placeholder='For example, "Mount St. Helens"' />
            <Label>Type</Label>
            <Input name="type" placeholder='For example, "Mudslide"' />
            <Label>Location</Label>
            <div className="flex space-x-4">
              <Input name="lat" placeholder="Latitude (°)" />
              <Input name="lng" placeholder="Longitude (°)" />
            </div>
            <Label>Intensity</Label>
            <div className="flex space-x-4">
              <Slider defaultValue={[5]} max={10} step={1} />
              {/* TODO: Add text for the slider value and remove placeholder */}
              <h3>2</h3>
            </div>
            <Label>Date</Label>
            <div className="flex space-x-4 items-center">
              <Input name="month" placeholder="MM" />
              <h3>/</h3>
              <Input name="day" placeholder="DD" />
              <h3>/</h3>
              <Input name="year" placeholder="YYYY" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="reset" variant="secondary">
              Clear inputs
            </Button>
            <Button type="submit">Submit event</Button>
          </CardFooter>
        </Form>
      </Card>
    </>
  );
}
