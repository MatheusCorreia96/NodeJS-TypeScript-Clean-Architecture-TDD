"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("infra/tools/errors/application");
exports.default = (err, req, res, next) => {
    let status = err.status || 500;
    let errorResponse = {};
    if (err instanceof application_1.ApplicationError) {
        console.log('HTTP request error', { err });
        errorResponse = {
            nome: err.name,
            mensagem: err.message
        };
    }
    else {
        console.log('HTTP request unknown error', { err });
        errorResponse = {
            nome: 'erro_interno_servidor',
            mensagem: 'Erro interno do servidor'
        };
    }
    res.status(status).json(errorResponse);
    next(err);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGdFQUFrRTtBQUVsRSxrQkFBZSxDQUFDLEdBQWMsRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUNqRixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztJQUMvQixJQUFJLGFBQWEsR0FBUSxFQUFFLENBQUM7SUFFNUIsSUFBSSxHQUFHLFlBQVksOEJBQWdCLEVBQUU7UUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFM0MsYUFBYSxHQUFHO1lBQ2QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO1lBQ2QsUUFBUSxFQUFFLEdBQUcsQ0FBQyxPQUFPO1NBQ3RCLENBQUM7S0FFSDtTQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFbkQsYUFBYSxHQUFHO1lBQ2QsSUFBSSxFQUFFLHVCQUF1QjtZQUM3QixRQUFRLEVBQUUsMEJBQTBCO1NBQ3JDLENBQUM7S0FDSDtJQUVELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRXZDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLENBQUMsQ0FBQyJ9