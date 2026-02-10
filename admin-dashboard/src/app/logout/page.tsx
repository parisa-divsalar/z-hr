import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_AUTH_COOKIE = "zcv_admin_auth";

export default async function LogoutPage() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, "", { path: "/", expires: new Date(0) });
  redirect("/signin");
}


