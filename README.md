# 💼 Online JobPortal – Career & Professional Growth Platform

**Job Portal** is a full-stack career and professional-growth platform designed to help users discover job opportunities, manage applications, improve their resumes, prepare for interviews, explore career paths, and connect with a professional community.

The platform combines a modern React frontend with a Node.js and Express backend to provide a complete experience for **job seekers, employers, and administrators**.

It includes job discovery and application management, career roadmapping, interview preparation, resume scoring, professional community features, daily career updates, newsletters, content management, notifications, and administrative tools.

---

## ✨ Features

### 🔎 Job Discovery

* Browse available job opportunities
* View detailed job information
* Search and explore job listings
* Filter jobs based on relevant criteria
* View company information
* Explore job categories
* Apply for available positions

### 📋 Application Management

* Submit job applications
* Track submitted applications
* View application history
* Manage application status
* Resume/document upload support
* Application management through user dashboard

### 🏢 Company & Employer Features

* Explore companies
* View company-related information
* Employer job posting functionality
* Post new job opportunities
* Manage job listings
* Employer-specific routes and functionality

### 🧭 Career Roadmapper

The career roadmap feature helps users plan and understand their professional development.

* Explore career paths
* Build career roadmaps
* Identify career progression opportunities
* Access structured career guidance
* Plan professional development

### 🎤 Interview Coach

The platform provides an interactive interview-preparation experience.

* Interview preparation interface
* Mock interview functionality
* Interview practice
* Interview-focused guidance
* Interactive interview modal

### 📄 Resume Scorer

Users can evaluate their resumes through the resume-scoring functionality.

* Resume upload
* Resume evaluation
* Resume scoring
* Feedback-oriented results
* Support for improving resume quality

### 📰 Daily Career Digest

* Daily career information
* Digest listing
* Individual digest details
* Career-related updates
* Structured daily content

### 👥 Professional Community

Users can participate in a professional community.

* Create community posts
* View community discussions
* Comment on posts
* Manage community interactions
* Community administration tools

### 📨 Newsletter

* Newsletter subscription
* Subscriber management
* Newsletter content management
* Newsletter administration
* Email communication support

### 🔐 Authentication & User Management

* User registration
* User login
* Authentication
* Protected routes
* User profile management
* Password recovery
* OTP-based functionality
* Authentication middleware

### 👤 User Dashboard

Users can access their personalized dashboard to manage:

* Profile information
* Job applications
* Career activities
* Resume-related features
* Account information
* Notifications

### 🔔 Notifications

* User notifications
* Notification management
* Application-related updates
* Platform activity notifications

### 🛠️ Admin Dashboard

The platform includes administrative functionality for managing platform content and users.

Admin functionality includes:

* User/application management
* Community management
* FAQ management
* Newsletter management
* Subscriber management
* Download management
* Content management
* Notification management
* Job management
* Platform administration

### ☁️ File & Media Management

* Resume uploads
* Newsletter uploads
* Cloud-based media management
* Cloudinary integration
* File upload middleware

### 🔗 LinkedIn Integration

The backend includes LinkedIn-related services and routes for professional-platform integration and related functionality.

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **JavaScript (ES6+)**
* **Vite**
* **React Router**
* **Axios**
* **CSS**
* **Responsive UI**
* **Component-based architecture**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **REST APIs**
* **JWT Authentication**
* **Middleware-based architecture**

### Services & Integrations

* **Cloudinary** – File and media management
* **Nodemailer** – Email communication
* **LinkedIn Integration**
* **OTP & Authentication Services**

### Development & Tooling

* **ESLint**
* **Vite**
* **npm**
* **Git & GitHub**

---

## 🏗️ Architecture

Finance Bandhu follows a full-stack architecture:

```text
┌─────────────────────────────────────────┐
│              React Frontend              │
│                                         │
│  Jobs • Applications • Dashboard        │
│  Career Roadmap • Interview Coach       │
│  Resume Scorer • Community • Profile    │
└───────────────────┬─────────────────────┘
                    │
                    │ REST API
                    ▼
┌─────────────────────────────────────────┐
│          Node.js + Express Backend       │
│                                         │
│  Authentication • Jobs • Applications   │
│  Community • CMS • Notifications        │
│  Admin • Newsletter • Career Services   │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│                 MongoDB                 │
│                                         │
│ Users • Jobs • Applications • Posts     │
│ FAQs • Newsletters • Notifications      │
│ Contacts • Content • Subscribers        │
└─────────────────────────────────────────┘
```

---

## 📂 Project Structure

```text id="f9c7b2"
Finance-Bandhu/
│
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── aiController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── cmsController.js
│   │   ├── communityController.js
│   │   ├── faqController.js
│   │   ├── jobController.js
│   │   ├── newsletterController.js
│   │   ├── notificationController.js
│   │   └── subscriberController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Application.js
│   │   ├── Blog.js
│   │   ├── CommunityComment.js
│   │   ├── CommunityPost.js
│   │   ├── Contact.js
│   │   ├── Counter.js
│   │   ├── DailyDigest.js
│   │   ├── Download.js
│   │   ├── FAQ.js
│   │   ├── FormField.js
│   │   ├── Job.js
│   │   ├── JobCategory.js
│   │   ├── Newsletter.js
│   │   ├── Notification.js
│   │   ├── OTP.js
│   │   ├── PageContent.js
│   │   ├── Subscriber.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cmsRoutes.js
│   │   ├── communityRoutes.js
│   │   ├── employerRoutes.js
│   │   ├── faqRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── linkedinRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── newsRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── subscriberRoutes.js
│   │
│   ├── services/
│   ├── scripts/
│   ├── tasks/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── Footer.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── MockInterviewModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── SeoHead.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CareerRoadmapper.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── DailyDigest.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DigestDetails.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── InterviewCoach.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── Newsletter.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResumeScorer.jsx
│   │   │   ├── Services.jsx
│   │   │   └── TermsConditions.jsx
│   │   │
│   │   ├── store/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 📄 Main Pages

| Page                   | Description                             |
| ---------------------- | --------------------------------------- |
| **Home**               | Main landing page for the platform      |
| **Jobs**               | Browse available job opportunities      |
| **Job Details**        | View detailed information about a job   |
| **Companies**          | Explore companies and employers         |
| **Dashboard**          | Personalized user dashboard             |
| **My Applications**    | Track submitted job applications        |
| **Post Job**           | Employer job posting interface          |
| **Career Roadmapper**  | Explore and plan career paths           |
| **Interview Coach**    | Prepare for interviews and practice     |
| **Resume Scorer**      | Evaluate and improve resumes            |
| **Community**          | Participate in professional discussions |
| **Daily Digest**       | Explore daily career-related content    |
| **Digest Details**     | Read individual digest content          |
| **Newsletter**         | Subscribe to career newsletters         |
| **Profile**            | Manage user profile                     |
| **Login**              | User authentication                     |
| **Register**           | New user registration                   |
| **Forgot Password**    | Password recovery                       |
| **Admin Dashboard**    | Platform administration                 |
| **Contact**            | Contact and communication page          |
| **FAQ**                | Frequently asked questions              |
| **Services**           | Platform services                       |
| **Privacy Policy**     | Privacy information                     |
| **Terms & Conditions** | Platform terms                          |

---

## 🔐 Authentication Flow

```text id="m7b5xq"
Register
   ↓
Login
   ↓
Authentication
   ↓
Protected Routes
   ↓
User Dashboard
   ↓
Profile / Applications / Career Tools
```

Authentication and protected API access are handled through the backend authentication middleware.

---

## 💼 Job Application Flow

```text id="s8p3fk"
Browse Jobs
     ↓
Select Job
     ↓
View Job Details
     ↓
Apply
     ↓
Submit Application
     ↓
Application Stored
     ↓
Track Application
```

---

## 🧭 Career Development Flow

```text id="9n4q5k"
Career Roadmap
      ↓
Identify Career Path
      ↓
Prepare Skills
      ↓
Improve Resume
      ↓
Practice Interviews
      ↓
Find Suitable Jobs
      ↓
Apply & Track Progress
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

* **Node.js**
* **npm**
* **MongoDB**
* **Git**

You can verify Node.js and npm using:

```bash id="gk4n2s"
node --version
npm --version
```

---

## 📥 Installation

### 1. Clone the Repository

```bash id="c2w9vf"
git clone https://github.com/Thakur0012/Finance-Bandhu-Career-Professional-Growth-Platform/new/main?filename=README.md
```

Navigate into the project:

```bash id="qj6y7a"
cd Finance-Bandhu
```

---

### 2. Setup Backend

Navigate to the backend directory:

```bash id="0y6h3c"
cd backend
```

Install dependencies:

```bash id="t8p5sx"
npm install
```

Create a `.env` file and configure the required environment variables.

Example:

```env id="m4k8rc"
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

Start the backend server:

```bash id="v6n3ka"
npm start
```

---

### 3. Setup Frontend

Open another terminal and navigate to the frontend:

```bash id="4m2zqa"
cd frontend
```

Install dependencies:

```bash id="n2g8pd"
npm install
```

Start the development server:

```bash id="r8c4sy"
npm run dev
```

The frontend will normally be available at:

```text id="x6y8qp"
http://localhost:5173
```

The backend API will normally run on the configured backend port.

---

## 🔑 Environment Variables

The application uses environment variables for sensitive configuration.

Do **not** commit real credentials or secret keys to GitHub.

Important configuration may include:

* MongoDB connection string
* JWT secret
* Cloudinary credentials
* Email credentials
* API credentials
* LinkedIn integration credentials

Use `.env.example` files where appropriate and keep actual `.env` files private.

---

## 🏗️ Production Build

### Frontend

Create a production build:

```bash id="f8m4zn"
cd frontend
npm run build
```

Preview the production build:

```bash id="p5j8vx"
npm run preview
```

### Backend

Install production dependencies:

```bash id="w3s6bn"
cd backend
npm install --production
```

Start the backend:

```bash id="h7k2cq"
npm start
```

---

## 🛡️ Security

The application includes several security-related features:

* Authentication middleware
* Protected routes
* JWT-based authentication
* OTP functionality
* Environment-based secret management
* File upload validation
* Server-side API architecture

Sensitive credentials should always be stored in environment variables.

---

## 🚀 Future Improvements

Potential improvements include:

* Advanced job recommendation system
* Enhanced career analytics
* Improved resume analysis
* More interview practice scenarios
* Real-time messaging
* Advanced employer dashboard
* Application analytics
* Enhanced LinkedIn integration
* Mobile application
* Push notifications
* Advanced search and filtering
* Expanded admin analytics
* Improved cloud deployment infrastructure

---

## 📌 Project Status

**Full-Stack Web Application**

Finance Bandhu is a full-stack career platform with a React-based frontend and Node.js/Express backend.

The project includes authentication, job management, application workflows, career-development tools, community functionality, administrative management, notifications, file handling, and third-party service integrations.

---

## 👨‍💻 Author

**Purushottam Thakur**
GitHub: [@Thakur0012](https://github.com/Thakur0012)
**Yash Thorat**
GitHub: [@Yashhthorat](https://github.com/Yashhthorat)
---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ **Star** on GitHub.

---

### 💼 Job portal

**Helping professionals discover opportunities, build better careers, and grow professionally.**
