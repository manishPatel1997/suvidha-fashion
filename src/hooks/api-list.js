export const API_LIST_AUTH = {
    Inspirations: {
        status: "/api/v1/design/inspiration/status",
        target: "/api/v1/design/inspiration/target",
        create: "/api/v1/design/inspiration/create",
        update: "/api/v1/design/inspiration/update",
        delete: "/api/v1/design/inspiration/delete",
    },
    Sketches: {
        get: "/api/v1/design/sketches/get",
        assign: "/api/v1/design/sketches/assign",
        assignView: "/api/v1/design/sketches/assign/view",
        assignUpdate: "/api/v1/design/sketches/assign/update",
        assignDelete: "/api/v1/design/sketches/assign/delete",

        assignStatus: "/api/v1/design/sketches/assign/status",
        // status: "/api/v1/design/sketches/status",
        target: "/api/v1/design/sketches/target",
        // create: "/api/v1/design/sketches/create",
    },
    VisualDesigners: {
        get: "/api/v1/design/visual_designers/get"
    },


    users_get: "/api/v1/common/users_get",
}