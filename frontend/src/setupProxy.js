const { createProxyMiddleware } = require('http-proxy-middleware');

let ZTM_URL = "http://localhost:4000";

const ztmBackendPOST = {
    target: ZTM_URL,
    changeOrigin: true
}

const ztmBackendGET = {
    target: ZTM_URL,
    changeOrigin: true,
    headers: {
        accept: "application/json",
        method: "GET",
    },
}

module.exports = function (app) {

    app.use(
        '/login',
        createProxyMiddleware(ztmBackendPOST)
    );

    app.use(
        '/addbusstop',
        createProxyMiddleware(ztmBackendPOST)
    );



    app.use(
        '/busstops',
        createProxyMiddleware(ztmBackendGET)
    );

    app.use(
        '/stopinfo',
        createProxyMiddleware(ztmBackendGET)
    );

    app.use(
        '/listuserbusstops',
        createProxyMiddleware(ztmBackendGET)
    );

};
