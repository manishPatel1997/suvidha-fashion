export const dynamic = "force-dynamic";

import { API_LIST_AUTH } from "@/hooks/api-list";
import { createPaginatedStockPage } from "@/lib/paginated-stock-page";
import FabricHome from "./FabricComp";

export default createPaginatedStockPage({
    apiEndpoint: API_LIST_AUTH.StockFabric.get,
    Component: FabricHome,
    errorLabel: "fabrics",
});
