# WasteZero - Eco-friendly Waste Management Platform

**WasteZero** is a comprehensive environmental impact management platform that connects individuals (volunteers), NGOs, and waste management authorities. It facilitates scheduled waste pickups, environmental cleanup opportunities, and real-time impact tracking. The platform features role-based dashboards, real-time communication, and detailed analytics to promote responsible waste management.

## 🌟 Key Features

### Multi-Role Dashboard System

 **Admin Dashboard:**
* **Platform Oversight:** Visual analytics using `Recharts` for total waste collected, CO₂ saved, and platform growth.
* **User Management:** Capabilities to suspend/unsuspend users and manage roles.
* **NGO Verification:** Workflow to approve, reject, or disable NGO accounts.
* **Leaderboards:** Track top-performing NGOs and active users.


**NGO Dashboard:**
* **Opportunity Management:** Create, edit, and delete eco-drives and volunteering events.
* **Applicant Review:** Manage volunteer applications with Accept/Reject workflows.
* **Pickup Management:** View and manage waste collection requests assigned to the NGO.
* **Impact Analytics:** Visual breakdown of waste types collected and opportunities posted.


**User Dashboard:**
* **Impact Tracking:** Real-time calculation of total waste recycled and CO₂ emission savings.
* **Pickup History:** Status tracking of scheduled pickups (Pending, Approved, Completed).
* **Waste Breakdown:** Pie charts visualizing personal waste distribution (Plastic, Organic, E-Waste, etc.).
* **Enrolled Activities:** Track status of applied volunteering opportunities.



### Advanced Waste & Opportunity Management

 **Smart Scheduling System:**
* Schedule pickups with specific time slots, waste types (Plastic, Metal, E-waste, etc.), and quantities.
* Manage address and contact details for logistics.


 **Opportunity Matching:**
* **Skill-Based Matching:** Automatic calculation of match percentage based on user skills vs. opportunity requirements.
* **Visual Indicators:** Color-coded match badges (e.g., "80% Match") on opportunity cards.
* **Filtering:** Advanced filtering by location, waste type, and category.



### Robust Authentication & Security

 **Hybrid Authentication:**
* **Local Auth:** Secure email/password login with BCrypt hashing.
* **OAuth 2.0:** One-click login via **Google** and **GitHub** using Passport.js.
* **OTP Verification:** Email-based OTP verification for account creation and password resets using `Nodemailer`.


 **Role-Based Access Control (RBAC):**
* Strict middleware protection (`requireAuth`, `requireAdmin`, `roleCheck`) for API routes.
* **Helmet** integration for securing HTTP headers.



### Real-Time Communication

**Socket.IO Integration:**
* **Live Chat:** 1-to-1 messaging between Users, NGOs, and Admins.
* **Instant Notifications:** Real-time alerts for application status changes, new messages, and pickup updates.


**Notification Center:**
* In-app bell icon with unread count badges.
* Persistent notification history stored in MongoDB.



---

## 🚀 Technology Stack

### Frontend (Client-Side)

* **React:** `^19.1.1` - Modern library for building user interfaces.
* **Vite:** `^7.1.7` - Next-generation frontend tooling.
* **Tailwind CSS:** `^4.1.17` - Utility-first CSS framework for rapid UI development.
* **React Router DOM:** `^7.9.4` - Declarative routing for React web applications.
* **Recharts:** `^3.5.1` - Composable charting library built on React components.
* **Socket.io-client:** `^4.8.1` - Real-time bidirectional event-based communication.
* **Axios:** `^1.13.0` - Promise-based HTTP client for the browser.
* **Lucide React:** `^0.548.0` - Beautiful & consistent icon library.

### Backend (Server-Side)

* **Node.js & Express:** `^5.1.0` - Fast, unopinionated, minimalist web framework.
* **MongoDB & Mongoose:** `^8.19.3` - NoSQL database and elegant object modeling.
* **Socket.io:** `^4.8.1` - Real-time event server for chat and notifications.
* **Authentication:**
* **Passport:** `^0.7.0` (with `passport-google-oauth20` & `passport-github2`).
* **JsonWebToken:** `^9.0.2` - Stateless authentication tokens.
* **Bcryptjs:** `^3.0.3` - Library to hash passwords.


**Utilities & Security:**
* **Nodemailer:** `^7.0.10` - Secure email sending for OTPs and alerts.
* **Dotenv:** `^17.2.3` - Environment variable management.
* **Helmet:** `^8.1.0` - Secure Express apps by setting various HTTP headers.
* **Cors:** `^2.8.5` - Cross-Origin Resource Sharing.



---

## 📁 Project Structure

```bash
WasteZero/
├── WasteZero_Backend/           # Server-side Application
│   ├── config/
│   │   └── passport.js          # Passport.js authentication strategies
│   ├── controllers/             # Request handlers
│   │   ├── admin.controller.js
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── messageController.js
│   │   ├── notficationController.js
│   │   ├── opportunity.controller.js
│   │   ├── pickupController.js
│   │   └── userController.js    #
│   ├── middlewares/             # Custom Express middlewares
│   │   ├── adminOnly.js
│   │   ├── authMiddleware.js
│   │   ├── requireAdmin.js
│   │   ├── roleCheck.js
│   │   └── roleMiddleware.js    #
│   ├── models/                  # Mongoose Database Models
│   │   ├── Application.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Opportunity.js
│   │   ├── Pickup.js
│   │   └── user.js              #
│   ├── routes/                  # API Route Definitions
│   │   ├── admin.routes.js
│   │   ├── application.routes.js
│   │   ├── auth.js
│   │   ├── chat.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── notification.routes.js
│   │   ├── opportunity.routes.js
│   │   ├── pickup.routes.js
│   │   ├── support.routes.js
│   │   └── users.routes.js      #
│   ├── socket/
│   │   └── chatSocket.js        # Socket.io event configuration
│   ├── utils/
│   │   └── email.js             # Nodemailer utility
│   ├── .env                     # Environment variables
│   ├── server.js                # Entry point for Backend
│   └── package.json
│
└── WasteZero_Frontend/          # Client-side Application (React + Vite)
    ├── public/
    │   └── Logo.svg             # Application Logo
    ├── src/
    │   ├── api/                 # API Service connectors
    │   │   ├── opportunities.api.js
    │   │   └── user.api.js      #
    │   ├── assets/              # Static assets (SVGs, Images)
    │   │   ├── admin.svg, agent.svg, github.svg, google.svg
    │   │   ├── graph.svg, schedule.svg, tick.svg, user.svg
    │   │   └── waste-hero.jpg   #
    │   ├── authHandler/         # Authentication logic
    │   │   ├── AuthProvider.jsx
    │   │   ├── OAuthRedirecting.jsx
    │   │   └── ProtectedRoute.jsx #
    │   ├── components/          # Reusable UI Components
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ApplicationModal.jsx
    │   │   ├── DashboardLayout.jsx
    │   │   ├── EcoOpportunityCard.jsx
    │   │   ├── EcoOpportunityDetail.jsx
    │   │   ├── EnrollPickupModal.jsx
    │   │   ├── Filters.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   ├── NgoDashboard.jsx
    │   │   ├── NotificationBell.jsx
    │   │   ├── OpportunityForm.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── UserDashboard.jsx #
    │   ├── context/
    │   │   └── NotificationContext.jsx # Global Notification State
    │   ├── pages/               # Main Application Pages
    │   │   ├── AdminManagementPage.jsx
    │   │   ├── ChatPage.jsx
    │   │   ├── CreateOpportunity.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── EcoOpportunitiesPage.jsx
    │   │   ├── EditOpportunity.jsx
    │   │   ├── ForgetPassword.jsx
    │   │   ├── HelpSupport.jsx
    │   │   ├── LandingPage.jsx
    │   │   ├── Login.jsx
    │   │   ├── NGOApplicantPage.jsx
    │   │   ├── NotificationPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── SchedulePickupPage.jsx
    │   │   ├── Setting.jsx
    │   │   └── SignupPage.jsx   #
    │   ├── services/            # External Services
    │   │   ├── chatService.js
    │   │   └── socket.js        # Socket.io Client Service
    │   ├── App.jsx              # Main App Component
    │   ├── main.jsx             # React DOM Entry
    │   └── index.css            # Global Styles
    ├── .env                     # Frontend Env Variables
    ├── index.html
    ├── package.json
    └── vite.config.js           # Vite Configuration

```

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js (v18+)
* MongoDB (Atlas or Local)

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd WasteZero_Backend

```

Install dependencies:

```bash
npm install

```

Create a `.env` file in the `WasteZero_Backend` root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password

```

Start the server:

```bash
npm test
# Note: The "test" script is configured to run "node server.js"

```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../WasteZero_Frontend

```

Install dependencies:

```bash
npm install

```

Create a `.env` file in the `WasteZero_Frontend` root:

```env
VITE_BACKEND_API_URL=http://localhost:5000/api
VITE_SOCKET_BACKEND_API_URL=http://localhost:5000

```

Start the development server:

```bash
npm run dev

```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Login user & return JWT |
| POST | `/api/auth/send-otp` | Send verification OTP |
| POST | `/api/auth/verify-otp` | Verify OTP & Register user |
| GET | `/api/auth/oauth/google` | Initiate Google OAuth |

### Pickups & Waste

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/pickup` | Schedule a new waste pickup |
| GET | `/api/pickup/history` | Get user's pickup history |
| PATCH | `/api/pickup/:id` | Update status (Admin/NGO) |
| POST | `/api/pickup/:id/enroll` | Enroll in an existing pickup |

### Opportunities (Events)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/opportunities` | Get all open opportunities |
| POST | `/api/opportunities` | Create opportunity (NGO only) |
| POST | `/api/opportunities/:id/apply` | Apply for an opportunity |

### Admin Controls

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/suspend` | Suspend/Unsuspend user |
| PATCH | `/api/admin/ngos/:id/approve` | Approve NGO verification |

---

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  username: String, // unique
  email: String, // unique, required
  password: String,
  location: String,
  role: String, // enum: ["user", "ngo", "admin"], default: "user"
  provider: String, // enum: ["local", "google", "github"]
  providerId: String,
  skills: [String],
  totalWasteRecycled: Number, // default: 0
  isSuspended: Boolean, // default: false
  verificationStatus: String, // enum: ["pending", "approved", "rejected"]
  isDisabled: Boolean, // default: false (for NGO)
  resetPasswordToken: String,
  resetPasswordExpires: Date
}

```

### Opportunity Model

```javascript
{
  title: String, // required
  description: String,
  location: String, // required
  skills: [String],
  duration: String,
  status: String, // enum: ["Open", "In-Progress", "Closed"], default: "Open"
  startDate: String,
  endDate: String,
  createdBy: ObjectId, // ref: "users"
  createdAt: Date
}

```

### Application Model

```javascript
{
  opportunityId: ObjectId, // ref: "Opportunity"
  ngoId: ObjectId, // ref: "User"
  userId: ObjectId, // ref: "User"
  name: String,
  status: String, // enum: ["pending", "accepted", "rejected"], default: "pending"
  motivation: String,
  skills: [String]
}

```

### Pickup Model

```javascript
{
  opportunityId: ObjectId, // ref: "Opportunity"
  ngoId: ObjectId, // ref: "User"
  createdBy: ObjectId, // ref: "User" (Volunteer/User)
  assignedTo: ObjectId, // ref: "User"
  wasteTypes: [String], // required
  timeslot: String,
  quantityKg: Number, // required
  address: String, // required
  pickupDate: Date, // required
  status: String, // enum: ["Pending", "Approved", "Completed", "Cancelled"]
  enrolledUsers: [{ userId, quantity, meetingPoint, ... }]
}

```

### Chat Model

```javascript
{
  participants: [ObjectId], // ref: "User"
  participantsKey: String, // unique
  lastMessage: String,
  lastMessageTime: Date
}

```

### Notification Model

```javascript
{
  recipient: ObjectId, // ref: "User"
  type: String,
  title: String,
  message: String,
  relatedApplication: ObjectId,
  isRead: Boolean // default: false
}

```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

This project is licensed under the **MIT License**.

**Copyright (c) 2025 WasteZero Team.**
Making the world cleaner, one pickup at a time.
