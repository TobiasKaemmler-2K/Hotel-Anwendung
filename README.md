# Hotelverwaltung mit Angular und REST-Backend

## Projektbeschreibung
Dieses Projekt ist eine vollständige Beispielanwendung für eine Hotelverwaltung.
Im Frontend können Zimmer angezeigt und nach Kriterien gefiltert werden.
Zusätzlich lassen sich Reservierungen erstellen, bearbeiten, anzeigen und stornieren.
Das Backend stellt eine REST-API bereit und speichert Daten dauerhaft in einer lokalen SQLite-Datenbank.

## Verwendete Technologien
- Frontend: Angular (Standalone Components, Routing, Reactive Forms)
- Backend: Node.js mit Express
- Datenbank: SQLite
- Sprache: TypeScript (Frontend), JavaScript (Backend)

## Projektstruktur
- `backend/` REST-API und Datenbankanbindung
- `frontend/` Angular-Anwendung
- `README.md` Dokumentation und Startanleitung

## Installationsanleitung
Voraussetzungen:
- Node.js ab Version 18
- npm

### 1) Backend installieren
```bash
cd backend
npm install
```

### 2) Frontend installieren
```bash
cd ../frontend
npm install
```

## Startanleitung
Es werden zwei Terminals empfohlen.

### Terminal 1: Backend starten
```bash
cd backend
npm run dev
```
Standardport: `3000`

Sicherheitsrelevante Umgebungsvariablen (Backend):
- `ADMIN_API_KEY` (erforderlich fuer Admin-Endpunkte)
- `ALLOWED_ORIGINS` (optional, Komma-getrennt; Standard: `http://localhost:4200`)

PowerShell-Beispiel vor dem Start:
```powershell
$env:ADMIN_API_KEY="dein-starker-schluessel"
$env:ALLOWED_ORIGINS="http://localhost:4200"
npm run dev
```

### Terminal 2: Frontend starten
```bash
cd frontend
npm start
```
Standard-URL: `http://localhost:4200`

## REST-Endpunkte
Basis-URL: `http://localhost:3000/api`

### Health
- `GET /health` - API-Status prüfen

### Zimmer
- `GET /rooms` - alle Zimmer abrufen
- `GET /rooms/:id` - ein Zimmer abrufen
- `POST /rooms` - Zimmer anlegen (`X-API-Key` erforderlich)
- `PUT /rooms/:id` - Zimmer aktualisieren (`X-API-Key` erforderlich)
- `DELETE /rooms/:id` - Zimmer löschen (`X-API-Key` erforderlich)

Filtermöglichkeiten bei `GET /rooms`:
- `type` (z. B. single, double)
- `minPrice`
- `maxPrice`
- `wifi=true`
- `tv=true`
- `airConditioning=true`
- `availableFrom=YYYY-MM-DD`
- `availableTo=YYYY-MM-DD`

### Reservierungen
- `GET /reservations` - alle Reservierungen abrufen (`X-API-Key` erforderlich)
- `GET /reservations/:id` - eine Reservierung abrufen (`X-API-Key` erforderlich)
- `POST /reservations` - neue Reservierung erstellen
- `PUT /reservations/:id` - Reservierung bearbeiten
- `DELETE /reservations/:id` - Reservierung stornieren (Status = cancelled)

## Security-Mechanismen
- `helmet` fuer sichere HTTP-Header
- CORS-Whitelist ueber `ALLOWED_ORIGINS`
- Globales API-Rate-Limit fuer `/api`
- SQL-Injection-Pattern-Blocker fuer Query, Body und Params
- Admin-Endpunkte mit `X-API-Key`-Pruefung
- Route-Param-Validierung fuer numerische IDs

Beispiel-Payload für `POST /reservations` und `PUT /reservations/:id`:
```json
{
  "roomId": 2,
  "checkInDate": "2026-07-20",
  "checkOutDate": "2026-07-24",
  "guestCount": 2,
  "customer": {
    "firstName": "Anna",
    "lastName": "Schmidt",
    "email": "anna.schmidt@example.com",
    "phone": "+49 171 1234567"
  }
}
```

## Datenbankstruktur
Die SQLite-Datenbank liegt in:
- `backend/data/hotel.db`

Das Datenmodell umfasst drei Tabellen:

1. `rooms`
- Stammdaten zu Zimmern
- Wichtige Felder: `room_number`, `type`, `price_per_night`, `capacity`, Ausstattungsmerkmale

2. `customers`
- Kundendaten für Reservierungen
- Wichtige Felder: `first_name`, `last_name`, `email`, `phone`

3. `reservations`
- Verknüpft Zimmer und Kunden mit Datum und Status
- Wichtige Felder: `room_id`, `customer_id`, `check_in_date`, `check_out_date`, `guest_count`, `status`

Beim Start des Backends werden Tabellen automatisch angelegt.
Wenn noch keine Zimmer vorhanden sind, werden Beispieldaten eingefügt.
Zusätzlich liegen SQL-Dateien für Schema und Seed unter:
- `backend/data/schema.sql`
- `backend/data/seed.sql`

## Hinweise zur Clean-Code-Struktur
- Trennung von Routen, Controllern, Services und Repositories im Backend
- Wiederverwendbare Service-Klassen im Frontend für API-Kommunikation
- Klare Modelle/Interfaces für Zimmer, Kunden und Reservierungen
- Kleine, verständliche Funktionen mit eindeutigen Bezeichnungen
- Fehlerbehandlung mit sinnvollen HTTP-Statuscodes
- Formulare mit Validierung und nachvollziehbarer Benutzerführung
