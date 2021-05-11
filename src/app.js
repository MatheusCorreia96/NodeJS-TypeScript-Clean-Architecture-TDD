"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.TZ = 'UTC';
process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED = '1';
require("./infra/module-alias");
require("source-map-support/register");
const config_1 = require("./infra/config/config");
const register_1 = require("./infra/bootstrap/register");
const http_server_1 = require("./infra/http/http-server");
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
if (!process.env.NODE_EXTRA_CA_CERTS) {
    process.env.NODE_EXTRA_CA_CERTS = '/etc/ssl/certs/ca-bundle.crt';
}
if (fs_1.default.existsSync(process.env.NODE_EXTRA_CA_CERTS)) {
    https_1.default.globalAgent.options.ca = fs_1.default.readFileSync(process.env.NODE_EXTRA_CA_CERTS);
}
https_1.default.globalAgent.options.keepAlive = true;
let container = null;
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('warning', (warning) => {
    console.log('Warning', { err: warning });
});
process.on('unhandledRejection', (error) => {
    console.log('Unhandled rejection', { err: error });
});
async function init() {
    try {
        const config = await config_1.getConfig();
        container = register_1.setupContainer(config);
        const appContainer = container.cradle;
        http_server_1.startHttpServer(config, container);
        console.log('Bootstrapped');
    }
    catch (err) {
        console.log('Bootstrap error', { err });
        shutdown(1);
    }
}
async function shutdown(exitCode) {
    console.log('Shutting down');
    try {
        await http_server_1.shutdownHttpServer();
        console.log('HTTP server closed');
    }
    catch (err) {
        console.log('HTTP server shutdown error', { err });
    }
    if (container) {
        try {
            await container.dispose();
            console.debug('Container disposed');
        }
        catch (err) {
            console.error('Error while disposing container', { err });
        }
    }
    console.info('Bye');
    process.exit(exitCode);
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEdBQUcsR0FBRyxDQUFDO0FBRXRELGdDQUE4QjtBQUM5Qix1Q0FBcUM7QUFFckMsa0RBQWtEO0FBQ2xELHlEQUEwRTtBQUMxRSwwREFBK0U7QUFDL0Usa0RBQTBCO0FBQzFCLDRDQUFvQjtBQUdwQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRTtJQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLDhCQUE4QixDQUFDO0NBQ2xFO0FBRUQsSUFBSSxZQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsRUFBRTtJQUNsRCxlQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Q0FDakY7QUFFRCxlQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBRTNDLElBQUksU0FBUyxHQUFvQixJQUFJLENBQUM7QUFFdEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFekMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtJQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLENBQUMsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO0lBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNyRCxDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssVUFBVSxJQUFJO0lBQ2pCLElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFTLEVBQUUsQ0FBQztRQUVqQyxTQUFTLEdBQUcseUJBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuQyxNQUFNLFlBQVksR0FBaUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUVwRCw2QkFBZSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVuQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQzdCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN4QyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDYjtBQUNILENBQUM7QUFFRCxLQUFLLFVBQVUsUUFBUSxDQUFDLFFBQWdCO0lBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFN0IsSUFBSTtRQUNGLE1BQU0sZ0NBQWtCLEVBQUUsQ0FBQztRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDbkM7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3BEO0lBRUQsSUFBSSxTQUFTLEVBQUU7UUFDYixJQUFJO1lBQ0YsTUFBTSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3JDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUMzRDtLQUNGO0lBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVwQixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyJ9