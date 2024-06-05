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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_utils_1 = require("./user.utils");
const Config_1 = __importDefault(require("../../Config"));
const prisma = new client_1.PrismaClient();
const registerUser = (name, email, password, profile) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield prisma.user.findUnique({
        where: { email },
    });
    if (userExists) {
        throw new Error("User already exists!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    const user = yield prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield prisma.user.create({
            data: { name, email, password: hashedPassword, role: client_1.UserRole.USER },
        });
        yield prisma.userProfile.create({
            data: { userId: newUser.id, bio: profile.bio, age: profile.age },
        });
        return newUser;
    }));
    //   const token = generateToken(user.id);
    return Object.assign({}, user);
});
const createAdminInToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(payload);
    // hash password
    const hashPassword = bcrypt_1.default.hashSync(payload.password, 12);
    const userData = {
        name: payload.name,
        email: payload.email,
        role: client_1.UserRole.ADMIN,
        password: hashPassword,
    };
    // use transaction for creating user and profile together
    const result = yield prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createUserData = yield transactionClient.user.create({
            data: userData,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        yield transactionClient.userProfile.create({
            data: Object.assign(Object.assign({}, payload.profile), { userId: createUserData.id }),
        });
        const createAdminData = yield transactionClient.admin.create({
            data: {
                name: payload === null || payload === void 0 ? void 0 : payload.name,
                email: payload === null || payload === void 0 ? void 0 : payload.email,
            },
        });
        return createAdminData;
    }));
    return result;
});
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("User not found.");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password.");
    }
    const jwtPayload = {
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
        userId: user === null || user === void 0 ? void 0 : user.id,
    };
    const token = (0, user_utils_1.createToken)(jwtPayload, Config_1.default.jwt.jwt_secret, Config_1.default.jwt.expires_in);
    // Omitting password from user data
    const { password: _ } = user, userData = __rest(user, ["password"]);
    return Object.assign(Object.assign({}, userData), { token });
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma.user.findUniqueOrThrow({
        where: {
            id: user === null || user === void 0 ? void 0 : user.userId,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    const updatedData = yield prisma.user.update({
        where: {
            id: userData === null || userData === void 0 ? void 0 : userData.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    return updatedData;
});
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
        },
        include: {
            userProfile: true,
        },
    });
    return result;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.findMany({
        include: {
            userProfile: true,
        },
    });
    return result;
});
const updateRole = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma.user.update({
        where: {
            id,
        },
        data: {
            role: payload === null || payload === void 0 ? void 0 : payload.role,
        },
    });
    return result;
});
const updateStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma.user.update({
        where: {
            id,
        },
        data: {
            status: payload === null || payload === void 0 ? void 0 : payload.status,
        },
    });
    return result;
});
exports.userServices = {
    registerUser,
    createAdminInToDB,
    loginUser,
    changePassword,
    getUserById,
    getAllUser,
    updateRole,
    updateStatus,
};
