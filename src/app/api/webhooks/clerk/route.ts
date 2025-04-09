//On Clerk dashboard, I created a webhook for user creation, update and deletion. The webhook will send a POST request to this route (api/webhooks/clerk) with the user data. This route will handle the request and update the database accordingly.

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";

//until the switch statement, all code is boiler plate code copied from the clerk documentation.
export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;

  // Verify payload with headers
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  // Create logic for handling user creation, update and deletion.
  switch (event.type) {
    //Both creation and update event will follow the follwoing logic.
    case "user.created":
    case "user.updated":
      // get the primary email address. email_addresses is an array of object with all saved email addresses. Get the primary email address.
      const email = event.data.email_addresses.find(
        (email) => email.id === event.data.primary_email_address_id
      )?.email_address;

      const name = `${event.data.first_name} ${event.data.last_name}`.trim();

      //Validate that email and name exist.
      if (email == null) return new Response("No email", { status: 400 });
      if (name === "") return new Response("No name", { status: 400 });

      //Call user feature function insertUser and pass all the data for new user.
      if (event.type === "user.created") {
        const user = await insertUser({
          clerkUserId: event.data.id,
          email,
          name,
          imageUrl: event.data.image_url,
          role: "user",
        });

        //If the user is created, we need to sync the user metadata (database userid, user role) with clerk. The function is in the services folder.
        await syncClerkUserMetadata(user);
      } else {
        //Update user using feature function.
        await updateUser(event.data.id, {
          email,
          name,
          imageUrl: event.data.image_url,
          role: event.data.public_metadata.role,
        });
      }
      break;
    //delete user
    case "user.deleted":
      if (event.data.id != null) {
        await deleteUser(event.data.id);
      }
      break;
  }
  return new Response("User Webhook received", { status: 200 });
}
