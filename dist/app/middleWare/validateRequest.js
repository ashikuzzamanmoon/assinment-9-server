"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const http_status_1 = __importDefault(require("http-status"));
const validateRequest = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.parseAsync(req.body);
        return next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            const errorDetails = {
                issues: err.errors.map((error) => {
                    let message = error.message;
                    let requiredField = null;
                    if (error.code === "invalid_type") {
                        requiredField = error.path[error.path.length - 1];
                        message = `${requiredField} field is required.`;
                    }
                    return {
                        field: error.path.join("."),
                        message,
                    };
                }),
            };
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: errorDetails.issues.map((issue) => issue.message).join(". "),
                errorDetails,
            });
        }
        else {
            return next(err);
        }
    }
});
exports.default = validateRequest;
