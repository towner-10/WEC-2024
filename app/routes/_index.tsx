import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "Tempests" },
    { name: "description", content: "Welcome to the Tempests App!" },
  ];
};

export default function Index() {
  return (
    <div>
      <header>
        <h1>Welcome to the Tempests App!</h1>
      </header>
      <div className="h-full p-4 grid grid-cols-4 gap-4">
        <Card className="col-span-3 h-full">
          <CardHeader>
            <CardTitle>Event Heatmap</CardTitle>
            <CardDescription>
              Natural disaster events at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <div className="flex-col col-span-1 h-full space-y-4">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle>Filter Tools</CardTitle>
              <CardDescription>
                Find the exact event you are looking for!
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex justify-between">
              <Button>Filter</Button>
            </CardFooter>
          </Card>
          <Button className="w-full">New Event</Button>
        </div>
      </div>
    </div>
  );
}
