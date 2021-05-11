"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupContainer = void 0;
const awilix_1 = require("awilix");
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const async_1 = __importDefault(require("async"));
const bluebird_1 = __importDefault(require("bluebird"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const node_forge_1 = __importDefault(require("node-forge"));
const asyncPromise = bluebird_1.default.promisifyAll(async_1.default);
const setupContainer = (config) => {
    const container = awilix_1.createContainer({
        injectionMode: awilix_1.InjectionMode.PROXY
    });
    container.register({
        env: awilix_1.asValue(config.env),
        config: awilix_1.asValue(config),
        path: awilix_1.asValue(path_1.default),
        fs: awilix_1.asValue(fs_1.default),
        crypto: awilix_1.asValue(crypto_1.default),
        lodash: awilix_1.asValue(lodash_1.default),
        util: awilix_1.asValue(util_1.default),
        asyncLib: awilix_1.asValue(asyncPromise),
        axios: awilix_1.asValue(axios_1.default),
        dynamoDB: awilix_1.asFunction(() => new aws_sdk_1.default.DynamoDB()).scoped(),
        forge: awilix_1.asValue(node_forge_1.default),
    });
    const baseDir = path_1.default.resolve(`${__dirname} + '/../..`);
    container.loadModules([
        `${baseDir}/interactors/*/.js`,
        `${baseDir}/adapters/gateways/*/.js`,
        `${baseDir}/adapters/handlers/*/.js`,
        `${baseDir}/adapters/presenters/*/.js`,
        `${baseDir}/adapters/repositories/*/.js`
    ], {
        formatName: (name) => {
            name = lodash_1.default.camelCase(name);
            return name;
        },
        resolverOptions: {
            register: awilix_1.asClass,
            lifetime: awilix_1.Lifetime.SCOPED
        }
    });
    return container;
};
exports.setupContainer = setupContainer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWdpc3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxtQ0FBaUg7QUFDakgsNENBQW9CO0FBQ3BCLG9EQUE0QjtBQUM1QixvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLGdEQUF3QjtBQUN4QixrREFBNkI7QUFDN0Isd0RBQWdDO0FBRWhDLHNEQUEwQjtBQUMxQixrREFBMkM7QUFDM0MsNERBQStCO0FBRS9CLE1BQU0sWUFBWSxHQUFHLGtCQUFRLENBQUMsWUFBWSxDQUFDLGVBQVEsQ0FBQyxDQUFDO0FBb0I5QyxNQUFNLGNBQWMsR0FBRyxDQUFDLE1BQWMsRUFBbUIsRUFBRTtJQUNoRSxNQUFNLFNBQVMsR0FBRyx3QkFBZSxDQUFDO1FBQ2hDLGFBQWEsRUFBRSxzQkFBYSxDQUFDLEtBQUs7S0FDbkMsQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLFFBQVEsQ0FBQztRQUNqQixHQUFHLEVBQUUsZ0JBQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3hCLE1BQU0sRUFBRSxnQkFBTyxDQUFDLE1BQU0sQ0FBQztRQUN2QixJQUFJLEVBQUUsZ0JBQU8sQ0FBQyxjQUFJLENBQUM7UUFDbkIsRUFBRSxFQUFFLGdCQUFPLENBQUMsWUFBRSxDQUFDO1FBQ2YsTUFBTSxFQUFFLGdCQUFPLENBQUMsZ0JBQU0sQ0FBQztRQUN2QixNQUFNLEVBQUUsZ0JBQU8sQ0FBQyxnQkFBTSxDQUFDO1FBQ3ZCLElBQUksRUFBRSxnQkFBTyxDQUFDLGNBQUksQ0FBQztRQUNuQixRQUFRLEVBQUUsZ0JBQU8sQ0FBQyxZQUFZLENBQUM7UUFDL0IsS0FBSyxFQUFFLGdCQUFPLENBQUMsZUFBSyxDQUFDO1FBQ3JCLFFBQVEsRUFBRSxtQkFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksaUJBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtRQUN2RCxLQUFLLEVBQUUsZ0JBQU8sQ0FBQyxvQkFBSyxDQUFDO0tBRXRCLENBQUMsQ0FBQztJQUVILE1BQU0sT0FBTyxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLFlBQVksQ0FBQyxDQUFDO0lBRXZELFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDcEIsR0FBRyxPQUFPLG9CQUFvQjtRQUM5QixHQUFHLE9BQU8sMEJBQTBCO1FBQ3BDLEdBQUcsT0FBTywwQkFBMEI7UUFDcEMsR0FBRyxPQUFPLDRCQUE0QjtRQUN0QyxHQUFHLE9BQU8sOEJBQThCO0tBQ3pDLEVBQUU7UUFDRCxVQUFVLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUMzQixJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsZUFBZSxFQUFFO1lBQ2YsUUFBUSxFQUFFLGdCQUFPO1lBQ2pCLFFBQVEsRUFBRSxpQkFBUSxDQUFDLE1BQU07U0FDMUI7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDLENBQUM7QUF4Q1csUUFBQSxjQUFjLGtCQXdDekIifQ==