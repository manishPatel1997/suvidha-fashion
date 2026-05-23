export const dynamic = 'force-dynamic';

import ProfilePage from "./ProfileComp";
import { post } from "@/lib/server-api";
import { User_DATA } from "@/hooks/api-list";
import { rethrowNavigationError } from "@/lib/server-errors";

async function page() {
    let initialUserData = null;
    try {
        const res = await post(User_DATA.get, {});
        if (res.success && res.data?.[0]) {
            const d = res.data[0];
            initialUserData = {
                name: d.name || "",
                email: d.email || "",
                role: d.role ? d.role.charAt(0).toUpperCase() + d.role.slice(1) : "",
                contact: d.contact || "",
                id: String(d.id || ""),
            };
        }
    } catch (error) {
        rethrowNavigationError(error);
        console.error("Failed to fetch user profile server-side:", error);
    }

    return (
        <ProfilePage initialUserData={initialUserData} />
    );
}

export default page;