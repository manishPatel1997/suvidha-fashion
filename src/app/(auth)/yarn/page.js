export const dynamic = "force-dynamic";

import { API_LIST_AUTH } from "@/hooks/api-list";
import { createPaginatedStockPage } from "@/lib/paginated-stock-page";
import YarnDash from "./YarnComp";

export default createPaginatedStockPage({
    apiEndpoint: API_LIST_AUTH.StockYarn.get,
    Component: YarnDash,
    errorLabel: "yarn",
});
