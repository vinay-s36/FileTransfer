# File Transfer

This is a web application that allows users to transfer files either by sending them via email or generating a shareable link. The application is built with a **React** frontend and a **Node.js** backend.

## Features

- Upload files for transfer.
- Send files via email.
- Generate a shareable link to download the file.

## Folder Structure

- **frontend**: Contains the React code for the client-side interface.
- **backend**: Contains the Node.js code for handling file uploads, email, and link generation.

---

## Installation and Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)

### 1. Clone the Repository

```bash
git clone https://github.com/vinay-s36/FileTransfer.git
cd FileTransfer
```

### 2. Install Dependencies

#### Frontend

Navigate to the `frontend` folder and install the dependencies:

```bash
cd frontend
npm install
```

#### Backend

Navigate to the `backend` folder and install the dependencies:

```bash
cd ../backend
npm install
```

### 3. Configure Environment Variables

The backend requires certain environment variables for sending emails and interacting with Pinata for file storage. You will need to create a .env file in the backend folder. A sample .env.example is provided as a reference.

Follow these steps to add the required environment variables:

1. EMAIL_USER and EMAIL_PASS: These are required to authenticate your email service.

- To generate an app password for Gmail, visit [Google App Passwords](https://myaccount.google.com/apppasswords) and follow the instructions.
Set the generated email and app password in the .env file.

2. PINATA_JWT and GATEWAY_URL: These interact with Pinata for file storage.

- Create an account on Pinata by visiting [Pinata Cloud](https://pinata.cloud/).
After signing up, obtain the JWT (JSON Web Token) and the Gateway URL from your Pinata dashboard and add them to the .env file.
Your .env file should look like this:

```plaintext
EMAIL_USER = your-email@example.com
EMAIL_PASS = your-app-password
PINATA_JWT = your-pinata-jwt
GATEWAY_URL = https://your-gateway-url
```
Note: Ensure that the .env file is added to .gitignore to keep your sensitive information secure.


### 4. Running the Application

#### Frontend

To start the frontend, run the following command inside the `frontend` folder:

```bash
npm run dev
```

#### Backend

To start the backend, run the following command inside the `backend` folder:

```bash
npm start
```
