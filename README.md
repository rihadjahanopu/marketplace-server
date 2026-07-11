# Marketplace Server

<div align="center">
  <h3>
    <a href="https://your-api-live-link.com/api/health">
      🌐 View Live API (Health Check)
    </a>
  </h3>
  <p>The robust and secure backend powering the modern Marketplace application.</p>
</div>

---

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

## 📁 Folder Structure
```text
marketplace-server/
├── src/                    # Source code
│   ├── controllers/        # Core business logic handling the request/response cycle
│   ├── middleware/         # Custom Express middleware (e.g., authentication, Multer file uploads, error handling)
│   ├── models/             # Mongoose schemas defining the structure of database documents (User, Item)
│   ├── routes/             # Express route definitions connecting URLs to controllers
│   ├── utils/              # Helper functions, database connection logic, and third-party configuration (Cloudinary)
│   └── server.ts           # The main entry point that configures Express and mounts routes
├── dist/                   # Compiled JavaScript files (generated after build)
├── .env                    # Environment variables (secrets, DB URI, ports)
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript compiler configuration
```

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

## 📜 Available Scripts
- `npm run dev`: Starts the development server with hot-reloading (`tsx watch`).
- `npm run build`: Compiles the TypeScript source code into JavaScript in the `dist` directory.
- `npm run start`: Starts the production server using the compiled files.
