"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = exports.ApplicationErrorMessage = void 0;
var ApplicationErrorMessage;
(function (ApplicationErrorMessage) {
    ApplicationErrorMessage["genericError"] = "Error na aplica\u00E7\u00E3o";
})(ApplicationErrorMessage = exports.ApplicationErrorMessage || (exports.ApplicationErrorMessage = {}));
class ApplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'erro_aplicacao';
    }
}
exports.ApplicationError = ApplicationError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFZLHVCQUVYO0FBRkQsV0FBWSx1QkFBdUI7SUFDakMsd0VBQW1DLENBQUE7QUFDckMsQ0FBQyxFQUZXLHVCQUF1QixHQUF2QiwrQkFBdUIsS0FBdkIsK0JBQXVCLFFBRWxDO0FBRUQsTUFBYSxnQkFBaUIsU0FBUSxLQUFLO0lBQ3pDLFlBQVksT0FBZTtRQUN6QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDO0lBQy9CLENBQUM7Q0FDRjtBQUxELDRDQUtDIn0=