import express from "express";
import {
  createClass,
  deleteClass
} from "../controllers/classController.js";

const router = express.Router();

router.post("/", createClass);
router.delete("/:id", deleteClass);

export default router;