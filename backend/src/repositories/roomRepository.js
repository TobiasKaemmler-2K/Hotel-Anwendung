const { all, get, run } = require('../config/database');

function parseJsonList(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function parseJsonFeedback(value) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function buildFallbackImages(record) {
  const roomSignature = record.roomNumber || record.room_number || record.id || 'room';

  return Array.from({ length: 8 }, (_, index) => {
    const seed = `mrr-room-${roomSignature}-${index + 1}`;
    return `https://picsum.photos/seed/${seed}/1400/900`;
  });
}

function buildFallbackFeedback(record) {
  const rating = Number(record.rating || 4.6);

  return [
    {
      guestName: 'Sophie K.',
      rating,
      date: '2026-05-09',
      comment: 'Wunderschoenes Zimmer, sehr gepflegt und mit exzellentem Service ueber den gesamten Aufenthalt.'
    },
    {
      guestName: 'Leon M.',
      rating: Math.max(4.0, Number((rating - 0.1).toFixed(1))),
      date: '2026-04-22',
      comment: 'Top Lage in der Altstadt, sehr bequemes Bett und ein ruhiges Ambiente trotz zentraler Position.'
    },
    {
      guestName: 'Nora H.',
      rating: Math.max(4.0, Number((rating - 0.2).toFixed(1))),
      date: '2026-03-15',
      comment: 'Fruehstueck und Concierge waren hervorragend, wir kommen definitiv wieder.'
    }
  ];
}

function mapRoomRecord(record) {
  if (!record) {
    return null;
  }

  const parsedImages = parseJsonList(record.images);
  const parsedFeedback = parseJsonFeedback(record.guestFeedback);

  return {
    ...record,
    name: record.name || `MuenchnerRoyalResidenz Zimmer ${record.roomNumber || record.id}`,
    category: record.category || record.type || 'classic',
    roomSize: record.roomSize || 30,
    bedType: record.bedType || 'King-Size-Bett',
    shortDescription: record.shortDescription || record.description || 'Komfortables Zimmer in zentraler Lage.',
    longDescription:
      record.longDescription ||
      record.description ||
      'Stilvoll eingerichtetes Zimmer mit hochwertiger Ausstattung und persoenlichem Service.',
    floor: record.floor || 1,
    outlook: record.outlook || 'Altstadt',
    rating: record.rating || 4.5,
    amenities: parseJsonList(record.amenities),
    bathroomAmenities: parseJsonList(record.bathroomAmenities),
    technicalAmenities: parseJsonList(record.technicalAmenities),
    luxuryFeatures: parseJsonList(record.luxuryFeatures),
    services: parseJsonList(record.services),
    images: parsedImages.length > 0 ? parsedImages : buildFallbackImages(record),
    highlights: parseJsonList(record.highlights),
    guestFeedback: parsedFeedback.length > 0 ? parsedFeedback : buildFallbackFeedback(record),
    cancellationPolicy: record.cancellationPolicy || 'Kostenfreie Stornierung nach Verfuegbarkeit.',
    checkInNote: record.checkInNote || 'Check-in ab 15:00 Uhr.',
    checkOutNote: record.checkOutNote || 'Check-out bis 11:00 Uhr.'
  };
}

function buildFilterQuery(filters) {
  const conditions = [];
  const params = [];

  if (filters.type || filters.category) {
    conditions.push('r.category = ?');
    params.push(filters.category || filters.type);
  }

  if (filters.minPrice) {
    conditions.push('r.price_per_night >= ?');
    params.push(Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    conditions.push('r.price_per_night <= ?');
    params.push(Number(filters.maxPrice));
  }

  if (filters.guestCount) {
    conditions.push('r.capacity >= ?');
    params.push(Number(filters.guestCount));
  }

  if (filters.minRoomSize) {
    conditions.push('r.room_size_sqm >= ?');
    params.push(Number(filters.minRoomSize));
  }

  if (filters.wifi === 'true') {
    conditions.push('r.has_wifi = 1');
  }

  if (filters.tv === 'true') {
    conditions.push('r.has_tv = 1');
  }

  if (filters.airConditioning === 'true') {
    conditions.push('r.has_air_conditioning = 1');
  }

  if (filters.amenity) {
    conditions.push('LOWER(r.amenities) LIKE ?');
    params.push(`%${String(filters.amenity).toLowerCase()}%`);
  }

  if (filters.service) {
    conditions.push('LOWER(r.services) LIKE ?');
    params.push(`%${String(filters.service).toLowerCase()}%`);
  }

  if (filters.minRating) {
    conditions.push('r.rating >= ?');
    params.push(Number(filters.minRating));
  }

  if (filters.outlook) {
    conditions.push('LOWER(r.outlook) LIKE ?');
    params.push(`%${String(filters.outlook).toLowerCase()}%`);
  }

  if (filters.bedType) {
    conditions.push('LOWER(r.bed_type) LIKE ?');
    params.push(`%${String(filters.bedType).toLowerCase()}%`);
  }

  if (filters.availabilityStatus) {
    conditions.push('r.availability_status = ?');
    params.push(filters.availabilityStatus);
  }

  if (filters.availableFrom && filters.availableTo) {
    conditions.push(`
      NOT EXISTS (
        SELECT 1
        FROM reservations res
        WHERE res.room_id = r.id
          AND res.status = 'active'
          AND res.check_in_date < ?
          AND res.check_out_date > ?
      )
    `);
    params.push(filters.availableTo, filters.availableFrom);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { where, params };
}

async function findAll(filters = {}) {
  const { where, params } = buildFilterQuery(filters);
  let orderBy = 'r.price_per_night ASC, r.room_number ASC';

  if (filters.sortBy === 'price-desc') {
    orderBy = 'r.price_per_night DESC, r.room_number ASC';
  }

  if (filters.sortBy === 'rating-desc') {
    orderBy = 'r.rating DESC, r.price_per_night ASC';
  }

  if (filters.sortBy === 'size-desc') {
    orderBy = 'r.room_size_sqm DESC, r.price_per_night ASC';
  }

  const rows = await all(
    `SELECT
      r.id,
      r.room_number AS roomNumber,
      r.name,
      r.type,
      r.category,
      r.price_per_night AS pricePerNight,
      r.capacity,
      r.floor,
      r.outlook,
      r.rating,
      r.room_size_sqm AS roomSize,
      r.bed_type AS bedType,
      r.has_wifi AS hasWifi,
      r.has_tv AS hasTv,
      r.has_air_conditioning AS hasAirConditioning,
      r.description,
      r.short_description AS shortDescription,
      r.long_description AS longDescription,
      r.amenities,
      r.bathroom_amenities AS bathroomAmenities,
      r.technical_amenities AS technicalAmenities,
      r.luxury_features AS luxuryFeatures,
      r.services,
      r.images,
      r.availability_status AS availabilityStatus,
      r.highlights,
      r.cancellation_policy AS cancellationPolicy,
      r.check_in_note AS checkInNote,
      r.check_out_note AS checkOutNote,
      r.guest_feedback AS guestFeedback
    FROM rooms r
    ${where}
    ORDER BY ${orderBy}`,
    params
  );

  return rows.map(mapRoomRecord);
}

async function findById(roomId) {
  const room = await get(
    `SELECT
      id,
      room_number AS roomNumber,
      name,
      type,
      category,
      price_per_night AS pricePerNight,
      capacity,
      floor,
      outlook,
      rating,
      room_size_sqm AS roomSize,
      bed_type AS bedType,
      has_wifi AS hasWifi,
      has_tv AS hasTv,
      has_air_conditioning AS hasAirConditioning,
      description,
      short_description AS shortDescription,
      long_description AS longDescription,
      amenities,
      bathroom_amenities AS bathroomAmenities,
      technical_amenities AS technicalAmenities,
      luxury_features AS luxuryFeatures,
      services,
      images,
      availability_status AS availabilityStatus,
      highlights,
      cancellation_policy AS cancellationPolicy,
      check_in_note AS checkInNote,
      check_out_note AS checkOutNote,
      guest_feedback AS guestFeedback
    FROM rooms
    WHERE id = ?`,
    [roomId]
  );

  return mapRoomRecord(room);
}

async function create(room) {
  const category = room.category || room.type;

  const result = await run(
    `INSERT INTO rooms (
      room_number,
      type,
      category,
      price_per_night,
      capacity,
      floor,
      outlook,
      rating,
      has_wifi,
      has_tv,
      has_air_conditioning,
      description,
      name,
      room_size_sqm,
      bed_type,
      short_description,
      long_description,
      amenities,
      bathroom_amenities,
      technical_amenities,
      luxury_features,
      services,
      images,
      availability_status,
      highlights,
      cancellation_policy,
      check_in_note,
      check_out_note,
      guest_feedback
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [
      room.roomNumber,
      category,
      category,
      room.pricePerNight,
      room.capacity,
      room.floor || 1,
      room.outlook || 'Altstadt',
      room.rating || 4.5,
      room.hasWifi ? 1 : 0,
      room.hasTv ? 1 : 0,
      room.hasAirConditioning ? 1 : 0,
      room.description || room.shortDescription || '',
      room.name || `MünchnerRoyalResidenz Zimmer ${room.roomNumber}`,
      room.roomSize || 30,
      room.bedType || 'King-Size-Bett',
      room.shortDescription || room.description || '',
      room.longDescription || room.description || '',
      JSON.stringify(room.amenities || []),
      JSON.stringify(room.bathroomAmenities || []),
      JSON.stringify(room.technicalAmenities || []),
      JSON.stringify(room.luxuryFeatures || []),
      JSON.stringify(room.services || []),
      JSON.stringify(room.images || []),
      room.availabilityStatus || 'available',
      JSON.stringify(room.highlights || []),
      room.cancellationPolicy || 'Kostenfreie Stornierung nach Verfuegbarkeit.',
      room.checkInNote || 'Check-in ab 15:00 Uhr.',
      room.checkOutNote || 'Check-out bis 11:00 Uhr.',
      JSON.stringify(room.guestFeedback || [])
    ]
  );

  return findById(result.id);
}

async function update(roomId, room) {
  const category = room.category || room.type;

  await run(
    `UPDATE rooms
     SET room_number = ?,
         type = ?,
         category = ?,
         price_per_night = ?,
         capacity = ?,
         floor = ?,
         outlook = ?,
         rating = ?,
         has_wifi = ?,
         has_tv = ?,
         has_air_conditioning = ?,
         description = ?,
         name = ?,
         room_size_sqm = ?,
         bed_type = ?,
         short_description = ?,
         long_description = ?,
         amenities = ?,
        bathroom_amenities = ?,
        technical_amenities = ?,
        luxury_features = ?,
         services = ?,
         images = ?,
         availability_status = ?,
        highlights = ?,
        cancellation_policy = ?,
        check_in_note = ?,
        check_out_note = ?,
        guest_feedback = ?
     WHERE id = ?`,
    [
      room.roomNumber,
      category,
      category,
      room.pricePerNight,
      room.capacity,
      room.floor || 1,
      room.outlook || 'Altstadt',
      room.rating || 4.5,
      room.hasWifi ? 1 : 0,
      room.hasTv ? 1 : 0,
      room.hasAirConditioning ? 1 : 0,
      room.description || room.shortDescription || '',
      room.name || `MünchnerRoyalResidenz Zimmer ${room.roomNumber}`,
      room.roomSize || 30,
      room.bedType || 'King-Size-Bett',
      room.shortDescription || room.description || '',
      room.longDescription || room.description || '',
      JSON.stringify(room.amenities || []),
      JSON.stringify(room.bathroomAmenities || []),
      JSON.stringify(room.technicalAmenities || []),
      JSON.stringify(room.luxuryFeatures || []),
      JSON.stringify(room.services || []),
      JSON.stringify(room.images || []),
      room.availabilityStatus || 'available',
      JSON.stringify(room.highlights || []),
      room.cancellationPolicy || 'Kostenfreie Stornierung nach Verfuegbarkeit.',
      room.checkInNote || 'Check-in ab 15:00 Uhr.',
      room.checkOutNote || 'Check-out bis 11:00 Uhr.',
      JSON.stringify(room.guestFeedback || []),
      roomId
    ]
  );

  return findById(roomId);
}

async function remove(roomId) {
  return run('DELETE FROM rooms WHERE id = ?', [roomId]);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
