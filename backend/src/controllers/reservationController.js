const roomRepository = require('../repositories/roomRepository');
const customerRepository = require('../repositories/customerRepository');
const reservationRepository = require('../repositories/reservationRepository');
const { validateDateRange, isRoomAvailable } = require('../services/availabilityService');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateReservationPayload(payload) {
  if (!payload.roomId || !payload.checkInDate || !payload.checkOutDate) {
    throw createHttpError(400, 'roomId, checkInDate and checkOutDate are required');
  }

  if (!validateDateRange(payload.checkInDate, payload.checkOutDate)) {
    throw createHttpError(400, 'Invalid date range');
  }

  if (!payload.guestCount || Number(payload.guestCount) <= 0) {
    throw createHttpError(400, 'guestCount must be greater than 0');
  }

  if (!payload.customer || !payload.customer.firstName || !payload.customer.lastName) {
    throw createHttpError(400, 'Customer firstName and lastName are required');
  }

  if (!payload.customer.email || !payload.customer.phone) {
    throw createHttpError(400, 'Customer email and phone are required');
  }
}

async function ensureCustomer(customerPayload) {
  const existingCustomer = await customerRepository.findByEmail(customerPayload.email);

  if (existingCustomer) {
    return existingCustomer;
  }

  return customerRepository.create(customerPayload);
}

async function getReservations(request, response, next) {
  try {
    const reservations = await reservationRepository.findAll();
    response.json(reservations);
  } catch (error) {
    next(error);
  }
}

async function getReservationById(request, response, next) {
  try {
    const reservation = await reservationRepository.findById(request.params.id);

    if (!reservation) {
      throw createHttpError(404, 'Reservation not found');
    }

    response.json(reservation);
  } catch (error) {
    next(error);
  }
}

async function createReservation(request, response, next) {
  try {
    validateReservationPayload(request.body);

    const room = await roomRepository.findById(request.body.roomId);
    if (!room) {
      throw createHttpError(404, 'Room not found');
    }

    if (request.body.guestCount > room.capacity) {
      throw createHttpError(400, 'guestCount exceeds room capacity');
    }

    const available = await isRoomAvailable(
      request.body.roomId,
      request.body.checkInDate,
      request.body.checkOutDate
    );

    if (!available) {
      throw createHttpError(409, 'Room is not available in the selected date range');
    }

    const customer = await ensureCustomer(request.body.customer);

    const createdReservation = await reservationRepository.create({
      roomId: request.body.roomId,
      customerId: customer.id,
      checkInDate: request.body.checkInDate,
      checkOutDate: request.body.checkOutDate,
      guestCount: request.body.guestCount
    });

    response.status(201).json(createdReservation);
  } catch (error) {
    next(error);
  }
}

async function updateReservation(request, response, next) {
  try {
    validateReservationPayload(request.body);

    const existingReservation = await reservationRepository.findById(request.params.id);
    if (!existingReservation) {
      throw createHttpError(404, 'Reservation not found');
    }

    const room = await roomRepository.findById(request.body.roomId);
    if (!room) {
      throw createHttpError(404, 'Room not found');
    }

    if (request.body.guestCount > room.capacity) {
      throw createHttpError(400, 'guestCount exceeds room capacity');
    }

    const available = await isRoomAvailable(
      request.body.roomId,
      request.body.checkInDate,
      request.body.checkOutDate,
      request.params.id
    );

    if (!available) {
      throw createHttpError(409, 'Room is not available in the selected date range');
    }

    const customer = await ensureCustomer(request.body.customer);

    const updatedReservation = await reservationRepository.update(request.params.id, {
      roomId: request.body.roomId,
      customerId: customer.id,
      checkInDate: request.body.checkInDate,
      checkOutDate: request.body.checkOutDate,
      guestCount: request.body.guestCount
    });

    response.json(updatedReservation);
  } catch (error) {
    next(error);
  }
}

async function cancelReservation(request, response, next) {
  try {
    const existingReservation = await reservationRepository.findById(request.params.id);
    if (!existingReservation) {
      throw createHttpError(404, 'Reservation not found');
    }

    const cancelledReservation = await reservationRepository.cancel(request.params.id);
    response.json(cancelledReservation);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation
};
