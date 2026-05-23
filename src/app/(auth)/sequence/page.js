export const dynamic = "force-dynamic";

import { API_LIST_AUTH } from "@/hooks/api-list";
import { createPaginatedStockPage } from "@/lib/paginated-stock-page";
import SequenceHome from "./SequenceComp";

export default createPaginatedStockPage({
    apiEndpoint: API_LIST_AUTH.StockSequence.get,
    Component: SequenceHome,
    errorLabel: "sequences",
});
