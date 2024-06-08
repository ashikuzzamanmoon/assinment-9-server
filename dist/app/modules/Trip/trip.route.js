"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripRoutes = void 0;
const express_1 = __importDefault(require("express"));
// Assuming you have authentication middleware
const trip_controller_1 = require("./trip.controller");
const auth_1 = __importDefault(require("../../middleWare/auth"));
const validateRequest_1 = __importDefault(require("../../middleWare/validateRequest"));
const trip_validation_1 = require("./trip.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/trips", (0, auth_1.default)(), (0, validateRequest_1.default)(trip_validation_1.tripValidation.createTripValidation), trip_controller_1.tripController.createTrip);
router.get("/trips", trip_controller_1.tripController.getFilteredTrips);
router.get("/single-trip/:tripId", trip_controller_1.tripController.getTripById);
// get trips by user
router.get("/users/trips", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), trip_controller_1.tripController.getTripsByUser);
router.delete("/delete-trip/:tripId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), trip_controller_1.tripController.deleteTrip);
router.post("/trip/:tripId/request", (0, auth_1.default)(), trip_controller_1.tripController.sendTravelBuddyRequest);
router.patch("/edit-trip/:tripId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(trip_validation_1.tripValidation.updateTripValidation), trip_controller_1.tripController.updateTrip);
router.get("/travel-buddies/:tripId", (0, auth_1.default)(), trip_controller_1.tripController.getPotentialTravelBuddies);
router.get("/requests", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), trip_controller_1.tripController.getAllRequestByUser);
router.get("/request-history", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), trip_controller_1.tripController.getAllSendRequestHistoryByUser);
router.put("/travel-buddies/:buddyId/respond", (0, auth_1.default)(), trip_controller_1.tripController.respondToTravelBuddyRequest);
router.put("/buddy/:id/respond", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), trip_controller_1.tripController.respondToBuddyRequest);
exports.tripRoutes = router;
