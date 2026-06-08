import { AdminDashboard } from "./ui";
import { isAdmin } from "@/lib/auth";
import { getSiteContent } from "@/lib/data";

export default async function AdminPage() {
  const authed = await isAdmin();
  const content = authed ? await getSiteContent() : null;
  return <AdminDashboard initialAuthed={authed} initialContent={content} />;
}
