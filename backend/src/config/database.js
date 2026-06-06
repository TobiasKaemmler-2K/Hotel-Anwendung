const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databaseFile = process.env.DB_FILE || './data/hotel.db';
const databasePath = path.resolve(process.cwd(), databaseFile);

const db = new sqlite3.Database(databasePath);

async function ensureColumn(tableName, columnName, columnDefinition) {
  const columns = await all(`PRAGMA table_info(${tableName})`);
  const hasColumn = columns.some((column) => column.name === columnName);

  if (!hasColumn) {
    await run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
  }
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
}

async function seedRooms() {
  const existing = await get('SELECT COUNT(*) AS total FROM rooms');
  if (existing.total > 0) {
    return;
  }

  const roomCategories = [
    {
      category: 'classic',
      basePrice: 210,
      maxGuests: 2,
      roomSize: 28,
      outlook: 'Innenhof und Altstadtdaecher',
      bedType: 'Queen-Size-Bett',
      shortDescription: 'Ruhiges Classic Zimmer mit Blick auf historische Innenhoefe.',
      longDescription:
        'Das Classic Zimmer der MuenchnerRoyalResidenz verbindet warme Naturtoene mit dezenten Messingakzenten. Es bietet einen stilvollen Rueckzugsort nach einem Tag in der Altstadt.',
      amenities: ['Regendusche', 'Nespresso-Maschine', 'Highspeed-WLAN', 'Smart-TV', 'Sitzbereich'],
      bathroomAmenities: ['Walk-in-Regendusche', 'Naturstein-Waschtisch', 'Pflegeset', 'Handtuchwaermer'],
      technicalAmenities: ['65 Zoll Smart-TV', 'Bluetooth-Soundsystem', 'USB-C Ladeports', 'Digitaler Safe'],
      luxuryFeatures: ['Edle Stoffe aus Bayern', 'Schallisolierte Fenster', 'Abendlicher Turndown-Service'],
      services: ['24h Concierge', 'Turndown-Service', 'Fruehstueck auf Wunsch'],
      highlights: ['Direkter Blick in den Innenhof', 'Schallisolierte Fenster'],
      cancellationPolicy: 'Kostenfreie Stornierung bis 48 Stunden vor Anreise.',
      checkInNote: 'Check-in ab 15:00 Uhr. Frueher Check-in nach Verfuegbarkeit.',
      checkOutNote: 'Check-out bis 11:00 Uhr. Late Check-out auf Anfrage.'
    },
    {
      category: 'deluxe',
      basePrice: 310,
      maxGuests: 3,
      roomSize: 36,
      outlook: 'Altstadtgassen und Kirchturmspitzen',
      bedType: 'King-Size-Bett',
      shortDescription: 'Elegantes Deluxe Zimmer mit grosszuegigem Lounge-Bereich.',
      longDescription:
        'Das Deluxe Zimmer bietet mehr Raum, eine feine Materialauswahl und eine harmonische Lichtinszenierung. Ideal fuer Gaeste, die Komfort und zentrale Lage verbinden moechten.',
      amenities: ['Marmorbadezimmer', 'Dyson-Haartrockner', 'Smart-TV', 'Minibar inklusive Softdrinks'],
      bathroomAmenities: ['Marmorbadezimmer', 'Regendusche', 'Kosmetikspiegel', 'Luxuspflegeprodukte'],
      technicalAmenities: ['65 Zoll Smart-TV', 'Streaming-Hub', 'Highspeed-WLAN', 'Ambient-Lichtsteuerung'],
      luxuryFeatures: ['Private Kaffee-Bar', 'Designermobiliar', 'Premium-Bettwaesche'],
      services: ['24h Concierge', 'Waescheservice', 'Abendlicher Turndown-Service'],
      highlights: ['Bayerische Designelemente', 'Arbeitsbereich mit Lederstuhl']
      ,
      cancellationPolicy: 'Kostenfreie Stornierung bis 72 Stunden vor Anreise.',
      checkInNote: 'Check-in ab 15:00 Uhr, persoenliche Begruessung an der Rezeption.',
      checkOutNote: 'Check-out bis 11:00 Uhr, Gepaeckservice inklusive.'
    },
    {
      category: 'junior-suite',
      basePrice: 430,
      maxGuests: 3,
      roomSize: 48,
      outlook: 'Residenz und historische Dachlandschaft',
      bedType: 'King-Size-Bett + Daybed',
      shortDescription: 'Grosszuegige Junior Suite mit separatem Wohnbereich.',
      longDescription:
        'Die Junior Suite kombiniert ein repraesentatives Wohngefuehl mit diskreter Eleganz. Perfekt fuer laengere Aufenthalte und besondere Anlaesse im Herzen Muenchens.',
      amenities: ['Freistehende Badewanne', 'Espresso-Bar', 'Bluetooth-Soundsystem', 'Ankleidebereich'],
      bathroomAmenities: ['Freistehende Badewanne', 'Doppelwaschbecken', 'Regendusche', 'Naturkosmetik-Linie'],
      technicalAmenities: ['75 Zoll Smart-TV', 'Schnelles Glasfaser-WLAN', 'Kabellose Ladestation', 'Mood-Lighting'],
      luxuryFeatures: ['Separater Wohnbereich', 'Pillow-Menu', 'Persoenlicher Aufdeckservice'],
      services: ['Privater Check-in', 'Concierge-Prioritaet', 'Pillow-Menu'],
      highlights: ['Panoramafenster', 'Blick auf Altstadt-Daecher']
      ,
      cancellationPolicy: 'Kostenfreie Stornierung bis 5 Tage vor Anreise.',
      checkInNote: 'Privater Check-in in der Lounge ab 14:30 Uhr.',
      checkOutNote: 'Check-out bis 12:00 Uhr fuer Suite-Gaeste.'
    },
    {
      category: 'residenz-suite',
      basePrice: 620,
      maxGuests: 4,
      roomSize: 68,
      outlook: 'Panoramablick ueber die Muenchner Altstadt',
      bedType: 'King-Size-Bett + Schlafsofa',
      shortDescription: 'Exklusive Suite mit Salon, Dining-Nische und Altstadtblick.',
      longDescription:
        'Die Residenz Suite repraesentiert das hoechste Niveau urbaner Gastlichkeit der MuenchnerRoyalResidenz. Handverlesene Materialien, grosszuegige Raumwirkung und individueller Service stehen im Mittelpunkt.',
      amenities: ['Privater Salon', 'Vinothek-Auswahl', 'Grosser Smart-TV', 'Walk-in-Dusche und Badewanne'],
      bathroomAmenities: ['Marmor-Spa-Bad', 'Freistehende Wanne', 'Dampfsauna-Funktion', 'Luxusduftkollektion'],
      technicalAmenities: ['85 Zoll Smart-TV', 'Smart-Room-Steuerung', 'Highspeed-WLAN', 'Privates Soundsystem'],
      luxuryFeatures: ['Privater Dining-Bereich', 'Butler-Service auf Anfrage', 'Signatur-Kunstobjekte'],
      services: ['Butler auf Anfrage', 'Limousinenservice', 'In-Suite Dining'],
      highlights: ['Signatur-Suite-Design', 'Bevorzugte Spa-Buchung']
      ,
      cancellationPolicy: 'Kostenfreie Stornierung bis 7 Tage vor Anreise.',
      checkInNote: 'Exklusiver Check-in ab 14:00 Uhr mit Welcome-Service.',
      checkOutNote: 'Check-out bis 12:00 Uhr, Late Check-out nach Verfuegbarkeit.'
    }
  ];

  const sampleRooms = [];

  for (let index = 0; index < 30; index += 1) {
    const categoryTemplate = roomCategories[index % roomCategories.length];
    const floor = Math.floor(index / 10) + 1;
    const roomOnFloor = (index % 10) + 1;
    const roomNumber = `${floor}${String(roomOnFloor).padStart(2, '0')}`;
    const premiumFactor = floor * 12 + roomOnFloor;

    const rating = Number((4.3 + (roomOnFloor % 6) * 0.1).toFixed(1));
    const availabilityStatus = roomOnFloor % 6 === 0 ? 'booked' : roomOnFloor % 5 === 0 ? 'limited' : 'available';
    const imageBase = [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      'https://images.unsplash.com/photo-1616594039964-3b2ef36f2d77',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'https://images.unsplash.com/photo-1617104551722-3b2d51366405'
    ];

    sampleRooms.push([
      roomNumber,
      categoryTemplate.category,
      categoryTemplate.category,
      categoryTemplate.basePrice + premiumFactor,
      categoryTemplate.maxGuests,
      floor,
      categoryTemplate.outlook,
      rating,
      1,
      1,
      1,
      categoryTemplate.shortDescription,
      `MünchnerRoyalResidenz ${categoryTemplate.category} ${roomNumber}`,
      categoryTemplate.roomSize + (roomOnFloor % 3),
      categoryTemplate.bedType,
      categoryTemplate.shortDescription,
      `${categoryTemplate.longDescription} Zimmernummer ${roomNumber} liegt in einer besonders ruhigen Lage und ist mit edlen Stoffen gestaltet.`,
      JSON.stringify(categoryTemplate.amenities),
      JSON.stringify(categoryTemplate.bathroomAmenities),
      JSON.stringify(categoryTemplate.technicalAmenities),
      JSON.stringify(categoryTemplate.luxuryFeatures),
      JSON.stringify(categoryTemplate.services),
      JSON.stringify(
        imageBase.map((baseUrl, imageIndex) =>
          `${baseUrl}?auto=format&fit=crop&w=1400&q=80&sig=${roomNumber}${imageIndex + 1}`
        )
      ),
      availabilityStatus,
      JSON.stringify(categoryTemplate.highlights),
      categoryTemplate.cancellationPolicy,
      categoryTemplate.checkInNote,
      categoryTemplate.checkOutNote,
      JSON.stringify([
        {
          guestName: 'Anna S.',
          rating,
          date: '2026-04-18',
          comment: 'Sehr schoenes Zimmer mit hochwertiger Ausstattung und tollem Blick auf die Altstadt.'
        },
        {
          guestName: 'Michael B.',
          rating: Math.max(4.0, rating - 0.1),
          date: '2026-03-07',
          comment: 'Der Service war ausgezeichnet, besonders der Concierge war sehr aufmerksam.'
        },
        {
          guestName: 'Clara F.',
          rating: Math.max(4.0, rating - 0.2),
          date: '2026-02-12',
          comment: 'Die Suite war ruhig, sauber und perfekt fuer ein Wochenende in Muenchen.'
        }
      ])
    ]);
  }

  for (const room of sampleRooms) {
    await run(
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
      room
    );
  }
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_number TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      category TEXT,
      price_per_night REAL NOT NULL,
      capacity INTEGER NOT NULL,
      floor INTEGER,
      outlook TEXT,
      rating REAL DEFAULT 4.5,
      has_wifi INTEGER NOT NULL DEFAULT 0,
      has_tv INTEGER NOT NULL DEFAULT 0,
      has_air_conditioning INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      name TEXT,
      room_size_sqm INTEGER,
      bed_type TEXT,
      short_description TEXT,
      long_description TEXT,
      amenities TEXT,
      bathroom_amenities TEXT,
      technical_amenities TEXT,
      luxury_features TEXT,
      services TEXT,
      images TEXT,
      availability_status TEXT,
      highlights TEXT,
      cancellation_policy TEXT,
      check_in_note TEXT,
      check_out_note TEXT,
      guest_feedback TEXT
    )
  `);

  await ensureColumn('rooms', 'category', 'TEXT');
  await ensureColumn('rooms', 'name', 'TEXT');
  await ensureColumn('rooms', 'floor', 'INTEGER');
  await ensureColumn('rooms', 'outlook', 'TEXT');
  await ensureColumn('rooms', 'rating', 'REAL DEFAULT 4.5');
  await ensureColumn('rooms', 'room_size_sqm', 'INTEGER');
  await ensureColumn('rooms', 'bed_type', 'TEXT');
  await ensureColumn('rooms', 'short_description', 'TEXT');
  await ensureColumn('rooms', 'long_description', 'TEXT');
  await ensureColumn('rooms', 'amenities', 'TEXT');
  await ensureColumn('rooms', 'bathroom_amenities', 'TEXT');
  await ensureColumn('rooms', 'technical_amenities', 'TEXT');
  await ensureColumn('rooms', 'luxury_features', 'TEXT');
  await ensureColumn('rooms', 'services', 'TEXT');
  await ensureColumn('rooms', 'images', 'TEXT');
  await ensureColumn('rooms', 'availability_status', "TEXT DEFAULT 'available'");
  await ensureColumn('rooms', 'highlights', 'TEXT');
  await ensureColumn('rooms', 'cancellation_policy', 'TEXT');
  await ensureColumn('rooms', 'check_in_note', 'TEXT');
  await ensureColumn('rooms', 'check_out_note', 'TEXT');
  await ensureColumn('rooms', 'guest_feedback', 'TEXT');

  await run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      check_in_date TEXT NOT NULL,
      check_out_date TEXT NOT NULL,
      guest_count INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  await seedRooms();
}

module.exports = {
  db,
  run,
  get,
  all,
  initializeDatabase
};
