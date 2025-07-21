# Addissw Backend

A lightweight REST API built with Node.js and Express to manage songs for the Addis Software Test Project. It supports CRUD operations and pagination, using Prisma for database interactions and Zod for request validation.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/redi-b/addissw-backend.git
   cd addissw-backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add:
     ```env
     PORT=5000
     DATABASE_URL=file:./dev.db
     CLIENT_URL=http://localhost:3000
     ```
4. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```
5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   - The API runs at `http://localhost:5000`.

## API Endpoints
| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/`               | Get paginated list of songs     |
| GET    | `/:id`            | Get a single song by ID         |
| POST   | `/`               | Create a new song               |
| POST   | `/seed`           | Seed database with songs        |
| PUT    | `/:id`            | Update a song by ID             |
| DELETE | `/:id`            | Delete a song by ID             |

Example: `GET /?page=1&limit=10` retrieves the first page with 10 songs.
