
# TechVision Project: From Setup to Deployment (A Beginner's Guide)

This guide provides a detailed, step-by-step walkthrough for setting up, running, and deploying your TechVision web application. This is written for beginners, so every step is explained.

## Part 1: Setting Up Your Development Environment

Before you can run the project, you need to have some essential tools installed on your computer.

### 1.1. Prerequisites

*   **Node.js**: This is the runtime environment for executing JavaScript code outside of a browser. Your project is built on Node.js.
    *   **How to install**: Go to the official [Node.js website](https://nodejs.org/) and download the **LTS** (Long-Term Support) version. The installer will guide you through the process.
    *   **Verify installation**: Open your terminal or command prompt and type `node -v`. You should see a version number (e.g., `v20.11.0`).

*   **Git**: This is a version control system used for managing code.
    *   **How to install**: Go to the [Git website](https://git-scm.com/downloads) and download the version for your operating system.
    *   **Verify installation**: In your terminal, type `git --version`. You should see a version number.

### 1.2. Getting the Project Code

You have the project files, but if you were starting on a new machine, you would typically "clone" the project repository using Git.

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
    *   Select your project (or create a new one if you haven't already).
    *   In the project overview, click the `</>` (Web) icon to add a web app or select your existing web app.
    *   Go to **Project Settings** (click the gear icon ⚙️ next to "Project Overview").
    *   Scroll down to the "Your apps" card.
    *   You will find a code snippet with a `firebaseConfig` object. Copy the values from this object.

3.  **Get Google AI (Gemini) API Key**:
    *   Go to [Google AI Studio](httpss://aistudio.google.com/app/apikey).
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

    This will start the website. You should see a message like `✓ Ready in 1.2s │ Local: http://localhost:9002`. You can now open `http://localhost:9002` in your web browser to see your site.

*   **Terminal 2: Run the Genkit AI Flows**

    ```bash
    npm run genkit:dev
    ```

    This starts the AI service that powers features like content generation. You can visit `http://localhost:4000` to see the Genkit developer UI and test your AI flows.

You can now use the website and the admin panel locally. Changes you make to the code will automatically reload in the browser.

## Part 3: Deploying to the Web (for Free!)

We will use **Vercel** for deployment. It's made by the creators of Next.js and has a very generous free tier that is perfect for this project.

### 3.1. Sign Up for Vercel

1.  Go to [vercel.com](https://vercel.com/) and sign up for a free "Hobby" account. The easiest way is to sign up using your GitHub, GitLab, or Bitbucket account.

### 3.2. Prepare Your Project for Deployment

1.  **Push to GitHub**: If your project is not already on GitHub, you need to create a new repository and push your code to it. Vercel deploys directly from a Git repository.

### 3.3. Deploy on Vercel

1.  **New Project**: Once you are logged into your Vercel dashboard, click "**Add New...**" -> "**Project**".

2.  **Import Git Repository**: Vercel will show a list of your Git repositories. Find your TechVision project and click the "**Import**" button next to it.

3.  **Configure Project**:
    *   **Framework Preset**: Vercel will automatically detect that you are using Next.js. You don't need to change this.
    *   **Build and Output Settings**: You can leave these as default.
    *   **Environment Variables**: This is the most important step. Click to expand this section. You need to add all the same variables from your `.env` file here.
        *   Click "**Add**" for each key-value pair.
        *   **KEY**: `NEXT_PUBLIC_FIREBASE_API_KEY`, **VALUE**: `AIzaSy...`
        *   **KEY**: `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, **VALUE**: `your-project-id`
        *   ...and so on for all Firebase and Gemini keys.
        *   **Crucially, you must add all of them here.** The deployed application will not be able to read your local `.env` file.

4.  **Deploy**: Click the "**Deploy**" button.

Vercel will now start building and deploying your website. This process might take a few minutes. You'll see a console log of the progress.

### 3.4. All Done!

Once the deployment is complete, Vercel will give you a public URL (e.g., `your-project-name.vercel.app`). Congratulations! Your website is now live on the internet for everyone to see.

Vercel will automatically redeploy your website every time you push a new change to your main Git branch.
