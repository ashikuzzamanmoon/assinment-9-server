"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const UserCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: "Name field is required" }),
    email: zod_1.z.string().email({ message: "Email must be a valid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
const UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Email must be a valid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});
exports.userValidation = { UserCreateSchema, UserLoginSchema };
