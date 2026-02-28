export const API_LIST_AUTH = {
    Design: {
        create: "/api/v1/design/create",
    },
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
        get: "/api/v1/design/visual_designers/get",
        assign: '/api/v1/design/visual_designers/assign',
        assignView: '/api/v1/design/visual_designers/assign/view',
        assignUpdate: '/api/v1/design/visual_designers/assign/update',
        assignDelete: '/api/v1/design/visual_designers/assign/delete',
        assignStatus: '/api/v1/design/visual_designers/assign/status',
        target: '/api/v1/design/visual_designers/target',
    },
    Fabric: {
        get: '/api/v1/design/fabric/get',
        assign: "/api/v1/design/fabric/assign",
        assignView: '/api/v1/design/fabric/assign/view',
        assignUpdate: "/api/v1/design/fabric/assign/update",
        assignDelete: "/api/v1/design/fabric/assign/delete",
        assignStatus: "/api/v1/design/fabric/assign/status",
        target: '/api/v1/design/fabric/target',

        // create flow abric
        create: "/api/v1/stock/fabric/create",
        update: "/api/v1/stock/fabric/update",
        delete: "/api/v1/stock/fabric/delete",
    },
    StockFabric: {
        get: "/api/v1/stock/fabric/get"
    },
    StockYarn: {
        get: "/api/v1/stock/yarn/get"
    },
    StockSequence: {
        get: "/api/v1/stock/sequence/get"
    },
    Yarn: {
        get: "/api/v1/design/yarn/get",
        assign: "/api/v1/design/yarn/assign",
        assignUpdate: "/api/v1/design/yarn/assign/update",
        assignDelete: "/api/v1/design/yarn/assign/delete",
        assignStatus: "/api/v1/design/yarn/assign/status",
        assignView: "/api/v1/design/yarn/assign/view",

        target: "/api/v1/design/yarn/target",
        create: "/api/v1/stock/yarn/create",
        update: "/api/v1/stock/yarn/update",
        delete: "/api/v1/stock/yarn/delete",
    },
    Sequences: {
        get: "/api/v1/design/sequences/get",
        assign: "/api/v1/design/sequences/assign",
        assignView: "/api/v1/design/sequences/assign/view",
        assignUpdate: "/api/v1/design/sequences/assign/update",
        assignDelete: "/api/v1/design/sequences/assign/delete",
        assignStatus: "/api/v1/design/sequences/assign/status",
        target: "/api/v1/design/sequences/target",

        create: "/api/v1/stock/sequence/create",
        update: "/api/v1/stock/sequence/update",
        delete: "/api/v1/stock/sequence/delete",
    },
    Sample: {
        get: "/api/v1/design/samples/get",
        assign: "/api/v1/design/samples/assigns",
        assignDelete: "/api/v1/design/samples/assigns/delete",
        assignStatus: "/api/v1/design/samples/status",
        // assignUpdate:"/api/v1/design/samples/assign/update",
        assignView: "/api/v1/design/samples/assigns/view",
        target: "/api/v1/design/samples/target",
    },

    setting: "/api/v1/common/setting",
    users_get: "/api/v1/common/users_get",
}

export const API_LIST_NO_AUTH = {
    login: "/api/v1/auth/login",
}