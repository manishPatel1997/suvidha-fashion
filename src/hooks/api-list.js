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
        target: "/api/v1/design/sketches/target",
    },
    VisualDesigners: {
        get: "/api/v1/design/visual_designers/get"
    },
    Design: {
        get: '/api/v1/design/visual_designers/get',
        assign: '/api/v1/design/visual_designers/assign',
        assignView: '/api/v1/design/visual_designers/assign/view',
        assignUpadte: '/api/v1/design/visual_designers/assign/update',
        assignDelete: '/api/v1/design/visual_designers/assign/delete',
        assignStatus: '/api/v1/design/visual_designers/assign/status',
        target: '/api/v1/design/visual_designers/target',
    },


    users_get: "/api/v1/common/users_get",
}

export const API_LIST_NO_AUTH = {
    login: "/api/v1/auth/login",
}