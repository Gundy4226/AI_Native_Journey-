<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Affirmation Generator (Calming Tone)</title>
    <!-- Tailwind CSS CDN for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom CSS for overall theme and specific elements not covered by Tailwind */
        body {
            font-family: "Inter", sans-serif;
            background-color: #F5F8FA; /* Fallback body color if image fails */
            display: flex;
            justify-content: center;
            /* Changed to align-items: flex-start to allow content to naturally flow from top if it gets long */
            align-items: flex-start;
            min-height: 100vh;
            margin: 0;
            color: #4A5568; /* Softer dark grey-blue text for readability on light background */
            padding: 20px; /* Add some padding for smaller screens */
            position: relative; /* Needed for absolutely positioned background */
            /* REMOVED: overflow: hidden; -- This was preventing scrolling */
        }

        /* --- Dedicated Background Div --- */
        #background-image-div {
            position: fixed; /* Fixes it to the viewport */
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1; /* Puts it behind other content */
            background-color: #A7F3D0; /* Fallback background color for the div */
            background-image: url('https://images.pexels.com/photos/1769395/pexels-photo-1769395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'); /* Your specified image */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            filter: brightness(0.7) grayscale(0.2); /* Slightly dim and desaturate for text readability */
            transition: background-image 0.5s ease-in-out; /* Smooth transition if image loads later */
            /* REMOVED: overflow: hidden; -- Not needed here either as it's fixed */
        }

        .main-container {
            display: flex;
            flex-direction: column;
            gap: 2rem; /* Space between card and history */
            width: 95%;
            max-width: 900px; /* Max width for wider layouts */
            z-index: 1; /* Ensure content is above background */
            /* Added min-height to ensure it pushes the body to scroll if needed */
            min-height: calc(100vh - 40px); /* 100vh minus body padding */
        }
        .card-container {
            background-color: rgba(255, 255, 255, 0.85); /* Slightly translucent white */
            border-radius: 1rem; /* Large rounded corners */
            padding: 2.5rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Stronger shadow for contrast */
            text-align: center;
            flex-shrink: 0; /* Don't shrink when history grows */
            border: 1px solid rgba(226, 232, 240, 0.7); /* Subtle light border */
        }
        .input-field {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1.5rem; /* More space below */
            border: 1px solid #CBD5E1; /* Lighter border */
            border-radius: 0.5rem;
            font-size: 1rem;
            color: #2D3748; /* Darker text for input */
            background-color: #F8FAFC; /* Very light input background */
            box-sizing: border-box;
            -webkit-appearance: none; /* Remove default browser styling for select */
            -moz-appearance: none;
            appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292%22%20height%3D%22292%22%3E%3Cpath%20fill%3D%22%23718096%22%20d%3D%22M287%2C193.999L146%2C52.999L5%2C193.999c-3%2C3-5%2C5-5%2C5s2%2C2%2C5%2C5l129%2C130c3%2C3%2C5%2C5%2C5%2C5s2%2C-2%2C5%2C-5l129%2C-130c3%2C-3%2C5%2C-5%2C5%2C-5S290%2C196.999%2C287%2C193.999z%22%2F%3E%3C%2Fsvg%3E'); /* Custom dropdown arrow - darker for contrast */
            background-repeat: no-repeat;
            background-position: right 0.7em top 50%, 0 0;
            background-size: 0.65em auto, 100%;
            padding-right: 2.5rem; /* Space for custom arrow */
        }
        .input-field::placeholder {
            color: #A0AEC0; /* Muted placeholder text */
        }
        .button-group {
            display: flex;
            gap: 1rem; /* Space between buttons */
            justify-content: center;
            flex-wrap: wrap; /* Allow buttons to wrap on small screens */
            margin-top: 1rem; /* Space below affirmation */
            width: 100%; /* Explicitly take full width of parent */
        }
        .button-style {
            background-color: #38B2AC; /* Calming Teal primary color */
            color: white;
            padding: 0.75rem 1.5rem; /* Slightly less horizontal padding for group */
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.1rem;
            transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
            border: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            flex-grow: 1; /* Allow buttons to grow */
            min-width: 120px; /* Minimum width for buttons */
        }
        /* New rule for buttons within button-group for better layout */
        .button-group .button-style {
            flex: 1 1 auto; /* Allow growth, shrinking, and auto basis */
            max-width: calc(50% - 0.5rem); /* Limit growth to roughly half width minus half the gap */
        }
        .button-style:hover {
            background-color: #4FD1C5; /* Lighter teal on hover */
            transform: translateY(-1px); /* Slight lift effect */
        }
        /* Specific button colors for action buttons (calming palette) */
        .button-style.green {
            background-color: #10B981; /* Emerald Green */
        }
        .button-style.green:hover {
            background-color: #059669;
        }
        .button-style.red {
            background-color: #EF4444; /* Muted Red */
        }
        .button-style.red:hover {
            background-color: #DC2626;
        }
        .button-style.orange {
            background-color: #F59E0B; /* Amber Orange */
        }
        .button-style.orange:hover {
            background-color: #D97706;
        }
        .affirmation-output {
            margin-top: 2rem;
            padding: 1.5rem;
            background-color: #D1FAE5; /* Default very light green for general */
            border-radius: 0.75rem;
            min-height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #065F46; /* Dark green text for general */
            font-size: 1.3rem;
            font-weight: 700;
            font-style: italic;
            text-shadow: none; /* Removed harsh text shadow */
            border: 2px solid #A7F3D0; /* Lighter border for general */
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease; /* Smooth color transition */
        }
        .emoji {
            font-size: 1.5em; /* Larger emoji */
            margin-right: 10px; /* Space between emoji and text */
        }

        /* Recommendation Output Style */
        .recommendation-output {
            margin-top: 1.5rem; /* Space below action buttons */
            padding: 1rem;
            background-color: #F0F9FF; /* Very light blue for recommendations */
            border-radius: 0.75rem;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2A4365; /* Dark blue-grey text */
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
            border: 1px solid #BEE3F8; /* Light blue border */
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* History and Favorites Section */
        .history-container {
            background-color: rgba(255, 255, 255, 0.85); /* Slightly translucent white */
            border-radius: 1rem;
            padding: 2.5rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Stronger shadow */
            border: 1px solid rgba(226, 232, 240, 0.7);
        }
        .history-list, .favorites-list {
            list-style: none;
            padding: 0;
            max-height: 200px; /* Limit height for scrolling */
            overflow-y: auto; /* Enable scrolling */
            border: 1px solid #CBD5E1; /* Lighter border */
            border-radius: 0.5rem;
            padding: 10px;
            background-color: #F8FAFC; /* Very light background for lists */
        }
        .history-list li, .favorites-list li {
            padding: 8px 10px;
            border-bottom: 1px solid #E2E8F0; /* Lighter divider */
            font-size: 0.95rem;
            text-align: left;
            word-wrap: break-word; /* Ensure long affirmations wrap */
            color: #4A5568; /* Darker text for list items */
        }
        .history-list li:last-child, .favorites-list li:last-child {
            border-bottom: none;
        }
        .history-list li .date, .favorites-list li .date {
            font-size: 0.8em;
            color: #718096; /* Muted date color */
            display: block;
            margin-top: 4px;
        }
        .favorites-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .favorites-list li .remove-fav-btn {
            background: none;
            border: none;
            color: #EF4444; /* Muted Red for delete */
            cursor: pointer;
            font-size: 1.2em;
            padding: 0 5px;
            transition: color 0.2s ease;
        }
        .favorites-list li .remove-fav-btn:hover {
            color: #DC2626;
        }
        .history-image {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            display: block; /* Ensure it takes full width and no extra space below */
            margin-left: auto;
            margin-right: auto;
        }


        /* Mobile responsiveness adjustments */
        @media (min-width: 768px) {
            .main-container {
                flex-direction: row; /* Side-by-side on larger screens */
                justify-content: center;
            }
            .card-container {
                flex: 1; /* Take equal width */
            }
            .history-container {
                flex: 1; /* Take equal width */
            }
        }
        @media (max-width: 640px) {
            .main-container {
                padding: 0; /* Remove horizontal padding on very small screens, let child elements manage */
            }
            .card-container, .history-container {
                padding: 1.5rem;
                margin: 10px; /* Add some small margin */
                width: calc(100% - 20px); /* Adjust width for margin */
            }
            .text-3xl {
                font-size: 2rem;
            }
            .affirmation-output {
                font-size: 1rem;
                padding: 1rem;
            }
            .button-style {
                font-size: 0.9rem;
                padding: 0.75rem 1rem;
            }
            .button-group {
                flex-direction: column; /* Stack buttons vertically */
            }
            .button-group .button-style {
                max-width: 100%; /* Take full width when stacked */
            }
        }

        /* --- Modal Styles --- */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent black background */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000; /* Ensure it's on top of everything */
            opacity: 0; /* Start hidden for fade-in */
            visibility: hidden; /* Also hidden for accessibility */
            transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }
        .modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .modal-content {
            background-color: rgba(255, 255, 255, 0.9); /* Slightly translucent white */
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 450px; /* Limit modal width */
            width: 90%;
            position: relative;
            transform: translateY(20px); /* Start slightly below for slide-up effect */
            transition: transform 0.3s ease-in-out;
            max-height: 90vh; /* Limit height for scrollability on small screens */
            overflow-y: auto; /* Enable scrolling for long content */
        }
        .modal-overlay.show .modal-content {
            transform: translateY(0);
        }
        .modal-content h2 {
            font-size: 1.8rem;
            font-weight: bold;
            color: #0D9488; /* Teal color for modal title */
            margin-bottom: 1.5rem;
        }
        .modal-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem; /* Rounded corners for image */
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for image */
        }
        .modal-content p {
            font-size: 1.1rem;
            color: #4A5568;
            margin-bottom: 1rem; /* Reduced margin for closer paragraphs */
            line-height: 1.5;
            text-align: left; /* Align text left for readability of instructions */
        }
        .modal-content p strong {
            color: #0D9488; /* Highlight pose names */
        }
        .modal-close-btn {
            background-color: #EF4444; /* Muted Red */
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.1rem;
            border: none;
            transition: background-color 0.2s ease-in-out;
            margin-top: 1.5rem; /* Space above the button */
        }
        .modal-close-btn:hover {
            background-color: #DC2626;
        }

        /* Styles for the custom message box */
        .custom-message-box {
            position: fixed; /* Stays in place relative to the viewport */
            bottom: 20px; /* Distance from the bottom of the screen */
            left: 20px; /* Distance from the left of the screen */
            transform: translateX(0); /* No horizontal centering needed */
            background-color: rgba(0, 0, 0, 0.75); /* Semi-transparent dark background */
            color: white; /* White text color */
            padding: 12px 25px; /* Padding inside the box */
            border-radius: 8px; /* Rounded corners */
            font-size: 1rem; /* Font size */
            text-align: center;
            z-index: 1000; /* Ensure it's on top of other content */
            opacity: 0; /* Start invisible for fade-in effect */
            transition: opacity 0.3s ease-in-out; /* Smooth fade transition */
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Subtle shadow */
            white-space: nowrap; /* Prevent text from wrapping if it's short */
        }

        /* Style for when the message box is visible */
        .custom-message-box.show {
            opacity: 1; /* Fully opaque */
        }
    </style>
</head>
<body>
    <div id="background-image-div"></div> <!-- Dedicated div for background image -->

    <div class="main-container">
        <!-- Main Affirmation Generator Card -->
        <div class="card-container">
            <h1 class="text-3xl font-extrabold text-teal-500 mb-6">Your Daily Spark! ✨</h1>
            <p class="text-lg text-gray-700 mb-8">Get a personalized affirmation to brighten your day!</p>

            <div class="mb-4 text-left">
                <label for="userNameInput" class="block text-gray-600 text-sm font-bold mb-2">What's your name?</label>
                <input type="text" id="userNameInput" class="input-field" placeholder="Enter your name (optional)">
            </div>

            <div class="mb-6 text-left">
                <label for="moodSelect" class="block text-gray-600 text-sm font-bold mb-2">How are you feeling today?</label>
                <select id="moodSelect" class="input-field">
                    <option value="general">Just a good vibe!</option>
                    <option value="happy">Happy 😊</option>
                    <option value="stressed">Stressed 😟</option>
                    <option value="motivated">Motivated 💪</option>
                    <option value="calm">Calm 🧘‍♀️</option>
                    <option value="anxious">Anxious 😬</option>
                    <option value="depressed">Depressed 😔</option>
                    <option value="mindful">Mindful 🧠</option>
                    <option value="achy">Achy 😩</option>
                </select>
            </div>

            <div class="button-group mb-4">
                <button id="generateAffirmationBtn" class="button-style">Generate My Affirmation</button>
                <button id="generateAIAffirmationBtn" class="button-style orange">Generate ✨AI Affirmation✨</button>
            </div>

            <div id="affirmationOutput" class="affirmation-output">
                Click a button to get your daily affirmation!
            </div>

            <!-- New Interactive Buttons -->
            <div id="actionButtons" class="button-group mt-6 hidden">
                <button id="copyBtn" class="button-style green">Copy</button>
                <button id="favoriteBtn" class="button-style orange">Favorite</button>
                <button id="resetBtn" class="button-style red">Reset</button>
            </div>

            <!-- New Recommendation Output Area -->
            <div id="recommendationOutput" class="recommendation-output hidden">
                <!-- Recommendation will appear here -->
            </div>
        </div>

        <!-- Affirmation History and Favorites Section -->
        <div class="history-container">
            <h2 class="text-2xl font-extrabold text-teal-600 mb-4">History & Favorites</h2>
            
            <h3 class="text-xl font-bold text-gray-700 mb-2 mt-4">Last Generated:</h3>
            <ul id="historyList" class="history-list mb-6">
                <li class="text-gray-400">No affirmations generated yet.</li>
            </ul>

            <h3 class="text-xl font-bold text-gray-700 mb-2 mt-4">Your Favorites:</h3>
            <ul id="favoritesList" class="favorites-list">
                <li class="text-gray-400">No favorites yet.</li>
            </ul>
            <!-- Image under History & Favorites -->
            <img src="https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                 alt="Serene landscape symbolizing healing and tranquility"
                 class="history-image"
                 onerror="this.onerror=null;this.src='https://placehold.co/400x300/a7f3d0/2c7a7b?text=Healing+Image+Not+Found';">
        </div>
    </div>

    <!-- Emotional Support Dog Modal (for Depressed) -->
    <div id="supportDogModal" class="modal-overlay">
        <div class="modal-content">
            <h2>A Friend to Comfort You!</h2>
            <!-- Image for Emotional Support Dog -->
            <img src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                 alt="A cute golden retriever dog looking calmly at the camera"
                 onerror="this.onerror=null;this.src='https://placehold.co/400x300/cccccc/333333?text=Image+Not+Found';">
            <p>Remember, it's okay to feel this way. Take a moment, breathe, and know you're not alone. This furry friend is here to send some calm your way!</p>
            <button id="closeDogModalBtn" class="modal-close-btn">Got it, thanks!</button>
        </div>
    </div>

    <!-- Yoga Visuals Modal (for Mindful and Achy) -->
    <div id="yogaVisualModal" class="modal-overlay">
        <div class="modal-content">
            <h2>Find Your Center</h2>
            <!-- Image for Yoga Visual -->
            <img src="https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                 alt="Person meditating in front of a cosmic healing universe visual"
                 onerror="this.onerror=null;this.src='https://placehold.co/400x300/e0f2f1/00838f?text=Mindful+Visual+Not+Found';">
            <p>Embrace the stillness within. Focus on your breath and find peace in the present moment. Here are some gentle poses to try to ease your body and mind:</p>
            <p>
                <strong>1. Child's Pose (Balasana):</strong> Kneel on your mat, big toes touching. Open your knees wide or keep them together. Fold forward, resting your torso between your thighs (or on them). Extend arms forward or rest them by your sides, palms up. Rest your forehead on the mat. Gentle stretches for hips, thighs, and ankles. A perfect resting pose to calm the brain and help relieve stress and fatigue.
            </p>
            <p>
                <strong>2. Downward-Facing Dog Split (Eka Pada Adho Mukha Svanasana):</strong> From Downward-Facing Dog, lift one leg straight back and up towards the sky, keeping your hips square or gently opening them for a deeper stretch. This pose can help lengthen the spine, stretch the hamstrings, and open the hips. Remember to breathe deeply and move gently with your body.
            </p>
            <p>
                <strong>3. Mountain Pose (Tadasana):</strong> Stand tall with feet together, arms at your sides. Feel grounded, drawing energy up from the earth through your spine. Breathe deeply, standing strong and still.
            </p>
            <p>
                <strong>4. Corpse Pose (Savasana):</strong> Lie flat on your back, legs extended and slightly apart, arms by your sides with palms facing up. Close your eyes. Relax every part of your body. Focus on your breath without controlling it. This pose helps integrate the benefits of practice and deep relaxation.
            </p>
            <button id="closeYogaModalBtn" class="modal-close-btn">Namaste</button>
        </div>
    </div>

    <!-- Sun Salutation Modal (for Anxious/Stressed) -->
    <div id="sunSalutationModal" class="modal-overlay">
        <div class="modal-content">
            <h2>Sun Salutations for Stress Relief</h2>
            <!-- Image for Sun Salutations -->
            <img src="https://images.pexels.com/photos/3822904/pexels-photo-3822904.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                 alt="Yoga sequence with sun salutations"
                 onerror="this.onerror=null;this.src='https://placehold.co/400x300/a7f3d0/2c7a7b?text=Sun+Salutations+Image+Not+Found';">
            <p>A gentle flow to release tension and find calm through movement and breath. Follow these steps for a basic Sun Salutation (Surya Namaskar A):</p>
            <p>
                <strong>1. Mountain Pose (Tadasana):</strong> Stand at the top of your mat, feet together, hands at prayer position at your heart. Ground through your feet, lengthen your spine.
            </p>
            <p>
                <strong>2. Upward Salute (Urdhva Hastasana):</strong> Inhale, sweep your arms overhead, palms together, gaze up. Lengthen your side body.
            </p>
            <p>
                <strong>3. Standing Forward Bend (Uttanasana):</strong> Exhale, fold forward from your hips, bringing your hands to the mat or shins. Relax your head and neck.
            </p>
            <p>
                <strong>4. Halfway Lift (Ardha Uttanasana):</strong> Inhale, lift halfway, lengthen your spine, gaze forward. Hands can be on shins or fingertips on the mat.
            </p>
            <p>
                <strong>5. High Plank (Phalakasana):</strong> Exhale, step your feet back to a high plank position. Shoulders over wrists, body in one straight line.
            </p>
            <p>
                <strong>6. Low Plank (Chaturanga Dandasana):</strong> Exhale, lower halfway down, elbows hugging ribs. Keep your body straight. (Knees down is an option).
            </p>
            <p>
                <strong>7. Upward-Facing Dog (Urdhva Mukha Svanasana):</strong> Inhale, roll over your toes, straighten arms, lift chest, shoulders down. Thighs off the mat.
            </p>
            <p>
                <strong>8. Downward-Facing Dog (Adho Mukha Svanasana):</strong> Exhale, lift hips up and back, forming an inverted V-shape. Press through palms, lengthen spine, slight bend in knees.
            </p>
            <p>
                <strong>9. Standing Forward Bend (Uttanasana):</strong> Inhale, step or hop feet between hands, fold forward.
            </p>
            <p>
                <strong>10. Halfway Lift (Ardha Uttanasana):</strong> Inhale, lift halfway, lengthen spine.
            </p>
            <p>
                <strong>11. Upward Salute (Urdhva Hastasana):</strong> Exhale, sweep arms up and overhead.
            </p>
            <p>
                <strong>12. Mountain Pose (Tadasana):</strong> Exhale, bring hands to prayer at heart center.
            </p>
            <button id="closeSunSalutationModalBtn" class="modal-close-btn">Feel the Calm</button>
        </div>
    </div>

    <script>
        const affirmationsByMood = {
            general: {
                affirmations: [
                    "You are capable of amazing things today.",
                    "Your potential is limitless.",
                    "Every challenge is an opportunity to grow.",
                    "You are resilient and strong.",
                    "Believe in your unique journey.",
                    "Today is a fresh start, embrace it.",
                    "Your dreams are within reach.",
                    "You bring light to the world."
                ],
                emoji: '✨',
                recommendation: "Take a moment to appreciate something small today."
            },
            happy: {
                affirmations: [
                    "Keep shining your light, you are a joy!",
                    "Your happiness is contagious.",
                    "Embrace this wonderful feeling!",
                    "Today is beautiful because you are in it.",
                    "Let your joy inspire others.",
                    "You deserve all the good things coming your way."
                ],
                emoji: '😊',
                recommendation: "Share your joy with someone close to you!"
            },
            stressed: {
                affirmations: [
                    "Take a deep breath; you've got this.",
                    "You are strong enough to overcome anything.",
                    "Prioritize your peace and well-being.",
                    "Release what you cannot control.",
                    "One moment at a time is all you need.",
                    "Your inner strength is greater than any challenge."
                ],
                emoji: '😥',
                recommendation: "Try a 5-minute breathing exercise: inhale for 4, hold for 4, exhale for 6."
            },
            motivated: {
                affirmations: [
                    "Go out there and conquer your goals!",
                    "Your determination will lead to success.",
                    "Every step forward, no matter how small, is progress.",
                    "Unleash your inner power!",
                    "You have the discipline to achieve anything you set your mind to.",
                    "Today is an opportunity to build the future you desire."
                ],
                emoji: '🚀',
                recommendation: "Break down your biggest goal into 3 small, actionable steps."
            },
            calm: {
                affirmations: [
                    "Find your peace in the present moment.",
                    "Let tranquility guide your day.",
                    "All is well, and you are safe.",
                    "Breathe, and simply be.",
                    "Your mind is clear, and your spirit is serene.",
                    "Embrace the quiet moments of your day.",
                    "Observe your thoughts without judgment, like clouds passing by."
                ],
                emoji: '🧘',
                recommendation: "Spend 10 minutes in quiet reflection or gentle stretching."
            },
            anxious: {
                affirmations: [
                    "I am safe and secure. My breath brings calm.",
                    "This feeling will pass, just as the waves recede.",
                    "I am strong enough to handle this. I can ride this wave.",
                    "One gentle breath at a time, I find my center.",
                    "I choose peace over worry. My focus is on the present.",
                    "My breath is my anchor in this moment, grounding me.",
                    "I am in control of my reactions, not my fears.",
                    "I am supported and loved, and I release tension with each exhale."
                ],
                emoji: '😬',
                recommendation: "Connect with a loved one or try a grounding exercise: list 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste."
            },
            depressed: {
                affirmations: [
                    "This moment will pass, and better days are ahead. Light returns, like the dawn.",
                    "You are worthy of love and happiness, just as you are.",
                    "Even small steps are progress; honor your journey.",
                    "It's okay not to be okay. Allow yourself grace.",
                    "Reach out if you need support; you are not alone on this path.",
                    "You are valued just as you are, a unique part of the universe.",
                    "Light will find its way back into your life, through every open space.",
                    "Healing is a process, and you are on your way, guided by inner wisdom."
                ],
                emoji: '😔',
                recommendation: "Reach out to a friend or family member, even for a brief chat."
            },
            mindful: {
                affirmations: [
                    "I am present in this moment, calm and centered.",
                    "My breath is my guide, flowing freely and peacefully.",
                    "I release all tension with each exhale.",
                    "I am connected to my inner wisdom and strength.",
                    "May I be happy, may I be well, may I be peaceful.",
                    "I am grateful for my body and all it does for me.",
                    "I flow with the rhythm of life, embracing change.",
                    "My mind is still, my spirit is free."
                ],
                emoji: '🧠',
                recommendation: "Practice mindful eating: focus on the taste, texture, and smell of your next meal."
            },
            achy: {
                affirmations: [
                    "Listen to your body; it's asking for gentle care.",
                    "Release tension with each gentle stretch and breath.",
                    "Your body is strong and capable of healing.",
                    "Ease and comfort are returning to you now.",
                    "Be kind to yourself and allow for rest.",
                    "Each moment of stillness brings you closer to comfort."
                ],
                emoji: '😩',
                recommendation: "Try some gentle stretches or a warm bath to soothe your muscles."
            }
        };

        const moodColors = {
            general: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
            happy: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
            stressed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
            motivated: { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
            calm: { bg: '#CCFBF1', text: '#0D9488', border: '#99F6E4' },
            anxious: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
            depressed: { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE' },
            mindful: { bg: '#E6FFFA', text: '#2C7A7B', border: '#B2F5EA' },
            achy: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' }
        };

        const userNameInput = document.getElementById('userNameInput');
        const moodSelect = document.getElementById('moodSelect');
        // Removed: nounInput, verbInput, adjectiveInput references

        const generateAffirmationBtn = document.getElementById('generateAffirmationBtn');
        const generateAIAffirmationBtn = document.getElementById('generateAIAffirmationBtn');
        const affirmationOutput = document.getElementById('affirmationOutput');
        const actionButtons = document.getElementById('actionButtons');
        const copyBtn = document.getElementById('copyBtn');
        const favoriteBtn = document.getElementById('favoriteBtn');
        const resetBtn = document.getElementById('resetBtn');
        const recommendationOutput = document.getElementById('recommendationOutput');

        const historyList = document.getElementById('historyList');
        const favoritesList = document.getElementById('favoritesList');

        const supportDogModal = document.getElementById('supportDogModal');
        const closeDogModalBtn = document.getElementById('closeDogModalBtn');
        const yogaVisualModal = document.getElementById('yogaVisualModal');
        const closeYogaModalBtn = document.getElementById('closeYogaModalBtn');
        const sunSalutationModal = document.getElementById('sunSalutationModal');
        const closeSunSalutationModalBtn = document.getElementById('closeSunSalutationModalBtn');

        let currentAffirmation = "";

        const MAX_HISTORY_ITEMS = 5;

        function getStoredFavorites() {
            try {
                const favorites = JSON.parse(localStorage.getItem('affirmationFavorites')) || [];
                return favorites;
            } catch (e) {
                console.error("Error parsing favorites from localStorage", e);
                return [];
            }
        }

        function saveFavorites(favorites) {
            localStorage.setItem('affirmationFavorites', JSON.stringify(favorites));
        }

        function getStoredHistory() {
             try {
                const history = JSON.parse(localStorage.getItem('affirmationHistory')) || [];
                return history;
            } catch (e) {
                console.error("Error parsing history from localStorage", e);
                return [];
            }
        }

        function saveHistory(history) {
            localStorage.setItem('affirmationHistory', JSON.stringify(history));
        }

        function renderFavorites() {
            const favorites = getStoredFavorites();
            favoritesList.innerHTML = '';

            if (favorites.length === 0) {
                favoritesList.innerHTML = '<li class="text-gray-400">No favorites yet.</li>';
                return;
            }

            favorites.forEach((fav, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${fav.text} <span class="date">${fav.date}</span></span>
                    <button class="remove-fav-btn" data-index="${index}">✖</button>
                `;
                favoritesList.appendChild(li);
            });

            favoritesList.querySelectorAll('.remove-fav-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const indexToRemove = parseInt(event.target.dataset.index);
                    removeFavorite(indexToRemove);
                });
            });
        }

        function removeFavorite(index) {
            const favorites = getStoredFavorites();
            favorites.splice(index, 1);
            saveFavorites(favorites);
            renderFavorites();
        }

        function renderHistory() {
            const history = getStoredHistory();
            historyList.innerHTML = '';

            if (history.length === 0) {
                historyList.innerHTML = '<li class="text-gray-400">No affirmations generated yet.</li>';
                return;
            }

            history.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${item.text} <span class="date">${item.date}</span>
                `;
                historyList.appendChild(li);
            });
        }

        function addAffirmationToHistory(affirmationText) {
            const history = getStoredHistory();
            const now = new Date();
            const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            history.unshift({ text: affirmationText, date: dateString });

            if (history.length > MAX_HISTORY_ITEMS) {
                history.pop();
            }
            saveHistory(history);
            renderHistory();
        }

        function updateAffirmationDisplay(affirmationText, selectedMood) {
            const moodData = affirmationsByMood[selectedMood];
            const moodEmoji = moodData.emoji || '';
            affirmationOutput.innerHTML = `<span class="emoji">${moodEmoji}</span>${affirmationText}`;
            
            const recommendationText = moodData.recommendation || "";
            // Removed: madLibsSentence logic

            if (recommendationText) {
                recommendationOutput.textContent = `💡 Recommendation: ${recommendationText}`;
                recommendationOutput.classList.remove('hidden');
            } else {
                recommendationOutput.classList.add('hidden');
            }

            currentAffirmation = affirmationText;

            const colors = moodColors[selectedMood] || moodColors.general;
            affirmationOutput.style.backgroundColor = colors.bg;
            affirmationOutput.style.borderColor = colors.border;
            affirmationOutput.style.color = colors.text;

            actionButtons.classList.remove('hidden');
            addAffirmationToHistory(affirmationText);

            // Conditional modal display logic
            if (supportDogModal) hideSupportDogModal();
            if (yogaVisualModal) hideYogaVisualModal();
            if (sunSalutationModal) hideSunSalutationModal();


            if (selectedMood === 'depressed' && supportDogModal) {
                showSupportDogModal();
            } else if ((selectedMood === 'anxious' || selectedMood === 'stressed') && sunSalutationModal) {
                showSunSalutationModal();
            } else if ((selectedMood === 'mindful' || selectedMood === 'achy') && yogaVisualModal) {
                showYogaVisualModal();
            }
        }

        function generateAffirmation() {
            const userName = userNameInput.value.trim();
            const selectedMood = moodSelect.value;
            const moodData = affirmationsByMood[selectedMood];
            const relevantAffirmations = moodData.affirmations || affirmationsByMood.general.affirmations;
            const randomIndex = Math.floor(Math.random() * relevantAffirmations.length);
            let chosenAffirmation = relevantAffirmations[randomIndex];

            if (userName !== "") {
                chosenAffirmation = `${userName}, ${chosenAffirmation}`;
            }
            updateAffirmationDisplay(chosenAffirmation, selectedMood);
        }

        async function generateAffirmationWithAI() {
            const userName = userNameInput.value.trim();
            const selectedMood = moodSelect.value;
            // Removed: noun, verb, adjective references

            const originalButtonText = generateAIAffirmationBtn.textContent;

            generateAIAffirmationBtn.textContent = 'Generating...';
            generateAIAffirmationBtn.disabled = true;
            generateAffirmationBtn.disabled = true;
            affirmationOutput.textContent = 'Generating your personalized AI affirmation...';
            actionButtons.classList.add('hidden');
            recommendationOutput.classList.add('hidden');


            try {
                let prompt = `Generate a personalized affirmation for a person`;
                if (userName) {
                    prompt += ` named ${userName}`;
                }
                prompt += ` who is feeling ${selectedMood}.`;
                // Removed: noun, verb, adjective incorporation into AI prompt
                prompt += ` The affirmation should be short, encouraging, and specific to their mood. Do not include any introductory or concluding phrases like 'Here is your affirmation' or 'I hope this helps'.`;


                const chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                const payload = { contents: chatHistory };
                const apiKey = ""; 
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API Error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const aiAffirmation = result.candidates[0].content.parts[0].text;
                    updateAffirmationDisplay(aiAffirmation, selectedMood);
                } else {
                    throw new Error("AI did not return a valid affirmation.");
                }
            } catch (error) {
                console.error("Error generating AI affirmation:", error);
                messagebox.alert(`Failed to generate AI affirmation: ${error.message}. Please try again with the regular generator.`);
                affirmationOutput.textContent = "Oops! Couldn't generate an AI affirmation. Trying a static one...";
                generateAffirmation(); // Fallback to static if AI fails
            } finally {
                generateAIAffirmationBtn.textContent = originalButtonText;
                generateAIAffirmationBtn.disabled = false;
                generateAffirmationBtn.disabled = false;
            }
        }


        function copyAffirmation() {
            if (currentAffirmation) {
                document.execCommand('copy');
                navigator.clipboard.writeText(currentAffirmation)
                    .then(() => {
                        messagebox.alert('Affirmation copied to clipboard!');
                    })
                    .catch(err => {
                        console.error('Failed to copy text: ', err);
                        messagebox.alert('Failed to copy affirmation.');
                    });
            }
        }

        function favoriteAffirmation() {
            if (currentAffirmation) {
                const favorites = getStoredFavorites();
                const now = new Date();
                const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const newFavorite = { text: currentAffirmation, date: dateString };

                if (!favorites.some(fav => fav.text === newFavorite.text)) {
                    favorites.unshift(newFavorite);
                    saveFavorites(favorites);
                    renderFavorites();
                    messagebox.alert('Affirmation added to favorites!');
                } else {
                    messagebox.alert('This affirmation is already in your favorites!');
                }
            }
        }

        function resetGenerator() {
            userNameInput.value = "";
            moodSelect.value = "general";
            // Removed: Clearing noun, verb, adjective inputs
            
            affirmationOutput.textContent = "Click a button to get your daily affirmation!";
            affirmationOutput.style.backgroundColor = moodColors.general.bg;
            affirmationOutput.style.borderColor = moodColors.general.border;
            affirmationOutput.style.color = moodColors.general.text;

            actionButtons.classList.add('hidden');
            recommendationOutput.classList.add('hidden');
            currentAffirmation = "";
            if (supportDogModal) hideSupportDogModal();
            if (yogaVisualModal) hideYogaVisualModal();
            if (sunSalutationModal) hideSunSalutationModal();
        }
        
        const messagebox = {
            alert: function(message) {
                const existingAlert = document.querySelector('.custom-message-box');
                if (existingAlert) {
                    existingAlert.remove();
                }

                const alertDiv = document.createElement('div');
                alertDiv.className = 'custom-message-box';
                alertDiv.textContent = message;

                document.body.appendChild(alertDiv);

                alertDiv.offsetHeight; 

                alertDiv.classList.add('show');

                setTimeout(() => {
                    alertDiv.classList.remove('show');
                    alertDiv.addEventListener('transitionend', () => {
                        if (alertDiv.parentNode) {
                            alertDiv.remove();
                        }
                    }, { once: true });
                }, 3000);
            }
        };

        // Added checks for modal elements before attempting to call methods on them
        function showSupportDogModal() {
            if (supportDogModal) supportDogModal.classList.add('show');
        }

        function hideSupportDogModal() {
            if (supportDogModal) supportDogModal.classList.remove('show');
        }

        function showYogaVisualModal() {
            if (yogaVisualModal) yogaVisualModal.classList.add('show');
        }

        function hideYogaVisualModal() {
            if (yogaVisualModal) yogaVisualModal.classList.remove('show');
        }

        function showSunSalutationModal() {
            if (sunSalutationModal) sunSalutationModal.classList.add('show');
        }

        function hideSunSalutationModal() {
            if (sunSalutationModal) sunSalutationModal.classList.remove('show');
        }

        generateAffirmationBtn.addEventListener('click', generateAffirmation);
        generateAIAffirmationBtn.addEventListener('click', generateAffirmationWithAI);
        copyBtn.addEventListener('click', copyAffirmation);
        favoriteBtn.addEventListener('click', favoriteAffirmation);
        resetBtn.addEventListener('click', resetGenerator);

        // Added checks for modal elements before adding event listeners
        if (closeDogModalBtn) closeDogModalBtn.addEventListener('click', hideSupportDogModal);
        if (supportDogModal) supportDogModal.addEventListener('click', (event) => {
            if (event.target === supportDogModal) {
                hideSupportDogModal();
            }
        });

        if (closeYogaModalBtn) closeYogaModalBtn.addEventListener('click', hideYogaVisualModal);
        if (yogaVisualModal) yogaVisualModal.addEventListener('click', (event) => {
            if (event.target === yogaVisualModal) {
                hideYogaVisualModal();
            }
        });

        if (closeSunSalutationModalBtn) closeSunSalutationModalBtn.addEventListener('click', hideSunSalutationModal);
        if (sunSalutationModal) sunSalutationModal.addEventListener('click', (event) => {
            if (event.target === sunSalutationModal) {
                hideSunSalutationModal();
            }
        });

        userNameInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                generateAffirmation();
            }
        });
        // Removed: Event listeners for noun, verb, adjective input fields


        document.addEventListener('DOMContentLoaded', () => {
            renderFavorites();
            renderHistory();
            affirmationOutput.style.backgroundColor = moodColors.general.bg;
            affirmationOutput.style.borderColor = moodColors.general.border;
            affirmationOutput.style.color = moodColors.general.text;
            // Ensure the background image path is correct, use the full path provided earlier
            document.getElementById('background-image-div').style.backgroundImage = "url('https://images.pexels.com/photos/1769395/pexels-photo-1769395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
        });

    </script>
</body>
</html>
