export const dynamic = "force-dynamic";

import { API_LIST_AUTH } from "@/hooks/api-list";
import { createPaginatedStockPage } from "@/lib/paginated-stock-page";
import PeoplePage from "./PeopleComp";

export default createPaginatedStockPage({
    apiEndpoint: API_LIST_AUTH.User.get,
    Component: PeoplePage,
    errorLabel: "people",
});
