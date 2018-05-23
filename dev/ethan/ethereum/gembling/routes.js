const routes = require('next-routes')();

routes
.add('/gems/:address/zerosum', '/gems/zerosum/index');

module.exports = routes;