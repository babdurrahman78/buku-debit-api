import express from "express";
const router = express.Router();
import { pool } from "../db.js";

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jalur");

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM jalur WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Jalur not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
