const { all, get, run } = require('../config/database');

async function findAll() {
  return all(
    `SELECT
      res.id,
      res.room_id AS roomId,
      room.room_number AS roomNumber,
      room.type AS roomType,
      room.price_per_night AS roomPrice,
      res.customer_id AS customerId,
      customer.first_name AS customerFirstName,
      customer.last_name AS customerLastName,
      customer.email AS customerEmail,
      customer.phone AS customerPhone,
      res.check_in_date AS checkInDate,
      res.check_out_date AS checkOutDate,
      res.guest_count AS guestCount,
      res.status,
      res.created_at AS createdAt
    FROM reservations res
    INNER JOIN rooms room ON room.id = res.room_id
    INNER JOIN customers customer ON customer.id = res.customer_id
    ORDER BY res.check_in_date ASC`
  );
}

async function findById(reservationId) {
  return get(
    `SELECT
      res.id,
      res.room_id AS roomId,
      room.room_number AS roomNumber,
      room.type AS roomType,
      room.price_per_night AS roomPrice,
      res.customer_id AS customerId,
      customer.first_name AS customerFirstName,
      customer.last_name AS customerLastName,
      customer.email AS customerEmail,
      customer.phone AS customerPhone,
      res.check_in_date AS checkInDate,
      res.check_out_date AS checkOutDate,
      res.guest_count AS guestCount,
      res.status,
      res.created_at AS createdAt
    FROM reservations res
    INNER JOIN rooms room ON room.id = res.room_id
    INNER JOIN customers customer ON customer.id = res.customer_id
    WHERE res.id = ?`,
    [reservationId]
  );
}

async function create(reservation) {
  const result = await run(
    `INSERT INTO reservations (
      room_id,
      customer_id,
      check_in_date,
      check_out_date,
      guest_count,
      status
    ) VALUES (?, ?, ?, ?, ?, 'active')`,
    [
      reservation.roomId,
      reservation.customerId,
      reservation.checkInDate,
      reservation.checkOutDate,
      reservation.guestCount
    ]
  );

  return findById(result.id);
}

async function update(reservationId, reservation) {
  await run(
    `UPDATE reservations
     SET room_id = ?,
         customer_id = ?,
         check_in_date = ?,
         check_out_date = ?,
         guest_count = ?
     WHERE id = ?`,
    [
      reservation.roomId,
      reservation.customerId,
      reservation.checkInDate,
      reservation.checkOutDate,
      reservation.guestCount,
      reservationId
    ]
  );

  return findById(reservationId);
}

async function cancel(reservationId) {
  await run(
    `UPDATE reservations
     SET status = 'cancelled'
     WHERE id = ?`,
    [reservationId]
  );

  return findById(reservationId);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  cancel
};
