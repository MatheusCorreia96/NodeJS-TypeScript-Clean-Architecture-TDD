"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownHttpServer = exports.startHttpServer = exports.HttpError = void 0;
const http_1 = __importDefault(require("http"));
const http_shutdown_1 = __importDefault(require("http-shutdown"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const error_1 = __importDefault(require("./middlewares/error"));
const application_1 = require("infra/tools/errors/application");
class HttpError extends application_1.ApplicationError {
}
exports.HttpError = HttpError;
let server = null;
const startHttpServer = (config, container) => {
    if (server) {
        throw new Error('HTTP Server already started');
    }
    let app = express_1.default();
    app.disable('x-powered-by');
    app.enable('trust proxy');
    app.route('/healthcheck')
        .get((req, res) => res.status(200).end());
    app.use(cors_1.default({ origin: true, credentials: true }));
    app.use(body_parser_1.default.json());
    routes_1.default(app);
    app.use(error_1.default);
    server = http_shutdown_1.default(http_1.default.createServer(app));
    const KEEPALIVE_SECONDS = 65;
    server.keepAliveTimeout = KEEPALIVE_SECONDS * 1000;
    server.headersTimeout = (KEEPALIVE_SECONDS + 5) * 1000;
    server.listen(config.httpServer.port, () => {
        console.log(`HTTP server listening on port ${config.httpServer.port}`);
    });
};
exports.startHttpServer = startHttpServer;
const shutdownHttpServer = async () => {
    if (!server) {
        throw new Error('HTTP Server not started');
    }
    const s = server;
    return new Promise((resolve, reject) => {
        s.shutdown((err) => {
            server = null;
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.shutdownHttpServer = shutdownHttpServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1zZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJodHRwLXNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsa0VBQXlDO0FBQ3pDLHNEQUE4QjtBQUM5Qiw4REFBcUM7QUFHckMsc0RBQThCO0FBQzlCLGdEQUF3QjtBQUV4QixnRUFBMkM7QUFFM0MsZ0VBQWtFO0FBc0JsRSxNQUFhLFNBQVUsU0FBUSw4QkFBZ0I7Q0FFOUM7QUFGRCw4QkFFQztBQUVELElBQUksTUFBTSxHQUFnQixJQUFJLENBQUM7QUFFeEIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxNQUFjLEVBQUUsU0FBMEIsRUFBUSxFQUFFO0lBQ2xGLElBQUksTUFBTSxFQUFFO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQsSUFBSSxHQUFHLEdBQUcsaUJBQU8sRUFBRSxDQUFDO0lBRXBCLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUUxQixHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztTQUN0QixHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFFNUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFbkQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFFM0IsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVaLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBUSxDQUFDLENBQUM7SUFFbEIsTUFBTSxHQUFHLHVCQUFZLENBQUMsY0FBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRTlDLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQzdCLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDbkQsTUFBTSxDQUFDLGNBQWMsR0FBRyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUV2RCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUE5QlcsUUFBQSxlQUFlLG1CQThCMUI7QUFFSyxNQUFNLGtCQUFrQixHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUMxRCxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQzVDO0lBRUQsTUFBTSxDQUFDLEdBQVEsTUFBTSxDQUFDO0lBRXRCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDckMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDZCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDYjtpQkFBTTtnQkFDTCxPQUFPLEVBQUUsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQWpCVyxRQUFBLGtCQUFrQixzQkFpQjdCIn0=