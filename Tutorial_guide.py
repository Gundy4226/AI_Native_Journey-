import tkinter as tk
from tkinter import messagebox, scrolledtext
import datetime # For potential future use, though not directly in this Jeopardy structure
import time     # For small pauses/delays if needed

# --- Game State Variables ---
player_name = ""
overall_score = 0
answered_questions = {} # Stores (category, value) -> True if answered

# --- Jeopardy Questions Data ---
# Structure: {Category: {Value: {'clue': '', 'answer': '', 'explanation': ''}}}
JEOPARDY_QUESTIONS = {
    "PYTHON BASICS": {
        100: {'clue': "This function is used to display output to the user.", 'answer': "print()", 'explanation': "The `print()` function sends text or variable values to the console."},
        200: {'clue': "This function asks the user for input and stores it.", 'answer': "input()", 'explanation': "The `input()` function pauses the program and waits for the user to type something and press Enter."},
        300: {'clue': "What do we call a named storage location for data?", 'answer': "variable", 'explanation': "A variable acts like a box with a label, holding different kinds of data."},
        400: {'clue': "If `x = 5`, what type of operator is `=`?", 'answer': "assignment operator", 'explanation': "The `=` sign is the assignment operator; it assigns the value on the right to the variable on the left."},
        500: {'clue': "What is the process of writing step-by-step instructions for a computer?", 'answer': "programming", 'explanation': "Programming is the act of creating a set of instructions that a computer can execute."}
    },
    "TEXT & STRINGS": {
        100: {'clue': "What is text data called in Python?", 'answer': "string", 'explanation': "Strings are sequences of characters, used for all text in Python."},
        200: {'clue': "What must strings be wrapped in?", 'answer': "quotation marks", 'explanation': "Single, double, or triple quotes are used to define strings in Python."},
        300: {'clue': "What kind of string allows you to embed variables directly using `{}`?", 'answer': "f-string", 'explanation': "F-strings (formatted string literals) provide a concise way to embed expressions inside string literals."},
        400: {'clue': "Which string method removes whitespace from the beginning and end?", 'answer': ".strip()", 'explanation': "The `.strip()` method returns a copy of the string with leading and trailing whitespace removed."},
        500: {'clue': "Which string method converts all characters to lowercase?", 'answer': ".lower()", 'explanation': "The `.lower()` method is used for case-insensitive comparisons and formatting text consistently."}
    },
    "DECISION MAKING": {
        100: {'clue': "This keyword starts a conditional block that runs if its condition is True.", 'answer': "if", 'explanation': "The `if` statement evaluates a condition and executes code if it's true."},
        200: {'clue': "What keyword provides an alternative block of code if the `if` condition is False?", 'answer': "else", 'explanation': "The `else` block runs only when the preceding `if` (and `elif`s) conditions are all false."},
        300: {'clue': "What is the keyword for 'else if' in Python, allowing multiple conditions?", 'answer': "elif", 'explanation': "The `elif` keyword allows you to check for additional conditions sequentially."},
        400: {'clue': "Which logical operator means BOTH conditions must be True?", 'answer': "and", 'explanation': "The `and` operator requires both operands to be true for the entire expression to be true."},
        500: {'clue': "What is Python's way of defining code blocks, instead of curly braces?", 'answer': "indentation", 'explanation': "Python uses consistent indentation (usually 4 spaces) to define code blocks, which is crucial for `if/else` structures."}
    },
    "REPETITION & CONTROL": {
        100: {'clue': "This type of loop repeats code as long as its condition remains True.", 'answer': "while loop", 'explanation': "A `while` loop continuously executes a block of code until its condition becomes false."},
        200: {'clue': "What keyword is used to immediately exit a loop?", 'answer': "break", 'explanation': "The `break` statement forces the loop to terminate and control flow to move to the statement immediately following the loop."},
        300: {'clue': "What common pattern uses `while True` to keep asking for input until it's valid?", 'answer': "input validation loop", 'explanation': "Using `while True` with an `if` condition and `break` is a standard way to ensure valid user input."},
        400: {'clue': "If a loop's condition never becomes False, what kind of loop is it?", 'answer': "infinite loop", 'explanation': "An infinite loop occurs when the condition controlling the loop always evaluates to True, causing the loop to run indefinitely."},
        500: {'clue': "What will `while False:` do?", 'answer': "not run", 'explanation': "If the condition is `False` from the start, the `while` loop's body will never execute."}
    },
    "DEBUGGING & BEYOND": {
        100: {'clue': "What type of error means your code's grammar is wrong?", 'answer': "SyntaxError", 'explanation': "A `SyntaxError` means Python cannot parse your code due to incorrect syntax."},
        200: {'clue': "What error occurs if you use a variable name that hasn't been created?", 'answer': "NameError", 'explanation': "A `NameError` indicates that a variable or function name is not recognized in the current scope."},
        300: {'clue': "What do we call the concept of where in the code a variable 'exists'?", 'answer': "variable scope", 'explanation': "Variable scope determines the region of a program where a variable can be accessed."},
        400: {'clue': "What are collections of extra Python tools you can `import`?", 'answer': "modules", 'explanation': "Modules are Python files containing code that can be imported and used in other Python programs."},
        500: {'clue': "What is the common error type for trying to perform an operation on incompatible data types (e.g., adding a number and a string)?", 'answer': "TypeError", 'explanation': "A `TypeError` occurs when an operation is applied to an object of an inappropriate type."}
    }
}

class PythonJeopardyApp:
    def __init__(self, master):
        self.master = master
        master.title("Python Coding Jeopardy")
        master.geometry("1000x700") # Increased size for Jeopardy board
        master.configure(bg="#000033") # Dark blue for Jeopardy feel

        # --- Fonts ---
        self.title_font = ("Inter", 28, "bold", "italic")
        self.header_font = ("Inter", 18, "bold")
        self.category_font = ("Inter", 16, "bold")
        self.value_font = ("Inter", 20, "bold")
        self.text_font = ("Inter", 12)
        self.button_font = ("Inter", 12, "bold")
        self.clue_font = ("Inter", 16)
        self.answer_font = ("Inter", 14)

        # --- Global Game State ---
        self.player_name = ""
        self.overall_score = 0
        self.answered_questions = {} # Key: (category_name, value), Value: True
        self.current_question_data = None # Holds data of the question currently being answered
        self.current_question_button = None # Reference to the button clicked

        # --- Frames Dictionary to manage different screens ---
        self.frames = {}
        self._create_frames()
        self.show_frame("welcome")

    def _create_frames(self):
        # Welcome Frame
        self.frames["welcome"] = tk.Frame(self.master, bg="#00004d", bd=5, relief="raised")
        self.frames["welcome"].pack(fill="both", expand=True, padx=20, pady=20)
        self._setup_welcome_frame()

        # Setup Instructions Frame
        self.frames["setup"] = tk.Frame(self.master, bg="#000033")
        self.frames["setup"].pack(fill="both", expand=True, padx=20, pady=20)
        self._setup_setup_frame()

        # Jeopardy Board Frame
        self.frames["board"] = tk.Frame(self.master, bg="#000033")
        self.frames["board"].pack(fill="both", expand=True, padx=20, pady=20)
        # Content will be dynamically loaded/updated

        # Question Display Frame
        self.frames["question"] = tk.Frame(self.master, bg="#00004d", bd=5, relief="groove")
        self.frames["question"].pack(fill="both", expand=True, padx=20, pady=20)
        self._setup_question_frame()

        # Conclusion Frame
        self.frames["conclusion"] = tk.Frame(self.master, bg="#00004d", bd=5, relief="raised")
        self.frames["conclusion"].pack(fill="both", expand=True, padx=20, pady=20)
        self._setup_conclusion_frame()
        
        # Hide all frames initially
        for frame in self.frames.values():
            frame.pack_forget()

    def show_frame(self, frame_name):
        for frame in self.frames.values():
            frame.pack_forget()
        self.frames[frame_name].pack(fill="both", expand=True, padx=20, pady=20)
        self.master.update_idletasks() # Refresh the window


    def _setup_welcome_frame(self):
        welcome_frame = self.frames["welcome"]
        
        tk.Label(welcome_frame, text="✨ Welcome to Python Coding Jeopardy! ✨", font=self.title_font, bg="#00004d", fg="#ffcc00").pack(pady=20) # Gold color
        tk.Label(welcome_frame, text="Test your knowledge on everything we've learned.", font=self.header_font, bg="#00004d", fg="#e0e0e0", wraplength=900).pack(pady=10)
        tk.Label(welcome_frame, text="Answer clues, earn points, and become a Python Master!", font=self.text_font, bg="#00004d", fg="#e0e0e0", wraplength=900).pack(pady=5)
        
        tk.Label(welcome_frame, text="What is your name, contestant?", font=self.text_font, bg="#00004d", fg="#ffffff").pack(pady=(20,5))
        self.name_entry = tk.Entry(welcome_frame, font=self.text_font, width=30, bd=2, relief="groove", bg="#e0e0e0", fg="#000033")
        self.name_entry.pack(pady=5)
        self.name_entry.bind("<Return>", self._start_setup_on_enter)

        start_button = tk.Button(welcome_frame, text="Begin Your Challenge!", command=self._start_setup, font=self.button_font, bg="#00aa00", fg="white", activebackground="#00cc00", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        start_button.pack(pady=20)

    def _start_setup_on_enter(self, event):
        self._start_setup()

    def _start_setup(self):
        global player_name # Update global player_name
        name = self.name_entry.get().strip()
        if name:
            player_name = name
            messagebox.showinfo("Jeopardy Prep", f"Welcome, {player_name}! Let's quickly review your tools before the game begins.")
            self.show_frame("setup")
            self._update_setup_content()
        else:
            messagebox.showwarning("Input Needed", "Please enter your name to begin!")

    def _setup_setup_frame(self):
        setup_frame = self.frames["setup"]
        tk.Label(setup_frame, text="Module 0: Setting Up Your Base Camp (Environment)", font=self.header_font, bg="#000033", fg="#ffcc00").pack(pady=(10, 5))

        self.setup_text_area = scrolledtext.ScrolledText(setup_frame, wrap=tk.WORD, font=self.text_font, bg="#00004d", fg="#e0e0e0", bd=0, relief="flat", padx=10, pady=10)
        self.setup_text_area.pack(expand=True, fill="both", pady=10)
        self.setup_text_area.config(state='disabled')

        self.continue_to_board_button = tk.Button(setup_frame, text="Ready for Jeopardy!", command=self._start_jeopardy_board, font=self.button_font, bg="#00aa00", fg="white", activebackground="#00cc00", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.continue_to_board_button.pack(pady=20)

    def _update_setup_content(self):
        content = """
Welcome, adventurer! Before we dive into the Jeopardy game, let's ensure your coding environment is set up.

Lesson 0.1: Your Command Center - Cursor Code Editor
A 'code editor' is your primary workstation where you'll write and manage all your code spells. We recommend Cursor, an AI-first editor, built for powerful coding.

To install Cursor:
1. Journey to https://cursor.sh/.
2. Choose the download for your operating system (Windows, macOS, Linux).
3. Run the installer and follow the ancient scrolls (on-screen instructions).
Once installed, launch your Cursor Command Center!

Lesson 0.2: Time-Turner of Code - Git
Git is your 'version control system'. Imagine it as a magical time-turner for your code. It records every change, letting you go back in time to previous versions or see exactly what's changed. It's vital for protecting your progress and collaborating with fellow adventurers.

To install Git:
1. Seek out the downloads at https://git-scm.com/downloads.
2. Download the appropriate installer for your system.
3. Execute the installer. The default options are usually the safest path.

Lesson 0.3: The Cloud Citadel - GitHub
GitHub is a majestic online 'cloud citadel' where you can store your Git projects. It's your secure vault for code, allowing you to:
 - Back up your precious code online, safe from dragons and data loss.
 - Share your coding spells with other mages.
 - Collaborate on grand projects with guilds (teams).
 - Showcase your completed quests (a 'portfolio' of your code).

To set up GitHub:
1. Ascend to https://github.com/ and forge a free account.
2. Once logged in, you're ready to create 'repositories' (digital strongholds for your projects) and 'push' your code there using Git.

*** Please pause this game now to install Cursor and Git, and sign up for GitHub. Once done, click 'Ready for Jeopardy!' to proceed! ***
"""
        self.setup_text_area.config(state='normal')
        self.setup_text_area.delete('1.0', tk.END)
        self.setup_text_area.insert(tk.END, content)
        self.setup_text_area.config(state='disabled')


    def _start_jeopardy_board(self):
        self.show_frame("board")
        self._setup_board_frame()

    def _setup_board_frame(self):
        board_frame = self.frames["board"]
        for widget in board_frame.winfo_children(): # Clear existing board
            widget.destroy()

        # Score Display
        self.score_label = tk.Label(board_frame, text=f"{player_name}'s Score: ${overall_score}", font=self.header_font, bg="#000033", fg="#ffcc00")
        self.score_label.grid(row=0, column=0, columnspan=len(JEOPARDY_QUESTIONS), pady=10)

        # Categories
        categories = list(JEOPARDY_QUESTIONS.keys())
        for col_idx, category in enumerate(categories):
            tk.Label(board_frame, text=category, font=self.category_font, bg="#00004d", fg="white", relief="ridge", bd=3, padx=10, pady=5, width=15).grid(row=1, column=col_idx, padx=5, pady=5)

        # Value Buttons
        dollar_values = [100, 200, 300, 400, 500]
        for row_idx, value in enumerate(dollar_values):
            for col_idx, category in enumerate(categories):
                btn_text = f"${value}"
                btn_command = lambda c=category, v=value: self._show_question(c, v)
                btn = tk.Button(board_frame, text=btn_text, command=btn_command, font=self.value_font, bg="#000080", fg="white", activebackground="#4169E1", activeforeground="white", relief="raised", bd=3, padx=10, pady=10, width=10, height=2)
                btn.grid(row=row_idx + 2, column=col_idx, padx=5, pady=5, sticky="nsew")
                
                # Initialize answered_questions for this button if not already there
                if category not in self.answered_questions:
                    self.answered_questions[category] = {}
                if value not in self.answered_questions[category]:
                    self.answered_questions[category][value] = {'button': btn, 'answered': False}
                else: # Update button reference if already exists (e.g., re-drawing board)
                     self.answered_questions[category][value]['button'] = btn

                # If already answered, disable it from start
                if self.answered_questions[category].get(value, {}).get('answered', False):
                     btn.config(state=tk.DISABLED, bg="#333366", fg="#cccccc") # Greyed out

        # Configure columns and rows to expand
        for i in range(len(categories)):
            board_frame.grid_columnconfigure(i, weight=1)
        for i in range(len(dollar_values) + 2): # +2 for score and category row
            board_frame.grid_rowconfigure(i, weight=1)

        self._check_game_end() # Check if all questions are answered

    def _show_question(self, category, value):
        self.current_category = category
        self.current_value = value
        self.current_question_data = JEOPARDY_QUESTIONS[category][value]

        # Disable the clicked button immediately
        button_info = self.answered_questions[category][value]
        self.current_question_button = button_info['button'] # Store reference to the actual button widget
        self.current_question_button.config(state=tk.DISABLED, bg="#333366", fg="#cccccc")
        
        self.show_frame("question")
        self.question_clue_label.config(text=f"${value} - {category}:\n\n{self.current_question_data['clue']}")
        self.answer_entry.config(state=tk.NORMAL) # *** FIX: Re-enable the entry box ***
        self.answer_entry.delete(0, tk.END) # Clear previous input
        self.answer_feedback_label.config(text="") # Clear feedback
        self.explanation_label.config(text="") # Clear explanation
        self.submit_answer_button.pack(pady=10) # Show submit button
        self.return_to_board_button.pack_forget() # Hide return button initially


    def _setup_question_frame(self):
        question_frame = self.frames["question"]
        
        tk.Label(question_frame, text="Clue:", font=self.header_font, bg="#00004d", fg="#ffcc00").pack(pady=(10, 5))
        self.question_clue_label = tk.Label(question_frame, text="", font=self.clue_font, bg="#00004d", fg="#ffffff", wraplength=700, justify=tk.CENTER)
        self.question_clue_label.pack(pady=10)

        tk.Label(question_frame, text="Your Answer:", font=self.text_font, bg="#00004d", fg="#e0e0e0").pack(pady=(15, 5))
        self.answer_entry = tk.Entry(question_frame, font=self.answer_font, width=50, bd=2, relief="groove", bg="#e0e0e0", fg="#000033")
        self.answer_entry.pack(pady=5)
        self.answer_entry.bind("<Return>", self._submit_answer_on_enter)

        self.submit_answer_button = tk.Button(question_frame, text="Submit Answer", command=self._submit_answer, font=self.button_font, bg="#00aa00", fg="white", activebackground="#00cc00", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.submit_answer_button.pack(pady=10)

        self.answer_feedback_label = tk.Label(question_frame, text="", font=self.header_font, bg="#00004d", fg="#ffffff")
        self.answer_feedback_label.pack(pady=10)

        self.explanation_label = tk.Label(question_frame, text="", font=self.text_font, bg="#00004d", fg="#e0e0e0", wraplength=700, justify=tk.LEFT)
        self.explanation_label.pack(pady=10)

        self.return_to_board_button = tk.Button(question_frame, text="Return to Board", command=self._start_jeopardy_board, font=self.button_font, bg="#2980b9", fg="white", activebackground="#3498db", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.return_to_board_button.pack_forget() # Initially hidden


    def _submit_answer_on_enter(self, event):
        self._submit_answer()

    def _submit_answer(self):
        user_answer = self.answer_entry.get().strip()
        correct_answer = self.current_question_data['answer']
        explanation = self.current_question_data['explanation']
        value = self.current_value

        self.answer_entry.config(state=tk.DISABLED) # Disable input after submission
        self.submit_answer_button.pack_forget() # Hide submit button

        if user_answer.lower() == correct_answer.lower(): # Case-insensitive check
            self.overall_score += value
            self.answer_feedback_label.config(text=f"Correct! You earned ${value}!", fg="#2ecc71") # Green
        else:
            self.overall_score -= value
            self.answer_feedback_label.config(text=f"Incorrect. You lost ${value}.", fg="#e74c3c") # Red
        
        self.explanation_label.config(text=f"The correct answer was: '{correct_answer}'.\nExplanation: {explanation}")
        self.score_label.config(text=f"{player_name}'s Score: ${overall_score}") # Update score on board

        # Mark as answered in our state tracking
        if self.current_category not in self.answered_questions:
            self.answered_questions[self.current_category] = {}
        self.answered_questions[self.current_category][self.current_value]['answered'] = True
        
        self.return_to_board_button.pack(pady=10) # Show return button

        self._check_game_end()

    def _check_game_end(self):
        # Count answered questions to check if all are done
        total_possible_questions = sum(len(values) for values in JEOPARDY_QUESTIONS.values())
        total_answered_count = 0
        for category_data in self.answered_questions.values():
            for value_data in category_data.values():
                if value_data.get('answered', False):
                    total_answered_count += 1
        
        if total_answered_count >= total_possible_questions:
            self.show_conclusion()


    def _setup_conclusion_frame(self):
        conclusion_frame = self.frames["conclusion"]
        tk.Label(conclusion_frame, text="🎉 GAME OVER! 🎉", font=self.title_font, bg="#00004d", fg="#ffcc00").pack(pady=20)
        self.final_message_label = tk.Label(conclusion_frame, text="", font=self.header_font, bg="#00004d", fg="#e0e0e0", wraplength=700)
        self.final_message_label.pack(pady=10)
        self.final_score_display_label = tk.Label(conclusion_frame, text="", font=self.title_font, bg="#00004d", fg="#ffffff")
        self.final_score_display_label.pack(pady=20)
        self.final_rank_label = tk.Label(conclusion_frame, text="", font=self.header_font, bg="#00004d", fg="#ffcc00")
        self.final_rank_label.pack(pady=10)
        tk.Label(conclusion_frame, text="Keep coding, keep learning, and never stop building!", font=self.text_font, bg="#00004d", fg="#e0e0e0", wraplength=700).pack(pady=20)

    def show_conclusion(self):
        self.show_frame("conclusion")
        self.final_message_label.config(text=f"Great game, {player_name}!")
        self.final_score_display_label.config(text=f"Your Final Score: ${self.overall_score}")

        total_possible_points = sum(sum(q.keys()) for q in JEOPARDY_QUESTIONS.values()) # Sum of all dollar values
        
        if total_possible_points > 0:
            # Simple ranking based on score
            if self.overall_score >= total_possible_points * 0.8:
                rank = "Python Grandmaster!"
            elif self.overall_score >= total_possible_points * 0.5:
                rank = "Skilled Python Coder!"
            elif self.overall_score > 0:
                rank = "Aspiring Python Apprentice!"
            else:
                rank = "Needs more practice!"
        else:
            rank = "No questions played!"

        self.final_rank_label.config(text=f"Rank: {rank}")


# --- Main Application Start ---
if __name__ == "__main__":
    root = tk.Tk()
    app = PythonJeopardyApp(root)
    root.mainloop()
