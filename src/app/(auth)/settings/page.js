export const dynamic = "force-dynamic";

import { get } from "@/lib/server-api";
import { requireAdmin } from "@/lib/server-auth";
import { rethrowNavigationError } from "@/lib/server-errors";
import { API_LIST_AUTH } from "@/hooks/api-list";
import SettingsComp from "./SettingsComp";
import { DEFAULT_SETTINGS, normalizeSettings } from "./settings-config";

async function SettingsPage() {
    await requireAdmin();

    let initialSettings = DEFAULT_SETTINGS;

    try {
        const res = await get(API_LIST_AUTH.setting);
        if (res?.success && res?.data) {
            initialSettings = normalizeSettings(res.data);
        }
    } catch (error) {
        rethrowNavigationError(error);
        console.error("Error fetching settings:", error);
    }

    return <SettingsComp initialSettings={initialSettings} />;
}

export default SettingsPage;
