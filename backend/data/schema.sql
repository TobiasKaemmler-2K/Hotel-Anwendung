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
  room_size_sqm INTEGER,
  bed_type TEXT,
  has_wifi INTEGER NOT NULL DEFAULT 0,
  has_tv INTEGER NOT NULL DEFAULT 0,
  has_air_conditioning INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  name TEXT,
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
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL
);

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
);
