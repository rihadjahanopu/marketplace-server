# Marketplace Server

## 🚀 Overview
This is the robust backend API for the Marketplace application. It provides essential services like user authentication, product management, and media uploading. The server is built with Express and TypeScript, utilizing MongoDB for data persistence and Cloudinary for asset management.

## 🛠️ Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB & Mongoose
- **Authentication:** Better Auth, JWT (JSON Web Tokens), bcryptjs
- **Media Storage:** Cloudinary (via Multer)
- **Security:** Helmet, CORS
- **Validation:** Express Validator

## 🔑 Database Models
- **`User`**: Stores user authentication credentials, roles (admin/user), and profile metadata.
- **`Item`**: Represents marketplace listings. Includes fields for title, description, price, condition, uploaded image URLs, and a reference to the seller (`User` model).

## 📡 API Endpoints Overview
- **`/api/auth/*`**: Handled by Better Auth. Manages sign-up, sign-in, sign-out, session validation, and OAuth integrations.
- **`/api/me`**: Retrieves the currently authenticated user's profile information.
- **`/api/items`**: RESTful endpoints to create, read, update, and delete marketplace items. Includes search and filtering parameters.
- **`/api/upload`**: Handles `multipart/form-data` uploads. Processes images via Multer and uploads them directly to Cloudinary, returning the secure asset URLs.
- **`/api/admin`**: Protected routes restricted to users with admin privileges. Used for platform moderation and user management.
- **`/api/health`**: Simple health check endpoint.

## 🛡️ Security & Performance
- **Authentication**: Stateless, secure sessions managed via Better Auth.
- **Payload Limits**: JSON body parsing is restricted to `10mb` to prevent payload abuse.
- **Headers**: Helmet is used to secure HTTP headers automatically.
- **Validation**: All incoming requests on critical routes are validated using `express-validator` to prevent injection and malformed data errors.

## 📦 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   **Required Variables:**
   - `PORT`: Server port (e.g., 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET` / `BETTER_AUTH_SECRET`: Secure random strings for token signing
   - `CLOUDINARY_*`: Credentials for image uploading

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000` and automatically reloads on file changes using `tsx`.

## 📁 Project Structure
- `src/controllers/`: Core business logic handling the request/response cycle.
- `src/models/`: Mongoose schemas defining the structure of database documents.
- `src/routes/`: Express route definitions connecting URLs to controllers.
- `src/middleware/`: Custom Express middleware (e.g., authentication checks, error handling, Multer file uploads).
- `src/utils/`: Helper functions, database connection logic, and third-party configuration (Cloudinary).
- `src/server.ts`: The main entry point that configures Express and mounts routes.

## 📜 Available Scripts
- `npm run dev`: Starts the development server with hot-reloading (`tsx watch`).
- `npm run build`: Compiles the TypeScript source code into JavaScript in the `dist` directory.
- `npm run start`: Starts the production server using the compiled files.
