<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Python Tutorial Concept</title>
    <!-- Tailwind CSS CDN for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: "Inter", sans-serif;
            background-color: #2c3e50; /* Dark blue-grey background */
            color: #ecf0f1; /* Light text color */
        }
        .container {
            max-width: 80px;
            margin: 40px auto;
            background-color: #34495e; /* Darker background for content */
            border-radius: 12px; /* Rounded corners */
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            border: 1px solid #4a627d;
        }
        .header {
            color: #ffcc00; /* Gold color for headers */
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
        }
        .lesson-content {
            background-color: #46627f;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            line-height: 1.6;
            color: #e0e0e0;
        }
        .code-block {
            background-color: #2e3b4d;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            margin-top: 15px;
            font-family: 'Cascadia Code', 'Fira Code', monospace;
            font-size: 0.9em;
            color: #c9d1d9;
        }
        .button-style {
            background-color: #2980b9; /* Blue button */
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            border: none;
            font-weight: bold;
        }
        .button-style:hover {
            background-color: #3498db;
        }
        .quiz-option {
            background-color: #4a627f;
            padding: 10px 15px;
            margin-bottom: 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease;
            border: 1px solid transparent;
        }
        .quiz-option:hover {
            background-color: #5b7da0;
        }
        .quiz-option.selected {
            border-color: #ffcc00;
            box-shadow: 0 0 0 2px #ffcc00;
        }
        .quiz-option.correct {
            background-color: #2ecc71; /* Green for correct */
            color: white;
        }
        .quiz-option.incorrect {
            background-color: #e74c3c; /* Red for incorrect */
            color: white;
        }
        .feedback-text {
            margin-top: 15px;
            padding: 10px;
            border-radius: 6px;
            font-weight: bold;
        }
        .feedback-correct {
            background-color: #1a5e37; /* Darker green */
            color: #c9d1d9;
        }
        .feedback-incorrect {
            background-color: #8c322d; /* Darker red */
            color: #c9d1d9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-3xl header">Web Python Tutorial Concept</h1>
        <p class="text-lg text-center text-gray-400 mb-8">A conceptual example of how parts of your Python tutorial might work in a web browser.</p>

        <!-- Lesson Display Area -->
        <div id="lesson-display" class="lesson-content">
            <h2 id="module-title" class="text-2xl header mb-4"></h2>
            <h3 id="lesson-title" class="text-xl text-white mb-3"></h3>
            <div id="lesson-text" class="text-gray-200"></div>
        </div>

        <!-- Navigation/Quiz Buttons -->
        <div class="flex justify-between items-center mt-5">
            <button id="prev-lesson-btn" class="button-style bg-orange-500 hover:bg-orange-600">Previous Lesson</button>
            <button id="next-lesson-btn" class="button-style">Next Lesson</button>
            <button id="start-quiz-btn" class="button-style bg-red-500 hover:bg-red-600 hidden">Start Module Quiz</button>
        </div>

        <!-- Quiz Display Area (Initially hidden) -->
        <div id="quiz-display" class="hidden mt-8 p-6 rounded-lg shadow-lg" style="background-color: #34495e;">
            <h2 class="text-2xl header mb-4">Module Quiz: Test Your Knowledge!</h2>
            <p id="quiz-question" class="text-lg text-white mb-6"></p>
            <div id="quiz-options" class="flex flex-col">
                <!-- Radio buttons will be inserted here by JavaScript -->
            </div>
            <input type="text" id="quiz-text-answer" class="hidden w-full p-3 mt-4 rounded-md text-base bg-gray-200 text-gray-800 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500" placeholder="Type your answer here...">

            <button id="submit-answer-btn" class="button-style bg-green-600 hover:bg-green-700 mt-6 block mx-auto">Submit Answer</button>
            <div id="quiz-feedback" class="feedback-text hidden"></div>
            <p id="quiz-explanation" class="text-gray-300 text-sm mt-4 hidden"></p>
            <button id="next-quiz-item-btn" class="button-style bg-blue-700 hover:bg-blue-800 mt-6 hidden block mx-auto">Next Question</button>
        </div>
    </div>

    <script>
        // --- Data (Simplified from your Python MODULE_DATA) ---
        const MODULE_DATA = [
            {
                title: "Module 0: Setting Up Your Base Camp (Environment)",
                lessons: [
                    { title: "Lesson 0.1: Your Command Center - Cursor Code Editor", content: "A 'code editor' is your primary workstation where you'll write and manage all your code spells. We recommend Cursor, an AI-first editor, built for powerful coding. Visit https://cursor.sh/ to install." },
                    { title: "Lesson 0.2: Time-Turner of Code - Git", content: "Git is your 'version control system'. It records every change you make, allowing you to go back to previous versions. Install from https://git-scm.com/downloads." },
                    { title: "Lesson 0.3: The Cloud Citadel - GitHub", content: "GitHub is an online platform to store and collaborate on your Git projects. Sign up at https://github.com/." }
                ],
                jeopardy_quiz: {
                    "SETUP BASICS": {
                        100: { clue: "This tool is where you write and manage your code.", answer: "Cursor", explanation: "Code editors like Cursor provide the interface for coding." },
                        200: { clue: "This system tracks every change to your code, allowing you to revert versions.", answer: "Git", explanation: "Git is a distributed version control system." }
                    }
                }
            },
            {
                title: "Module 1: Unlocking Basic Communication",
                lessons: [
                    { title: "Lesson 1.1: What is Programming & Why Python?", content: "Programming is giving instructions to a computer. Python is known for being easy to read and learn." },
                    { title: "Lesson 1.2: Your First Spell - print()!", content: "The `print()` function displays information. E.g., `print('Hello!')`" },
                    { title: "Lesson 1.3: Hearing the Call - input()!", content: "The `input()` function gets text from the user. E.g., `name = input('Your name: ')`" },
                    { title: "Lesson 1.4: The Vaults of Knowledge - Variables", content: "Variables are named storage locations for data. E.g., `age = 30`" }
                ],
                jeopardy_quiz: {
                    "FUNDAMENTALS": {
                        100: { clue: "The function to show text to the user.", answer: "print()", explanation: "Used for output." },
                        200: { clue: "A named container for storing data.", answer: "variable", explanation: "Variables hold different types of information." }
                    }
                }
            }
            // ... more modules would go here in a full implementation
        ];

        // --- DOM Elements ---
        const lessonDisplay = document.getElementById('lesson-display');
        const moduleTitleLabel = document.getElementById('module-title');
        const lessonTitleLabel = document.getElementById('lesson-title');
        const lessonTextArea = document.getElementById('lesson-text');
        const prevLessonBtn = document.getElementById('prev-lesson-btn');
        const nextLessonBtn = document.getElementById('next-lesson-btn');
        const startQuizBtn = document.getElementById('start-quiz-btn');

        const quizDisplay = document.getElementById('quiz-display');
        const quizQuestionLabel = document.getElementById('quiz-question');
        const quizOptionsDiv = document.getElementById('quiz-options');
        const quizTextAnswerInput = document.getElementById('quiz-text-answer');
        const submitAnswerBtn = document.getElementById('submit-answer-btn');
        const quizFeedbackDiv = document.getElementById('quiz-feedback');
        const quizExplanationP = document.getElementById('quiz-explanation');
        const nextQuizItemBtn = document.getElementById('next-quiz-item-btn');

        // --- Game State Variables (Client-side) ---
        let currentModuleIndex = 0;
        let currentLessonIndex = 0;
        let currentQuizQuestions = []; // Questions for the current module's quiz
        let currentQuizQuestionIndex = 0;
        let selectedQuizOption = null; // For radio buttons
        let currentQuizType = 'multiple_choice'; // or 'text_input'
        
        // Tracks answered questions within the current module's quiz to grey out.
        // Format: { category: { value: { answered: true, buttonRef: null } } }
        let answeredJeopardyQuestionsInModule = {};

        // --- Functions ---

        function showScreen(screenId) {
            // Hide all screens
            lessonDisplay.classList.add('hidden');
            quizDisplay.classList.add('hidden');
            // Add other screens like jeopardy_board and jeopardy_question here if they existed
            // For this simplified example, we only toggle lesson and quiz display
            
            // Show the requested screen
            document.getElementById(screenId).classList.remove('hidden');
        }

        function updateLessonContent() {
            const module = MODULE_DATA[currentModuleIndex];
            const lesson = module.lessons[currentLessonIndex];

            moduleTitleLabel.textContent = module.title;
            lessonTitleLabel.textContent = `Lesson ${currentModuleIndex}.${currentLessonIndex + 1}: ${lesson.title}`;
            lessonTextArea.innerHTML = lesson.content.replace(/```python([\s\S]*?)```/g, '<div class="code-block"><pre>$1</pre></div>');

            // Update navigation buttons
            prevLessonBtn.disabled = (currentLessonIndex === 0);
            nextLessonBtn.disabled = false; // Always enabled unless it's the very last item in the tutorial

            if (currentLessonIndex === module.lessons.length - 1) {
                nextLessonBtn.classList.add('hidden');
                startQuizBtn.classList.remove('hidden');
            } else {
                nextLessonBtn.classList.remove('hidden');
                startQuizBtn.classList.add('hidden');
            }
            showScreen('lesson-display');
        }

        function startQuiz() {
            const module = MODULE_DATA[currentModuleIndex];
            currentQuizQuestions = [];
            // Flatten Jeopardy questions into a simple list for sequential quiz for this example
            for (const category in module.jeopardy_quiz) {
                for (const value in module.jeopardy_quiz[category]) {
                    currentQuizQuestions.push(module.jeopardy_quiz[category][value]);
                }
            }
            currentQuizQuestionIndex = 0;
            answeredJeopardyQuestionsInModule = {}; // Reset for current quiz session

            if (currentQuizQuestions.length > 0) {
                showQuizQuestion();
                showScreen('quiz-display');
            } else {
                alert("No quiz questions for this module yet!"); // In a full app, transition to next module
                nextModule();
            }
        }

        function showQuizQuestion() {
            if (currentQuizQuestionIndex < currentQuizQuestions.length) {
                const qData = currentQuizQuestions[currentQuizQuestionIndex];
                quizQuestionLabel.textContent = `Question ${currentQuizQuestionIndex + 1}/${currentQuizQuestions.length}: ${qData.clue}`;
                quizOptionsDiv.innerHTML = ''; // Clear previous options

                // For simplicity, let's assume all quiz questions are text input in this HTML example
                currentQuizType = 'text_input';
                quizTextAnswerInput.value = '';
                quizTextAnswerInput.classList.remove('hidden');
                quizOptionsDiv.classList.add('hidden'); // Hide radio button options

                quizTextAnswerInput.disabled = false;
                submitAnswerBtn.classList.remove('hidden');
                nextQuizItemBtn.classList.add('hidden');
                quizFeedbackDiv.classList.add('hidden');
                quizExplanationP.classList.add('hidden');
            } else {
                // All questions answered for this module
                alert(`Module ${currentModuleIndex} Quiz Complete!`);
                nextModule(); // Move to next module's lessons
            }
        }

        function submitAnswer() {
            let userAnswer = quizTextAnswerInput.value.trim();
            const qData = currentQuizQuestions[currentQuizQuestionIndex];
            const correctAnswer = qData.answer;
            const explanation = qData.explanation;

            quizTextAnswerInput.disabled = true;
            submitAnswerBtn.classList.add('hidden');
            nextQuizItemBtn.classList.remove('hidden');
            quizFeedbackDiv.classList.remove('hidden');
            quizExplanationP.classList.remove('hidden');

            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                quizFeedbackDiv.textContent = "🌟 Correct! Well done!";
                quizFeedbackDiv.className = 'feedback-text feedback-correct';
            } else {
                quizFeedbackDiv.textContent = `❌ Incorrect. The correct answer was: '${correctAnswer}'.`;
                quizFeedbackDiv.className = 'feedback-text feedback-incorrect';
            }
            quizExplanationP.textContent = `Explanation: ${explanation}`;
        }

        function nextQuizItem() {
            currentQuizQuestionIndex++;
            showQuizQuestion();
        }

        function nextModule() {
            currentModuleIndex++;
            currentLessonIndex = 0; // Reset lesson index for the new module
            if (currentModuleIndex < MODULE_DATA.length) {
                updateLessonContent();
                showScreen('lesson-display');
            } else {
                alert("Congratulations! You've completed the entire tutorial!");
                // In a real app, this would go to a final summary screen.
                // For this example, we'll just show the last lesson page again.
                showScreen('lesson-display');
                moduleTitleLabel.textContent = "Congratulations! Quest Completed!";
                lessonTitleLabel.textContent = "You are a Python Master!";
                lessonTextArea.innerHTML = "<p>You've learned everything we covered. Keep building!</p>";
                prevLessonBtn.classList.add('hidden');
                nextLessonBtn.classList.add('hidden');
                startQuizBtn.classList.add('hidden');
            }
        }

        // --- Event Listeners ---
        nextLessonBtn.addEventListener('click', () => {
            currentLessonIndex++;
            updateLessonContent();
        });

        prevLessonBtn.addEventListener('click', () => {
            currentLessonIndex--;
            updateLessonContent();
        });

        startQuizBtn.addEventListener('click', startQuiz);
        submitAnswerBtn.addEventListener('click', submitAnswer);
        nextQuizItemBtn.addEventListener('click', nextQuizItem);
        quizTextAnswerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !quizTextAnswerInput.disabled) {
                submitAnswer();
            }
        });

        // --- Initial Load ---
        document.addEventListener('DOMContentLoaded', () => {
            // Player name is usually set on welcome screen input, but for standalone test, hardcode if needed
            // player_name = "Web Learner";
            updateLessonContent(); // Load the first module's first lesson
        });

    </script>
</body>
</html>
