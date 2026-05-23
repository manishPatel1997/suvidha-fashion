export const dynamic = "force-dynamic";

import { API_LIST_AUTH } from "@/hooks/api-list";
import { createPaginatedStockPage } from "@/lib/paginated-stock-page";
import VendorPage from "./VenorComp";

export default createPaginatedStockPage({
    apiEndpoint: API_LIST_AUTH.Vendor.get,
    Component: VendorPage,
    errorLabel: "vendors",
});
