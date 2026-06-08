import { redirect } from "next/navigation";
import { addSubmission } from "@/lib/data";

export async function POST(request: Request) {
  const form = await request.formData();
  await addSubmission({
    id: crypto.randomUUID(),
    name: String(form.get("name") || ""),
    email: String(form.get("email") || ""),
    shootType: String(form.get("shootType") || ""),
    shootDate: String(form.get("shootDate") || ""),
    location: String(form.get("location") || ""),
    budget: String(form.get("budget") || ""),
    message: String(form.get("message") || ""),
    createdAt: new Date().toISOString(),
  });

  redirect("/contact?sent=1");
}
