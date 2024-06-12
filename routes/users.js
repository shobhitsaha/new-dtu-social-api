import express from "express";
import { getUser, getId } from "../controllers/user.js";
import { updateUser } from "../controllers/user.js";

const router = express.Router();

router.get("/findId", getId);
router.get("/find/:userid", getUser);
router.put("/update", updateUser);

export default router;
