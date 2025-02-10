import { redirect } from "next/navigation";

export default function Home() {
  redirect("/admin"); // ✅ Automatically send user to /admin
  return null;
}
