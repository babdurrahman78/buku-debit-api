import express from "express";
const router = express.Router();
import { pool } from "../db.js";

/**
 * 1️⃣ GET /record-jalur-bersih
 * Optional filters: ?tanggal=YYYY-MM&jalur_id=123
 * sort by column tanggal desc
 */
router.get("/", async (req, res, next) => {
  try {
    const { tanggal, jalur_id } = req.query;

    if (!tanggal || !jalur_id) {
      return res.status(400).json({
        success: false,
        message: "Both 'tanggal' and 'jalur_id' query parameters are required.",
      });
    }

    const result = await pool.query(
      `
      SELECT *
      FROM record_jalur_bersih
      WHERE TO_CHAR(tanggal, 'YYYY-MM') = $1
        AND jalur_id = $2
      ORDER BY tanggal DESC
      `,
      [tanggal, jalur_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * 2️⃣ DELETE /record-jalur-bersih/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM record_jalur_bersih WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    res
      .status(200)
      .json({ success: true, message: "Record deleted", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/**
 * 3️⃣ PATCH /record-jalur-bersih/:id
 * Body: { stand_awal, stand_akhir, keterangan }
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stand_awal, stand_akhir, keterangan } = req.body;

    const result = await pool.query(
      `UPDATE record_jalur_bersih
       SET stand_awal = $1, stand_akhir = $2, keterangan = $3
       WHERE id = $4
       RETURNING *`,
      [stand_awal, stand_akhir, keterangan, id]
    );

    if (result.rowCount === 0)
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });

    res
      .status(200)
      .json({ success: true, message: "Record updated", data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/**
 * 2️⃣ POST /record-jalur-bersih
 * Create a new record
 */
router.post("/", async (req, res, next) => {
  try {
    const { stand_awal, stand_akhir, keterangan, tanggal, jalur_id } = req.body;

    // 🧠 Validate input
    if (!stand_awal || !stand_akhir || !tanggal || !jalur_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    // 🧠 Check duplicate by tanggal + jalur_id
    const duplicate = await pool.query(
      `SELECT id FROM record_jalur_bersih WHERE tanggal = $1 AND jalur_id = $2`,
      [tanggal, jalur_id]
    );

    if (duplicate.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Data dengan tanggal dan jalur tersebut sudah ada.",
      });
    }

    // 🧠 Insert new record
    const result = await pool.query(
      `
      INSERT INTO record_jalur_bersih
      (stand_awal, stand_akhir, keterangan, tanggal, jalur_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [stand_awal, stand_akhir, keterangan, tanggal, jalur_id]
    );

    res.status(201).json({
      success: true,
      message: "Record created successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
