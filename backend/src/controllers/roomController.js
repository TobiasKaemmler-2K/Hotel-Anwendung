const roomRepository = require('../repositories/roomRepository');
const { validateDateRange } = require('../services/availabilityService');

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateRoomPayload(room) {
  if (!room.roomNumber || (!room.type && !room.category)) {
    throw createHttpError(400, 'roomNumber and category are required');
  }

  if (!room.pricePerNight || Number(room.pricePerNight) <= 0) {
    throw createHttpError(400, 'pricePerNight must be greater than 0');
  }

  if (!room.capacity || Number(room.capacity) <= 0) {
    throw createHttpError(400, 'capacity must be greater than 0');
  }
}

async function getRooms(request, response, next) {
  try {
    const { availableFrom, availableTo } = request.query;

    if ((availableFrom && !availableTo) || (!availableFrom && availableTo)) {
      throw createHttpError(400, 'availableFrom and availableTo must be provided together');
    }

    if (availableFrom && availableTo && !validateDateRange(availableFrom, availableTo)) {
      throw createHttpError(400, 'Invalid availability date range');
    }

    const rooms = await roomRepository.findAll(request.query);
    response.json(rooms);
  } catch (error) {
    next(error);
  }
}

async function getRoomById(request, response, next) {
  try {
    const room = await roomRepository.findById(request.params.id);

    if (!room) {
      throw createHttpError(404, 'Room not found');
    }

    response.json(room);
  } catch (error) {
    next(error);
  }
}

async function createRoom(request, response, next) {
  try {
    validateRoomPayload(request.body);

    const createdRoom = await roomRepository.create(request.body);
    response.status(201).json(createdRoom);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      next(createHttpError(409, 'Room number already exists'));
      return;
    }
    next(error);
  }
}

async function updateRoom(request, response, next) {
  try {
    validateRoomPayload(request.body);

    const existingRoom = await roomRepository.findById(request.params.id);
    if (!existingRoom) {
      throw createHttpError(404, 'Room not found');
    }

    const updatedRoom = await roomRepository.update(request.params.id, request.body);
    response.json(updatedRoom);
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      next(createHttpError(409, 'Room number already exists'));
      return;
    }
    next(error);
  }
}

async function deleteRoom(request, response, next) {
  try {
    const existingRoom = await roomRepository.findById(request.params.id);
    if (!existingRoom) {
      throw createHttpError(404, 'Room not found');
    }

    await roomRepository.remove(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};
