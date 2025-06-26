Personalized Affirmation Generator
About This Project
The Personalized Affirmation Generator is a web-based application designed to provide users with uplifting and encouraging affirmations tailored to their current emotional state. This tool aims to promote positive self-talk, emotional well-being, and a sense of calm or motivation.

Key Features:

User Personalization: Users can enter their name to receive personalized affirmations.

Mood-Based Affirmations: Select from a variety of moods (e.g., Happy, Stressed, Motivated, Calm, Anxious, Depressed, Mindful, Achy, Vulnerable, Hopeless) to receive affirmations specifically designed to resonate with that feeling.

AI-Generated Affirmations: Leverage the power of AI (Google's Gemini 2.0 Flash model) to generate unique, on-the-fly affirmations based on the user's selected mood, offering a dynamic and fresh experience.

Affirmation History: Keeps a record of recently generated affirmations for easy review.

Favorite Affirmations: Save your most impactful affirmations to a dedicated favorites list for quick access.

Contextual Support Modals: Depending on the selected mood, a supportive visual (like an emotional support dog for 'depressed' or 'hopeless' moods, or yoga visuals for 'mindful'/'achy' moods) may appear to offer additional comfort and guidance.

Responsive Design: The application is designed to be user-friendly across various devices and screen sizes.

How It Works (Core AI-Generated Logic)
The Affirmation Generator combines a curated list of static affirmations with dynamic, AI-powered generation to provide a rich user experience.

Mood Selection: When a user selects a mood from the dropdown, the application identifies that emotional context.

Static Affirmation Fallback: By default, or if the AI generation fails, the app selects a random affirmation from a pre-defined list that corresponds to the chosen mood.

AI Affirmation Generation: When the "Generate ✨AI Affirmation✨" button is clicked:

The application constructs a prompt for the AI model, incorporating the user's name (if provided) and their selected mood.

It then makes an asynchronous fetch API call to the Google Gemini API (specifically, gemini-2.0-flash). This call sends the crafted prompt to the AI.

The AI processes the prompt and generates a unique, contextually relevant affirmation text.

This AI-generated affirmation is then displayed to the user, offering a fresh perspective that goes beyond the pre-programmed options.

Error handling is in place to catch any issues with the AI call and gracefully fall back to a static affirmation if needed.

This hybrid approach ensures both reliability (with static affirmations) and dynamic, highly personalized content (with AI integration).

How to Run It
This project is a single HTML file containing all the necessary HTML, CSS, and JavaScript. You can run it directly in any modern web browser.

Save the File:

Save the entire code (from the <immersive> block) into a file named affirmation_generator.html (or any .html extension you prefer).

Open in Browser:

Simplest Way: Locate the affirmation_generator.html file on your computer and double-click it. It will open in your default web browser (Chrome, Firefox, Edge, Safari, etc.).

Using a Live Server (Recommended for Development):

If you are using a code editor like VS Code or Cursor, install the "Live Server" extension (by Ritwick Dey).

Right-click on your affirmation_generator.html file in the editor's file explorer.

Select "Open with Live Server" (or click the "Go Live" button in your editor's status bar, usually at the bottom right). This will launch a local development server and open the page, which can be beneficial for certain browser security policies related to local files and API calls.

Once opened, you can interact with the generator by entering your name, selecting a mood, and clicking either "Generate My Affirmation" or "Generate ✨AI Affirmation✨".