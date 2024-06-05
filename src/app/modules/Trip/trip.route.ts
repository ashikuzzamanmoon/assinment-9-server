import express from "express";

// Assuming you have authentication middleware
import { tripController } from "./trip.controller";
import auth from "../../middleWare/auth";
import validateRequest from "../../middleWare/validateRequest";
import { tripValidation } from "./trip.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/trips",
  auth(),
  validateRequest(tripValidation.createTripValidation),
  tripController.createTrip
);

router.get("/trips", tripController.getFilteredTrips);
router.get("/single-trip/:tripId", tripController.getTripById);
// get trips by user
router.get(
  "/users/trips",
  auth(UserRole.ADMIN, UserRole.USER),
  tripController.getTripsByUser
);
router.delete(
  "/delete-trip/:tripId",
  auth(UserRole.ADMIN, UserRole.USER),
  tripController.deleteTrip
);

router.post(
  "/trip/:tripId/request",
  auth(),
  tripController.sendTravelBuddyRequest
);

router.patch(
  "/edit-trip/:tripId",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(tripValidation.updateTripValidation),
  tripController.updateTrip
);

router.get(
  "/travel-buddies/:tripId",
  auth(),
  tripController.getPotentialTravelBuddies
);
router.get(
  "/requests",
  auth(UserRole.ADMIN, UserRole.USER),
  tripController.getAllRequestByUser
);

router.put(
  "/travel-buddies/:buddyId/respond",
  auth(),
  tripController.respondToTravelBuddyRequest
);
router.put(
  "/buddy/:id/respond",
  auth(UserRole.ADMIN, UserRole.USER),
  tripController.respondToBuddyRequest
);

export const tripRoutes = router;
