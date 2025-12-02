const pool = require("../database/");

/* RESERVED */

async function isReserved(inv_id) {
  try {
    let reserved = false;
    const sql = "SELECT * FROM reservations WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    if (result.rows[0]) {
      reserved = true;
    }
    return reserved;
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* RESERVATIONS  BY accoutn_id*/

async function reservationBYAccount_id(account_id) {
  try {
    const sql = "SELECT * FROM reservations WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* DELETE RESERVATION */

async function deleteReservation(account_id, inv_id) {
  try {
    const sql =
      "DELETE FROM public.reservations WHERE account_id =$1 and inv_id = $2 RETURNING *";
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

async function insertReserve(account_id, inv_id) {
  try {
    const sql =
      "INSERT INTO public.reservations (account_id, inv_id) VALUES ($1, $2) RETURNING *";
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

module.exports = {
  isReserved,
  reservationBYAccount_id,
  deleteReservation,
  insertReserve,
};
