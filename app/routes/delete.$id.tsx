import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import prisma from "~/lib/db.server";

export async function loader({ params }: LoaderFunctionArgs) {
  // Check if ID is provided
  if (!params.id) {
    return json({ error: "No disaster ID provided" }, { status: 400 });
  }

  // Check if disaster exists
  const disaster = await prisma.disaster.findUnique({
    where: {
      id: params.id.toString(),
    },
  });

  if (!disaster) {
    return json({ error: "Disaster not found" }, { status: 404 });
  }

  return json({ id: params.id });
}

export async function action({ request }: LoaderFunctionArgs) {
  const body = await request.formData();

  const id = body.get("id");

  if (!id) {
    return json({ error: "No disaster ID provided" }, { status: 400 });
  }

  try {
    await prisma.disaster.delete({
      where: {
        id: id.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    return json({ error: "Error deleting disaster record" }, { status: 500 });
  }

  return redirect("/");
}

export const meta: MetaFunction = () => {
  return [{ title: "Tempests - Delete" }];
};

export default function Delete() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <>
      <header>
        <h1>Delete Disaster Record</h1>
      </header>
      <div className="flex flex-col items-center justify-center space-y-4">
        {data && "id" in data ? (
          <>
            <h2>Are you sure you want to delete this disaster record?</h2>
            <Button
              variant="destructive"
              onClick={() => {
                const formData = new FormData();

                formData.append("id", data.id);

                fetcher.submit(formData, { method: "DELETE" });
              }}
            >
              Delete
            </Button>
          </>
        ) : (
          <>
            <h2>Disaster record not found</h2>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </>
        )}
      </div>
    </>
  );
}
