const { get } = require('../config/database');

function validateDateRange(checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return false;
  }

  return checkIn < checkOut;
}

async function isRoomAvailable(roomId, checkInDate, checkOutDate, excludedReservationId = null) {
  let sql = `
    SELECT COUNT(*) AS overlaps
    FROM reservations
    WHERE room_id = ?
      AND status = 'active'
      AND check_in_date < ?
      AND check_out_date > ?
  `;

  const params = [roomId, checkOutDate, checkInDate];

  if (excludedReservationId) {
    sql += ' AND id != ?';
    params.push(excludedReservationId);
  }

  const result = await get(sql, params);
  return result.overlaps === 0;
}

module.exports = {
  validateDateRange,
  isRoomAvailable
};
