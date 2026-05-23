import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getTokenPayload() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    try {
        const payloadBase64 = token.split(".")[1];
        return JSON.parse(atob(payloadBase64));
    } catch {
        return null;
    }
}

/** Redirect to /login or /dashboard if the user is not an admin. */
export async function requireAdmin() {
    const payload = await getTokenPayload();
    if (!payload) redirect("/login");
    if (payload.role?.toLowerCase() !== "admin") redirect("/dashboard");
    return payload;
}
