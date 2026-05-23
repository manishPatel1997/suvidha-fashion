export const DEFAULT_SETTINGS = {
    design_categories: "",
    fabric_stock_categories: "",
    fabric_stock_quality: "",
    fabric_stock_sub_quality: "",
    yarn_stock_categories: "",
    yarn_stock_quality: "",
    yarn_stock_sub_quality: "",
    sequence_stock_categories: "",
    sequence_stock_quality: "",
    vendor_category: "",
};

export const SETTINGS_LABELS = {
    design_categories: "Design Categories",
    fabric_stock_categories: "Fabric Stock Categories",
    fabric_stock_quality: "Fabric Stock Quality",
    fabric_stock_sub_quality: "Fabric Stock Sub Quality",
    yarn_stock_categories: "Yarn Stock Categories",
    yarn_stock_quality: "Yarn Stock Quality",
    yarn_stock_sub_quality: "Yarn Stock Sub Quality",
    sequence_stock_categories: "Sequence Stock Categories",
    sequence_stock_quality: "Sequence Stock Quality",
    vendor_category: "Vendor Category",
};

export function normalizeSettings(apiData) {
    const result = { ...DEFAULT_SETTINGS };
    Object.keys(DEFAULT_SETTINGS).forEach((key) => {
        result[key] = apiData?.[key] ?? "";
    });
    return result;
}
