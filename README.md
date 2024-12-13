
# Leaderboard Management App

This project is a full-stack leaderboard management application built with **React (frontend)** and **Firebase (backend)**. The app allows users to fetch leaderboard data from an external API, store it in Firestore, display it on a React-powered frontend, and retrieve the data via a REST API.

---

## **Table of Contents**
1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
5. [How to Test](#how-to-test)
6. [Solution Explanation](#solution-explanation)
7. [Deployed Application](#deployed-application)

---

## **Overview**

The Leaderboard Management App allows users to:
- Fetch leaderboard data from an external API and save it to Firebase Firestore.
- Display the leaderboard in a paginated and searchable table on the frontend.
- Retrieve leaderboard data using RESTful Firebase Cloud Functions.

---

## **Technologies Used**

### **Frontend**
- **React** (TypeScript)
- **Material-UI** (for styling and UI components)
- **Axios** (for API calls)

### **Backend**
- **Firebase Cloud Functions** (Node.js)
- **Firestore** (Firebase NoSQL database)
- **CORS** (Cross-Origin Resource Sharing)

---

## **Project Structure**

```
project-root/
│── firebase.json            # Firebase configuration
│── functions/               # Backend Firebase Functions
│   │── src/
│   │   ├── types.ts         # Interfaces
│   │   └── index.ts         # Cloud functions entry point
│   └── package.json         # Backend dependencies
│── frontend/                # React frontend code
│   │── public/
│   │── src/
│   │   ├── App.tsx          # Main React component
│   │   ├── apiUtils.ts      # Backend API utility functions
│   │   ├── Leaderboard.module.css # Styling
│   │   └── index.tsx        # React entry point
│   ├── package.json         # Frontend dependencies
│   └── .env                 # Environment variables
└── README.md                # Project documentation
```

---

## **Setup Instructions**

### **Prerequisites**
Ensure you have the following installed on your machine:
1. **Node.js** (v16 or later)
2. **Firebase CLI**  
   Install Firebase CLI using:
   ```bash
   npm install -g firebase-tools
   ```

---

### **Backend Setup (Firebase Functions)**

1. Navigate to the `functions` directory and install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Deploy Firebase Cloud Functions:
   ```bash
   firebase deploy --only functions
   ```

---

### **Frontend Setup (React App)**

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Create a `.env` file for the backend API URL:
   ```
   REACT_APP_API_URL=https://us-central1-leaderboard-quamain.cloudfunctions.net
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Build the React app for production:
   ```bash
   npm run build
   ```

5. Deploy the app to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

---

## **How to Test**

### **1. Fetch Leaderboard Data**
- Enter a valid **Stage ID** in the input field.
- Click **"Import Leaderboard"** to fetch and save the leaderboard data.
- You should see a success notification.

### **2. View Leaderboard Data**
- Click **"View Leaderboard"** to fetch and display leaderboard data.
- The leaderboard will appear in a paginated table with search functionality.

### **3. Test Backend API Endpoints**

- **Fetch and store leaderboard data**:
  ```bash
  curl "https://us-central1-your-leaderboard-quamain.cloudfunctions.net/fetchLeaderboard?stageId=YOUR_STAGE_ID"
  ```

- **Retrieve leaderboard data**:
  ```bash
  curl "https://us-central1-your-leaderboard-quamain.cloudfunctions.net/getLeaderboard?stageId=YOUR_STAGE_ID"
  ```

---

## **Solution Explanation**

1. **Backend**:
   - The **fetchLeaderboard** Cloud Function:
     - Fetches leaderboard data and scores from the external API.
     - Saves the leaderboard metadata and scores to Firestore.

   - The **getLeaderboard** Cloud Function:
     - Queries Firestore to retrieve leaderboard scores ordered by `hitFactor`.

2. **Frontend**:
   - React components interact with the backend API using **Axios**.
   - The leaderboard table supports pagination, search, and clear filtering.
   - **Material-UI** is used to style the app for a clean, responsive UI.

3. **Deployment**:
   - The React app is deployed to Firebase Hosting.
   - Cloud Functions are deployed to Firebase for API endpoints.

---

## **Deployed Application**

### **Live URL**:
[Leaderboard Management App](https://leaderboard-quamain.web.app)

### **API Endpoints**:
1. Fetch leaderboard data:  
   `https://us-central1-your-leaderboard-quamain.cloudfunctions.net/fetchLeaderboard`

2. Retrieve leaderboard data:  
   `https://us-central1-your-leaderboard-quamain.cloudfunctions.net/getLeaderboard`

---

## **Future Improvements**
- Add authentication to secure API endpoints.
- Implement more robust error handling and user-friendly messages.
- Support sorting and filtering for multiple fields.
- Add more unit tests

---
