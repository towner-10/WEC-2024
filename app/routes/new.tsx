import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";

export default function New() {
    return (
        <>
            <h1>Add a new event to track</h1>
            <Card className="flex-grow mt-8">
                <CardHeader>
                    <CardTitle>Event information</CardTitle>
                    <CardDescription>Enter the key details about the event</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    <Label>Name</Label>
                    <Input placeholder='For example, "Mount St. Helens"' />
                    <Label>Type</Label>
                    <Input placeholder='For example, "Mudslide"' />
                    <Label>Location</Label>
                    <div className="flex space-x-4">
                        <Input placeholder="Latitude (°)" />
                        <Input placeholder="Longitude (°)" />
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
                <CardFooter className="flex justify-between">
                    <Button variant="secondary">
                        Clear inputs
                    </Button>
                    <Button>Submit event</Button>
                </CardFooter>
            </Card>
        </>
    );
}