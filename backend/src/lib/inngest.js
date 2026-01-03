import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "talent" });

export const syncUser = inngest.createFunction(
  { id: "sync-user" },
[
    { event: "clerk/user.created" },
  { event: "clerk/user.updated" },
],
  async ({ event }) => {
    // 1. Ensure DB connection
    await connectDB();

    const { id, first_name, last_name, image_url, email_addresses } = event.data;
    const email = email_addresses[0]?.email_address;

    // 2. Use findOneAndUpdate (Upsert) 
    // This is safer than .create() because it prevents "Duplicate Key" errors 
    // if Clerk sends the same event twice.
    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email: email,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "Anonymous",
        profileImage: image_url,
      },
      { upsert: true, new: true }
    );

    return { status: "success", user: id };
  }
);

export const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    return { status: "deleted", user: id };
  }
);

export const functions = [syncUser, deleteUserFromDB];