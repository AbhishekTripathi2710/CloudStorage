# CloudStore - Modern Cloud Storage Application

A full-stack cloud storage application built with React and Node.js, allowing users to upload, organize, and manage their files securely in the cloud. Features include folder organization, file categorization, search functionality, and real-time storage tracking.

![CloudStore](https://img.shields.io/badge/CloudStore-v1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)

##  Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Components Overview](#-components-overview)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

##  Features

###  Authentication & Security
- User registration and login
- JWT-based authentication with HTTP-only cookies
- Protected routes and API endpoints
- Secure password hashing with bcrypt

###  File Management
- **File Upload**: Upload files of any type to cloud storage (Cloudinary)
- **File Organization**: Create folders to organize files hierarchically
- **File Operations**: 
  - Rename files
  - Delete files
  - Move files between folders
  - Download files
  - Open files in new tab
- **Folder Operations**:
  - Create folders
  - Rename folders
  - Delete folders
  - Navigate through folder hierarchy
- **File Categories**: Automatic categorization into:
  - 📁 Documents (PDF, DOC, DOCX, TXT, MD, etc.)
  - 🖼️ Images (JPG, PNG, GIF, SVG, WEBP, etc.)
  - ▶️ Media (MP4, AVI, MOV, MP3, WAV, etc.)
  - 📊 Others (miscellaneous file types)

###  Search & Navigation
- Real-time file search functionality
- Category-based filtering (Dashboard, Documents, Images, Media, Others)
- Recent files display
- Folder navigation

###  Storage Management
- Storage quota tracking
- Visual storage usage indicator with circular progress
- Storage breakdown by category
- Available storage display

###  Modern UI/UX
- Clean, modern interface with Tailwind CSS
- Responsive design for all screen sizes
- Professional icon system using react-icons
- Smooth animations and transitions
- Success/error notifications
- Drag-and-drop file organization (prepared)
- Action menus with three-dot context menu

## 🛠 Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **React Router DOM 7.9.6** - Client-side routing
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **React Icons** - Icon library (Feather Icons, Font Awesome)
- **Vite 7.2.2** - Build tool and dev server
- **Context API** - State management for auth, files, and notifications

### Backend
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MySQL2 3.3.3** - Database driver
- **Cloudinary 1.41.3** - Cloud storage and image management
- **Multer 2.0.2** - File upload middleware
- **Multer-Storage-Cloudinary 4.0.0** - Cloudinary storage adapter
- **JSON Web Token 9.2.2** - Authentication
- **bcrypt 6.0.0** - Password hashing
- **Cookie Parser 1.4.7** - Cookie parsing middleware
- **CORS 2.8.5** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database for user data, files, and folders

##  Project Structure

```
CloudStorage/
├── backend/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── fileController.js      # File operations
│   │   └── folderController.js    # Folder operations
│   ├── db/
│   │   └── db.js                  # Database connection pool
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── fileRoutes.js          # File endpoints
│   │   └── folderRoutes.js        # Folder endpoints
│   ├── app.js                     # Express app configuration
│   ├── server.js                  # Server entry point
│   └── package.json               # Backend dependencies
│
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── ActionMenu.jsx     # Three-dot context menu
│   │   │   ├── CreateFolderModal.jsx
│   │   │   ├── FileItem.jsx       # File display component
│   │   │   ├── FolderItem.jsx     # Folder display component
│   │   │   ├── Notification.jsx   # Toast notifications
│   │   │   ├── ProtectedRoute.jsx # Route protection
│   │   │   ├── RecentFiles.jsx    # Recent files list
│   │   │   ├── SearchBar.jsx      # Search functionality
│   │   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   │   ├── StorageCard.jsx    # Storage usage display
│   │   │   ├── StorageCategoryCards.jsx # Category breakdown
│   │   │   └── UploadModal.jsx    # File upload modal
│   │   ├── context/               # React Context providers
│   │   │   ├── AuthContext.jsx    # Authentication state
│   │   │   ├── FileContext.jsx    # File operations state
│   │   │   └── NotificationContext.jsx # Notification state
│   │   ├── pages/                 # Page components
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Login.jsx          # Login page
│   │   │   └── Register.jsx       # Registration page
│   │   ├── utils/
│   │   │   └── api.js             # API client configuration
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── package.json               # Frontend dependencies
│   └── vite.config.js             # Vite configuration
│
└── README.md                      # Project documentation
```

##  Installation

### Prerequisites
- Node.js (v20.12.2 or higher recommended)
- MySQL database
- Cloudinary account (for cloud storage)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd CloudStorage
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=cloudstore_db

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=3000
```

4. Create the MySQL database:
```sql
CREATE DATABASE cloudstore_db;
```

5. Create the database tables (run this SQL in your MySQL client):
```sql
-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    storage_allocated BIGINT DEFAULT 2147483648,
    storage_used BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folders table
CREATE TABLE folders (
    folder_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES folders(folder_id) ON DELETE CASCADE
);

-- Files table
CREATE TABLE files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    folder_id INT NULL,
    name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    source_link VARCHAR(500),
    size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(folder_id) ON DELETE SET NULL
);
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload:
nodemon server.js
```

The backend server will run on `http://localhost:3000`

### Step 3: Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (if needed):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is occupied)

### Step 4: Access the Application
Open your browser and navigate to `http://localhost:5173`

##  Configuration

### Cloudinary Setup
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Navigate to your dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these values to your backend `.env` file

### Database Configuration
- Ensure MySQL is running on your machine
- Update database credentials in `backend/.env`
- The default storage allocation is 2GB (2,147,483,648 bytes)

### CORS Configuration
The backend is configured to accept requests from `http://localhost:5173`. Update `backend/app.js` if using a different frontend URL.

##  Usage

### User Registration
1. Navigate to the registration page
2. Enter username, email, and password
3. Click "Register" to create an account
4. You'll be automatically logged in

### Uploading Files
1. Click the "Upload" button in the top bar
2. Select a file from your device
3. Click "Upload" in the modal
4. A success notification will appear
5. The file will appear in your current folder

### Creating Folders
1. Click "New Folder" in the top bar
2. Enter a folder name
3. Click "Create"
4. The folder will appear in your dashboard

**File Actions** (click the three dots ⋮ on any file):
- **Rename**: Change the file name
- **Delete**: Remove the file permanently
- **Download**: Download the file to your device
- **Open**: Open the file in a new tab

### Folder Management

**Creating Folders**:
1. Click "New Folder" in the top bar
2. Enter a folder name
3. Click "Create"
4. The folder will appear in your dashboard

**Folder Actions** (click the three dots ⋮ on any folder):
- **Open**: Navigate into the folder
- **Rename**: Change the folder name
- **Delete**: Remove the folder and its contents

### Category Filtering
- Click on any category in the sidebar (Documents, Images, Media, Others)
- View all files in that category across all folders
- Click "Dashboard" to return to folder view

### Search Files
1. Use the search bar in the top navigation
2. Type the file name you're looking for
3. Click on a result to navigate to that file's folder

##  API Endpoints

### Authentication Routes (`/api`)
- `POST /api/register` - Register a new user
  - Body: `{ username, email, password }`
- `POST /api/login` - Login user
  - Body: `{ email, password }`
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user profile (requires auth)

### File Routes (`/api/files`)
- `POST /api/files/upload` - Upload a file (requires auth)
  - FormData: `{ file, folder_id }`
- `GET /api/files/:folder_id` - List files in a folder (requires auth)
  - Use `"root"` for root folder
- `GET /api/files/search` - Search files (requires auth)
  - Query params: `?query=<search_term>&type=<file_type>`
- `GET /api/files/recent` - Get recent files (requires auth)
- `GET /api/files/storage` - Get storage information (requires auth)
- `POST /api/files/rename` - Rename a file (requires auth)
  - Body: `{ file_id, new_name }`
- `POST /api/files/move` - Move a file (requires auth)
  - Body: `{ file_id, target_folder_id }`
- `DELETE /api/files/:file_id` - Delete a file (requires auth)

### Folder Routes (`/api/folders`)
- `POST /api/folders/create` - Create a folder (requires auth)
  - Body: `{ name, parent_id }`
- `GET /api/folders/all` - List all folders (requires auth)
- `GET /api/folders/:folder_id` - Get folder contents (requires auth)
  - Use `"root"` for root folder
- `POST /api/folders/rename` - Rename a folder (requires auth)
  - Body: `{ folder_id, new_name }`
- `DELETE /api/folders/:folder_id` - Delete a folder (requires auth)

##  Components Overview

### Frontend Components

#### **Pages**
- **Dashboard**: Main application interface with file/folder display
- **Login**: User authentication page
- **Register**: New user registration page

#### **Core Components**
- **FileItem**: Displays individual files with actions menu
- **FolderItem**: Displays folders with navigation
- **ActionMenu**: Three-dot context menu for file/folder actions
- **Sidebar**: Navigation with categories and folder list
- **SearchBar**: Real-time file search functionality
- **UploadModal**: File upload interface with progress
- **CreateFolderModal**: Folder creation interface

#### **Information Components**
- **StorageCard**: Circular progress indicator for storage usage
- **StorageCategoryCards**: Breakdown of storage by category
- **RecentFiles**: List of recently uploaded files
- **Notification**: Toast notification system

#### **Context Providers**
- **AuthContext**: Manages user authentication state
- **FileContext**: Manages file operations and state
- **NotificationContext**: Manages global notifications

##  Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| user_id | INT | Primary key, auto-increment |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | Unique email address |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| storage_allocated | BIGINT | Total storage allocated (bytes) |
| storage_used | BIGINT | Current storage used (bytes) |
| created_at | TIMESTAMP | Account creation timestamp |

### Folders Table
| Column | Type | Description |
|--------|------|-------------|
| folder_id | INT | Primary key, auto-increment |
| user_id | INT | Foreign key to users |
| name | VARCHAR(255) | Folder name |
| parent_id | INT | Foreign key to folders (NULL for root) |
| created_at | TIMESTAMP | Folder creation timestamp |

### Files Table
| Column | Type | Description |
|--------|------|-------------|
| file_id | INT | Primary key, auto-increment |
| user_id | INT | Foreign key to users |
| folder_id | INT | Foreign key to folders (NULL for root) |
| name | VARCHAR(255) | File name |
| file_type | VARCHAR(100) | MIME type |
| source_link | VARCHAR(500) | Cloudinary URL |
| size | BIGINT | File size in bytes |
| uploaded_at | TIMESTAMP | Upload timestamp |

##  Security Features

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Tokens stored in secure HTTP-only cookies
- **Protected Routes**: Client and server-side route protection
- **SQL Injection Prevention**: Parameterized queries with MySQL2
- **File Upload Validation**: File type and size validation
- **CORS Configuration**: Controlled cross-origin resource sharing

##  UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Icons**: Professional icon system with react-icons
- **Smooth Animations**: CSS transitions and animations
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Notifications**: Toast notifications for user actions
- **Category Icons**: Color-coded icons for different file types
- **Storage Visualization**: Circular progress indicator for storage

##  Future Enhancements

- [ ] File sharing with public links
- [ ] File preview functionality
- [ ] Batch file operations
- [ ] File versioning
- [ ] Advanced search filters
- [ ] Dark mode theme
- [ ] Mobile app version
- [ ] Real-time collaboration
- [ ] File compression
- [ ] Advanced folder permissions

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the ISC License.

##  Author

Created as part of a 30-day project challenge.

##  Acknowledgments

- [Cloudinary](https://cloudinary.com/) for cloud storage services
- [React Icons](https://react-icons.github.io/react-icons/) for icon library
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [Vite](https://vitejs.dev/) for build tooling

---

**Note**: This is a learning project. For production use, additional security measures, error handling, and testing should be implemented.

