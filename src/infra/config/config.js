"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const read_pkg_up_1 = __importDefault(require("read-pkg-up"));
const general_1 = require("@constants/general");
const env = process.env.APP_ENV || general_1.Env.Development;
const sandbox = [general_1.Env.Testing].includes(env);
const appPackage = read_pkg_up_1.default.sync({ normalize: false }).packageJson;
const buildParamName = (param) => {
    return `/${env}/${appPackage.name}${param}`;
};
const PARAMETER_CONFIG = buildParamName('/config');
const PARAMETER_DATABASES = buildParamName('/databases');
const PARAMETER_TIMEZONE = `/${env}/common/timezone`;
const getParameters = async () => {
    if (env === general_1.Env.Development) {
        return {
            [PARAMETER_CONFIG]: fs_1.default.readFileSync(`${__dirname}/config.json`).toString(),
            [PARAMETER_DATABASES]: fs_1.default.readFileSync(`${__dirname}/databases.json`).toString(),
            [PARAMETER_TIMEZONE]: 'America/Sao_Paulo',
        };
    }
    const ssm = new aws_sdk_1.default.SSM({ apiVersion: '2014-11-06' });
    const options = {
        Names: [
            PARAMETER_CONFIG,
            PARAMETER_DATABASES,
            PARAMETER_TIMEZONE,
        ],
        WithDecryption: true
    };
    const response = await ssm.getParameters(options).promise();
    let params = {};
    response.Parameters.forEach((p) => {
        params[p.Name] = p.Value;
    });
    return params;
};
const getConfig = async () => {
    const params = await getParameters();
    const config = JSON.parse(params[PARAMETER_CONFIG]);
    const databases = JSON.parse(params[PARAMETER_DATABASES]);
    config.env = env;
    config.sandbox = sandbox;
    config.timezone = params[PARAMETER_TIMEZONE];
    config.databases = databases;
    config.databases.redis.keyPrefix = `${appPackage.name}:${env}`;
    if (env === general_1.Env.Development && config.aws) {
        aws_sdk_1.default.config.update(config.aws);
    }
    return config;
};
exports.getConfig = getConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDRDQUFvQjtBQUNwQixzREFBMEI7QUFDMUIsOERBQW9DO0FBQ3BDLGdEQUF5QztBQUV6QyxNQUFNLEdBQUcsR0FBUSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxhQUFHLENBQUMsV0FBVyxDQUFDO0FBQ3hELE1BQU0sT0FBTyxHQUFHLENBQUMsYUFBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QyxNQUFNLFVBQVUsR0FBRyxxQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQW9CcEUsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFhLEVBQVUsRUFBRTtJQUMvQyxPQUFPLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDOUMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxnQkFBZ0IsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsTUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekQsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7QUFFckQsTUFBTSxhQUFhLEdBQUcsS0FBSyxJQUF3QyxFQUFFO0lBQ25FLElBQUksR0FBRyxLQUFLLGFBQUcsQ0FBQyxXQUFXLEVBQUU7UUFDM0IsT0FBTztZQUNMLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxZQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsU0FBUyxjQUFjLENBQUMsQ0FBQyxRQUFRLEVBQUU7WUFDMUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLFlBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxTQUFTLGlCQUFpQixDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2hGLENBQUMsa0JBQWtCLENBQUMsRUFBRSxtQkFBbUI7U0FDMUMsQ0FBQztLQUNIO0lBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBRXRELE1BQU0sT0FBTyxHQUFHO1FBQ2QsS0FBSyxFQUFFO1lBQ0wsZ0JBQWdCO1lBQ2hCLG1CQUFtQjtZQUNuQixrQkFBa0I7U0FDbkI7UUFDRCxjQUFjLEVBQUUsSUFBSTtLQUNyQixDQUFDO0lBRUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzVELElBQUksTUFBTSxHQUE4QixFQUFFLENBQUM7SUFFM0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNoQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFSyxNQUFNLFNBQVMsR0FBRyxLQUFLLElBQXFCLEVBQUU7SUFDbkQsTUFBTSxNQUFNLEdBQUcsTUFBTSxhQUFhLEVBQUUsQ0FBQztJQUVyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDcEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBRTFELE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDN0MsTUFBTSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUUvRCxJQUFJLEdBQUcsS0FBSyxhQUFHLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDekMsaUJBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMvQjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQWpCVyxRQUFBLFNBQVMsYUFpQnBCIn0=