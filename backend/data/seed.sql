INSERT INTO rooms (
  room_number,
  type,
  price_per_night,
  capacity,
  has_wifi,
  has_tv,
  has_air_conditioning,
  description
)
VALUES
  ('101', 'single', 79.0, 1, 1, 1, 0, 'Kompaktes Einzelzimmer mit Schreibtisch.'),
  ('102', 'double', 119.0, 2, 1, 1, 1, 'Helles Doppelzimmer mit Stadtblick.'),
  ('201', 'double', 129.0, 2, 1, 1, 1, 'Ruhiges Doppelzimmer zur Hofseite.'),
  ('202', 'family', 169.0, 4, 1, 1, 1, 'Familienzimmer mit Schlafsofa.'),
  ('301', 'suite', 229.0, 3, 1, 1, 1, 'Suite mit Wohnbereich und Balkon.');
