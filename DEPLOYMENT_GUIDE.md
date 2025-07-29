
# TechVision Project: From Setup to Deployment on Firebase (A Beginner's Guide)

This guide provides a detailed, step-by-step walkthrough for setting up, running, and deploying your TechVision web application to Firebase Hosting. This is written for beginners, so every step is explained.

## Part 1: Setting Up Your Development Environment

Before you can run the project, you need to have some essential tools installed on your computer.

### 1.1. Prerequisites

*   **Node.js**: This is the runtime environment for executing JavaScript code outside of a browser. Your project is built on Node.js.
    *   **How to install**: Go to the official [Node.js website](https://nodejs.org/) and download the **LTS** (Long-Term Support) version. The installer will guide you through the process.
    *   **Verify installation**: Open your terminal or command prompt and type `node -v`. You should see a version number (e.g., `v20.11.0`).

*   **Git**: This is a version control system used for managing code. While not strictly necessary for local development, it's essential for collaboration and deployment.
    *   **How to install**: Go to the [Git website](https://git-scm.com/downloads) and download the version for your operating system.
    *   **Verify installation**: In your terminal, type `git --version`. You should see a version number.

### 1.2. Getting the Project Code

You already have the project files. If you were starting on a new machine, you would typically "clone" the project repository using Git.

```bash
# In your terminal, navigate to where you want to store the project, then run:
git clone <your-repository-url>
cd <project-folder-name>
```

### 1.3. Installing Project Dependencies

Your project depends on several external libraries (e.g., React, Next.js, Genkit). You need to download them.

1.  Navigate to your project's root folder in the terminal.
2.  Run the following command:

    ```bash
    npm install
    ```

    This command reads the `package.json` file and downloads all the necessary packages into a `node_modules` folder. This might take a few minutes.

### 1.4. Setting Up Environment Variables

Environment variables are used to store secret keys and configuration details that shouldn't be written directly into the code.

1.  **Create the `.env` file**: In the root of your project, you'll see a file named `.env`. This is where you will put your secret keys.

2.  **Get Firebase Configuration**:
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a new project.
    *   In the project overview, click the `</>` (Web) icon to add a web app. Give it a nickname.
    *   After creating the web app, go to **Project Settings** (click the gear icon ⚙️ next to "Project Overview").
    *   Scroll down to the "Your apps" card.
    *   You will find a code snippet with a `firebaseConfig` object. Copy the values from this object.

3.  **Get Google AI (Gemini) API Key**:
    *   Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Click "**Create API key in new project**".
    *   Copy the generated API key.

4.  **Populate your `.env` file**: Open your `.env` file and fill it with the values you copied. It should look like this:

    ```env
    # Firebase Keys
    NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy...from-firebase..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    NEXT_PUBLIC_FIREBASE_APP_ID="1:12345...:web:..."

    # Genkit/Gemini Key
    GEMINI_API_KEY="AIzaSy...from-ai-studio..."
    ```

## Part 2: Running the Project Locally

Your project has two parts that need to run simultaneously: the Next.js website and the Genkit AI service. You will need to open **two separate terminal windows** for this.

*   **Terminal 1: Run the Next.js Website**

    ```bash
    npm run dev
    ```

    This will start the website. You should see a message like `✓ Ready in X.Xs │ Local: http://localhost:9002`. You can now open `http://localhost:9002` in your web browser.

*   **Terminal 2: Run the Genkit AI Flows**

    ```bash
    npm run genkit:dev
    ```

    This starts the AI service that powers features like content generation. You can visit `http://localhost:4000` to see the Genkit developer UI and test your AI flows.

## Part 3: Deploying to the Web with Firebase Hosting

We will use **Firebase App Hosting**, which is designed for modern web apps like Next.js. It automatically sets up everything you need, including a secure `https://` connection.

### 3.1. Install Firebase Tools

1.  In your terminal, run this command to install the Firebase command-line tools globally on your computer. You only need to do this once.

    ```bash
    npm install -g firebase-tools
    ```

### 3.2. Login to Firebase

1.  Run this command to log in to your Google account.

    ```bash
    firebase login
    ```

    This will open a new browser window for you to sign in.

### 3.3. Link Your Local Project to Your Firebase Project

1.  **Find your Project ID**: Go to the [Firebase Console](https://console.firebase.google.com/). Your Project ID is shown on the project card (e.g., `your-project-id`).
2.  **Update `.firebaserc`**: Open the `.firebaserc` file in your project. Replace `"your-project-id"` with your actual Firebase Project ID.

    ```json
    {
      "projects": {
        "default": "my-cool-tech-vision-app"
      }
    }
    ```

### 3.4. Deploy to Firebase!

1.  **The Final Step**: Run the following command in your terminal from the project's root directory:

    ```bash
    firebase deploy --only hosting
    ```

2.  **Wait for Deployment**: Firebase will now build your Next.js application and deploy it. This process might take a few minutes. You'll see progress logs in your terminal.

3.  **All Done!**
    *   Once the deployment is complete, Firebase will give you a public **Hosting URL** (e.g., `https://your-project-id.web.app`).
    *   Congratulations! Your website is now live on the internet, fully secured with HTTPS.

Every time you want to deploy a new version of your site, just run `firebase deploy --only hosting` again.
