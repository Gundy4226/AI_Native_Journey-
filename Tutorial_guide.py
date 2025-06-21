import tkinter as tk
from tkinter import messagebox, scrolledtext
import datetime # Used for time-based greetings (in module content)

# --- Global Game State Variables ---
player_name = ""
overall_score = 0
overall_total_questions_answered = 0
overall_total_questions_possible = 0

# --- Module Data: Lessons and Jeopardy Questions ---
# Each module has:
# - 'title': Display title
# - 'lessons': List of dictionaries, each {'title': '', 'content': ''}
# - 'jeopardy_quiz': Dictionary of Jeopardy categories/questions for this module
#    - Categories are keys, values are dicts of {points: {'clue': '', 'answer': '', 'explanation': ''}}

MODULE_DATA = [
    {
        'title': "Module 0: Setting Up Your Base Camp (Environment)",
        'lessons': [
            {'title': "Lesson 0.1: Your Command Center - Cursor Code Editor",
             'content': """A 'code editor' is your primary workstation where you'll write and manage all your code spells. We recommend Cursor, an AI-first editor, built for powerful coding.\n\nTo install Cursor:\n1. Journey to https://cursor.sh/.\n2. Choose the download for your operating system (Windows, macOS, Linux).\n3. Run the installer and follow the ancient scrolls (on-screen instructions).\n\nOnce installed, launch your Cursor Command Center!"""},
            {'title': "Lesson 0.2: Time-Turner of Code - Git",
             'content': """Git is your 'version control system'. Imagine it as a magical time-turner for your code. It records every change, letting you go back in time to previous versions or see exactly what's changed. It's vital for protecting your progress and collaborating with fellow adventurers.\n\nTo install Git:\n1. Seek out the downloads at https://git-scm.com/downloads.\n2. Download the appropriate installer for your system.\n3. Execute the installer. The default options are usually the safest path."""},
            {'title': "Lesson 0.3: The Cloud Citadel - GitHub",
             'content': """GitHub is a majestic online 'cloud citadel' where you can store your Git projects. It's your secure vault for code, allowing you to:\n - Back up your precious code online, safe from dragons and data loss.\n - Share your coding spells with other mages.\n - Collaborate on grand projects with guilds (teams).\n - Showcase your completed quests (a 'portfolio' of your code).\n\nTo set up GitHub:\n1. Ascend to https://github.com/ and forge a free account.\n2. Once logged in, you're ready to create 'repositories' (digital strongholds for your projects) and 'push' your code there using Git.\n\n*** Please pause this game now to install Cursor and Git, and sign up for GitHub. Once done, click 'Next Lesson' or 'Start Quiz' to proceed! ***"""}
        ],
        'jeopardy_quiz': {
            "SETUP BASICS": {
                100: {'clue': "This tool is where you write and manage your code.", 'answer': "Cursor", 'explanation': "Code editors like Cursor provide the interface for coding."},
                200: {'clue': "This system tracks every change to your code, allowing you to revert versions.", 'answer': "Git", 'explanation': "Git is a distributed version control system."},
                300: {'clue': "This online platform hosts Git projects for collaboration and backup.", 'answer': "GitHub", 'explanation': "GitHub is a popular cloud-based platform for Git repositories."},
                400: {'clue': "Is Git primarily for individual or team projects, or both?", 'answer': "both", 'explanation': "Git is highly effective for individual development and indispensable for team collaboration."},
                500: {'clue': "What is the file extension for a Python script?", 'answer': ".py", 'explanation': "Python source code files typically end with the `.py` extension."}
            }
        }
    },
    {
        'title': "Module 1: Unlocking Basic Communication",
        'lessons': [
            {'title': "Lesson 1.1: What is Programming & Why Python?", 'content': "Programming is giving step-by-step instructions to a computer. Python is chosen for its beginner-friendliness and versatility, reading almost like plain English."},
            {'title': "Lesson 1.2: Your First Spell - `print()`!", 'content': "The `print()` function displays information to the user (output).\n\nExample:\n```python\nprint('Hello, adventurer!')\n```"},
            {'title': "Lesson 1.3: Hearing the Call - `input()`!", 'content': f"The `input()` function lets your program ask the user for information. What they type is stored for use.\n\nExample:\n```python\nplayer_quest = input('What is your quest? ').strip()\nprint(f\"So, {player_name}, your quest is: '{{player_quest}}'!\")\n```"},
            {'title': "Lesson 1.4: The Vaults of Knowledge - Variables", 'content': """Variables are labeled boxes for storing data. You name the box and put a value inside using the `=` sign.\n\nExample:\n```python\nartifact_type = "Sword"\nartifact_level = 5\nprint(f"You found a {artifact_type} of Level {artifact_level}.")\nartifact_level = 6 # You can re-assign values\nprint(f"It just leveled up to {artifact_level}!")\n```"""}
        ],
        'jeopardy_quiz': {
            "FUNDAMENTALS": {
                100: {'clue': "The function to show text to the user.", 'answer': "print()", 'explanation': "Used for output."},
                200: {'clue': "The function to get text typed by the user.", 'answer': "input()", 'explanation': "Used for user input."},
                300: {'clue': "A named container for storing data.", 'answer': "variable", 'explanation': "Variables hold different types of information."},
                400: {'clue': "What does the `=` symbol do in `x = 5`?", 'answer': "assigns value", 'explanation': "It's the assignment operator, putting the value on the right into the variable on the left."},
                500: {'clue': "What is the primary reason Python is recommended for beginners?", 'answer': "readability / beginner-friendly", 'explanation': "Python's syntax is often compared to plain English, making it easy to read and understand."}
            }
        }
    },
    {
        'title': "Module 2: Crafting Messages (Working with Text)",
        'lessons': [
            {'title': "Lesson 2.1: Strings - The Language of Messages", 'content': """A 'string' is text in programming, a sequence of characters. Defined by `''`, `\"\"`, or `\"\"\"\"\"\"`.\n\nExample:\n```python\ngreeting = 'Hello world!'\nquote = "Python is awesome."\nlong_text = \"\"\"This is\na multi-line\nstring.\"\"\"\nprint(greeting)\n```"""},
            {'title': "Lesson 2.2: F-strings - Dynamic Message Weaving!", 'content': """F-strings embed variables directly into text. Use `f` before the quote and `{}` for variables.\n\nExample:\n```python\nitem = "potion"\nhealing = 50\ninfo = f"You consume the {item} and heal {healing} HP!"\nprint(info)\n```"""},
            {'title': "Lesson 2.3: String Transformations (.strip(), .lower(), .upper())", 'content': """String methods refine text:\n`.strip()` removes whitespace from ends.\n`.lower()` converts to lowercase.\n`.upper()` converts to uppercase.\n\nExample:\n```python\ndata = "   USER_INPUT   "\nprint(data.strip())\nprint(data.lower())\nprint(data.upper())\n```"""}
        ],
        'jeopardy_quiz': {
            "TEXT TWEAKS": {
                100: {'clue': "The data type for text in Python.", 'answer': "string", 'explanation': "Strings are fundamental for handling textual data."},
                200: {'clue': "What type of quotes can define a string?", 'answer': "single or double", 'explanation': "Both `''` and `\"\"` are valid for defining strings."},
                300: {'clue': "The special string type starting with `f`.", 'answer': "f-string", 'explanation': "F-strings allow for easy variable interpolation."},
                400: {'clue': "Method to remove extra spaces from ends of a string.", 'answer': ".strip()", 'explanation': "The `.strip()` method is useful for cleaning user input."},
                500: {'clue': "Method to convert a string to all lowercase.", 'answer': ".lower()", 'explanation': "`.lower()` is often used for case-insensitive comparisons."}
            }
        }
    },
    {
        'title': "Module 3: The Crossroads of Logic (Making Decisions)",
        'lessons': [
            {'title': "Lesson 3.1: `if`/`else` - The Core Choice", 'content': """Programs 'think' with `if`/`else`. `if` condition is True, do that; `else`, do something else. INDENTATION is vital (4 spaces!) for code blocks.\n\nExample:\n```python\nhealth = 30\nif health < 50:\n    print("Low health warning!")\nelse:\n    print("Health stable.")\n```"""},
            {'title': "Lesson 3.2: `elif` - Multiple Paths to Glory!", 'content': """`elif` (else if) adds more conditions, checked in order. Only one block (`if`, `elif`, or `else`) executes.\n\nExample:\n```python\nlevel = 15\nif level < 10:\n    print("Beginner area.")\nelif level < 20:\n    print("Mid-level zone.")\nelse:\n    print("Advanced territory.")\n```"""},
            {'title': "Lesson 3.3: Logical Operators (`and`, `or`, `not`) - Complex Decisions", 'content': """`and`: Both True.\n`or`: At least one True.\n`not`: Flips True/False.\n\nExample:\n```python\nkey = True\ncoin = False\nif key and coin:\n    print("Access granted!")\nelif key or coin:\n    print("Partial access, need more.")\nelse:\n    print("Access denied.")\n```"""}
        ],
        'jeopardy_quiz': {
            "CONDITIONS": {
                100: {'clue': "Keyword for 'if' its condition is False.", 'answer': "else", 'explanation': "The `else` block is the fallback when no other conditions are met."},
                200: {'clue': "Keyword for 'else if'.", 'answer': "elif", 'explanation': "Allows for multiple conditions in a single chain."},
                300: {'clue': "Operator meaning 'both conditions must be true'.", 'answer': "and", 'explanation': "Used to combine conditions where all must be true."},
                400: {'clue': "What does `not True` evaluate to?", 'answer': "False", 'explanation': "The `not` operator inverts a boolean value."},
                500: {'clue': "The fundamental Boolean values in Python.", 'answer': "True and False", 'explanation': "Boolean values are the basis of conditional checks."}
            }
        }
    },
    {
        'title': "Module 4: The Endless Loop (Repetition & Robust Input)",
        'lessons': [
            {'title': "Lesson 4.1: `while` Loops - Repeating Actions", 'content': """A `while` loop repeats code as long as its condition is True. Great for re-asking for valid input.\n\nExample:\n```python\nwhile True:\n    user_input = input("Enter 'quit' to exit: ").strip()\n    if user_input.lower() == 'quit':\n        print("Exiting loop.")\n        break # Stops the loop\n    else:\n        print("Still in loop...")\n```"""}
        ],
        'jeopardy_quiz': {
            "LOOPS": {
                100: {'clue': "The keyword for a loop that repeats while a condition is true.", 'answer': "while", 'explanation': "The `while` loop is a fundamental control flow structure for repetition."},
                200: {'clue': "What keyword stops a loop immediately?", 'answer': "break", 'explanation': "The `break` statement exits the innermost loop."},
                300: {'clue': "If a `while` loop's condition never becomes False, it creates this.", 'answer': "infinite loop", 'explanation': "An infinite loop runs forever unless a `break` or an error occurs."},
                400: {'clue': "What does `while True:` mean for a loop?", 'answer': "always runs/infinite loop", 'explanation': "It means the loop's condition is perpetually true, requiring a `break` to exit."},
                500: {'clue': "What kind of input handling benefits greatly from `while` loops?", 'answer': "robust input validation", 'explanation': "Loops allow you to repeatedly prompt the user until valid input is received."}
            }
        }
    },
    {
        'title': "Module 5: Navigating the Labyrinth of Errors",
        'lessons': [
            {'title': "Lesson 5.1: Understanding Common Errors", 'content': """Errors are guides! Common types:\n`SyntaxError`: Grammar mistake.\n`IndentationError`: Wrong spacing.\n`NameError`: Undefined variable/function.\n`TypeError`: Operation on wrong data type (e.g., 'hello' + 5).\n`ValueError`: Correct type, but inappropriate value (e.g., `int('abc')`).\n\nAlways read the 'Traceback' for clues!"""},
            {'title': "Lesson 5.2: Variable Scope - Where Your Treasures 'Live'", 'content': """Variables only exist within the code block where they are created. A variable defined inside an `if` might not be accessible outside it if that `if` block didn't run.\n\nExample:\n```python\ngame_state = "active"\nif game_state == "active":\n    player_hp = 100 # player_hp defined HERE\n# print(player_hp) # Would cause NameError if game_state wasn't 'active'\n```"""},
            {'title': "Lesson 5.3: Using Modules - Expanding Your Arsenal", 'content': f"""Modules (`import some_module`) are external files with extra tools. We used `datetime` to get the current time.\n\nExample:\n```python\nimport datetime\ncurrent_hour = datetime.datetime.now().hour\nif current_hour < 12:\n    print("Good morning!")\nelse:\n    print("Good day!")\n```"""}
        ],
        'jeopardy_quiz': {
            "ERRORS & TOOLS": {
                100: {'clue': "Error for incorrect code grammar (e.g., missing colon).", 'answer': "SyntaxError", 'explanation': "Python's parser cannot understand syntactically incorrect code."},
                200: {'clue': "Error for wrong spacing (critical in Python).", 'answer': "IndentationError", 'explanation': "Python strictly enforces consistent indentation to define code blocks."},
                300: {'clue': "Error for using an undefined variable.", 'answer': "NameError", 'explanation': "Python doesn't recognize the variable name you've used."},
                400: {'clue': "What is `import datetime` an example of?", 'answer': "importing a module", 'explanation': "Modules extend Python's functionality by providing additional functions and classes."},
                500: {'clue': "Error for trying `int('hello')`.", 'answer': "ValueError", 'explanation': "The value 'hello' cannot be converted to an integer, even though `int()` expects a string."}
            }
        }
    }
]

class PythonCodingJeopardyTutorial:
    def __init__(self, master):
        self.master = master
        master.title("Python Coding Jeopardy Tutorial")
        master.geometry("1000x700")
        master.configure(bg="#000033")

        # --- Fonts ---
        self.title_font = ("Inter", 28, "bold", "italic")
        self.header_font = ("Inter", 18, "bold")
        self.category_font = ("Inter", 16, "bold")
        self.value_font = ("Inter", 20, "bold")
        self.text_font = ("Inter", 12)
        self.button_font = ("Inter", 12, "bold")
        self.clue_font = ("Inter", 16)
        self.answer_font = ("Inter", 14)

        # --- Game State ---
        self.current_module_index = 0
        self.current_lesson_index = 0
        self.current_jeopardy_quiz_data = None # Holds questions for the current module's quiz
        self.answered_jeopardy_questions_in_module = {} # (category, value) -> True if answered for current module
        self.current_jeopardy_question_data = None
        self.current_jeopardy_question_button = None

        # --- Frames ---
        self.frames = {}
        self._create_frames()
        self.show_frame("welcome")

    def _create_frames(self):
        # All frames are created, but packed/unpacked as needed
        self.frames["welcome"] = tk.Frame(self.master, bg="#00004d", bd=5, relief="raised")
        self._setup_welcome_frame()

        self.frames["lesson"] = tk.Frame(self.master, bg="#2c3e50")
        self._setup_lesson_frame_content() # Setup initial structure, content loaded dynamically

        self.frames["jeopardy_board"] = tk.Frame(self.master, bg="#000033")
        # Board content is setup dynamically for each module

        self.frames["jeopardy_question"] = tk.Frame(self.master, bg="#00004d", bd=5, relief="groove")
        self._setup_jeopardy_question_frame()

        self.frames["conclusion"] = tk.Frame(self.master, bg="#00004d", bd=5, relief="raised")
        self._setup_conclusion_frame()
        
        # Hide all frames initially
        for frame in self.frames.values():
            frame.pack_forget()

    def show_frame(self, frame_name):
        for frame in self.frames.values():
            frame.pack_forget()
        self.frames[frame_name].pack(fill="both", expand=True, padx=20, pady=20)
        self.master.update_idletasks()

    def _setup_welcome_frame(self):
        welcome_frame = self.frames["welcome"]
        tk.Label(welcome_frame, text="✨ Welcome to Python Coding Jeopardy! ✨", font=self.title_font, bg="#00004d", fg="#ffcc00").pack(pady=20)
        tk.Label(welcome_frame, text="Embark on an interactive quest to master Python fundamentals.", font=self.header_font, bg="#00004d", fg="#e0e0e0", wraplength=900).pack(pady=10)
        tk.Label(welcome_frame, text="You'll learn step-by-step and test your knowledge in Jeopardy-style challenges!", font=self.text_font, bg="#00004d", fg="#e0e0e0", wraplength=900).pack(pady=5)
        
        tk.Label(welcome_frame, text="What is your name, brave contestant?", font=self.text_font, bg="#00004d", fg="#ffffff").pack(pady=(20,5))
        self.name_entry = tk.Entry(welcome_frame, font=self.text_font, width=30, bd=2, relief="groove", bg="#e0e0e0", fg="#000033")
        self.name_entry.pack(pady=5)
        self.name_entry.bind("<Return>", self._start_first_module_on_enter)

        start_button = tk.Button(welcome_frame, text="Begin Your Quest!", command=self._start_first_module, font=self.button_font, bg="#00aa00", fg="white", activebackground="#00cc00", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        start_button.pack(pady=20)

    def _start_first_module_on_enter(self, event):
        self._start_first_module()

    def _start_first_module(self):
        global player_name
        name = self.name_entry.get().strip()
        if name:
            player_name = name
            messagebox.showinfo("Quest Initiated", f"Excellent, {player_name}! Your learning adventure begins now.")
            self.start_module_lessons(0) # Start with Module 0
        else:
            messagebox.showwarning("Input Needed", "Please enter your name to begin your quest!")

    def _setup_lesson_frame_content(self):
        # These widgets are created once and their content updated
        lesson_frame = self.frames["lesson"]
        
        self.module_title_label = tk.Label(lesson_frame, text="", font=self.header_font, bg="#2c3e50", fg="#ffcc00", wraplength=700)
        self.module_title_label.pack(pady=(10, 5))

        self.lesson_title_label = tk.Label(lesson_frame, text="", font=self.category_font, bg="#2c3e50", fg="#ecf0f1", wraplength=700)
        self.lesson_title_label.pack(pady=5)

        self.lesson_text_area = scrolledtext.ScrolledText(lesson_frame, wrap=tk.WORD, font=self.text_font, bg="#34495e", fg="#ecf0f1", bd=0, relief="flat", padx=10, pady=10)
        self.lesson_text_area.pack(expand=True, fill="both", pady=10)
        self.lesson_text_area.configure(state='disabled')

        nav_button_frame = tk.Frame(lesson_frame, bg="#2c3e50")
        nav_button_frame.pack(pady=10)

        self.prev_lesson_button = tk.Button(nav_button_frame, text="Previous Lesson", command=self._prev_lesson, font=self.button_font, bg="#f39c12", fg="white", activebackground="#f1c40f", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.prev_lesson_button.pack(side=tk.LEFT, padx=10)

        self.next_lesson_button = tk.Button(nav_button_frame, text="Next Lesson", command=self._next_lesson, font=self.button_font, bg="#2980b9", fg="white", activebackground="#3498db", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.next_lesson_button.pack(side=tk.RIGHT, padx=10)

        self.start_module_quiz_button = tk.Button(nav_button_frame, text="Start Module Quiz", command=self._start_module_jeopardy, font=self.button_font, bg="#e74c3c", fg="white", activebackground="#c0392b", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.start_module_quiz_button.pack_forget() # Initially hidden

    def start_module_lessons(self, module_index):
        self.current_module_index = module_index
        if self.current_module_index >= len(MODULE_DATA):
            self.show_conclusion()
            return

        self.current_module_data = MODULE_DATA[self.current_module_index]
        self.current_lesson_index = 0
        self.answered_jeopardy_questions_in_module = {} # Reset for new module's quiz

        self._update_lesson_content()
        self.show_frame("lesson")

    def _update_lesson_content(self):
        module_info = self.current_module_data
        lesson_data = module_info['lessons'][self.current_lesson_index]

        self.module_title_label.config(text=module_info['title'])
        self.lesson_title_label.config(text=f"Lesson {self.current_module_index}.{self.current_lesson_index + 1}: {lesson_data['title']}")
        
        self.lesson_text_area.config(state='normal')
        self.lesson_text_area.delete('1.0', tk.END)
        self.lesson_text_area.insert(tk.END, lesson_data['content'])
        self.lesson_text_area.config(state='disabled')

        # Update navigation button states
        self.prev_lesson_button.config(state=tk.NORMAL if self.current_lesson_index > 0 else tk.DISABLED)
        
        if self.current_lesson_index == len(module_info['lessons']) - 1:
            self.next_lesson_button.pack_forget()
            self.start_module_quiz_button.pack(side=tk.RIGHT, padx=10)
        else:
            self.next_lesson_button.pack(side=tk.RIGHT, padx=10)
            self.start_module_quiz_button.pack_forget()

    def _next_lesson(self):
        if self.current_lesson_index < len(self.current_module_data['lessons']) - 1:
            self.current_lesson_index += 1
            self._update_lesson_content()
        else: # End of lessons for this module, prepare for quiz
            self._start_module_jeopardy()

    def _prev_lesson(self):
        if self.current_lesson_index > 0:
            self.current_lesson_index -= 1
            self._update_lesson_content()

    def _start_module_jeopardy(self):
        self.current_jeopardy_quiz_data = self.current_module_data['jeopardy_quiz']
        self._setup_jeopardy_board()
        self.show_frame("jeopardy_board")

    def _setup_jeopardy_board(self):
        board_frame = self.frames["jeopardy_board"]
        for widget in board_frame.winfo_children(): # Clear previous board if any
            widget.destroy()

        # Module Quiz Header
        tk.Label(board_frame, text=f"Module {self.current_module_index} Quiz: {self.current_module_data['title']}", font=self.header_font, bg="#000033", fg="#ffcc00").grid(row=0, column=0, columnspan=len(self.current_jeopardy_quiz_data), pady=10)

        # Score Display (for this specific board)
        self.current_module_score_label = tk.Label(board_frame, text=f"{player_name}'s Score: ${overall_score}", font=self.text_font, bg="#000033", fg="#e0e0e0")
        self.current_module_score_label.grid(row=1, column=0, columnspan=len(self.current_jeopardy_quiz_data), pady=5)


        # Categories
        categories = list(self.current_jeopardy_quiz_data.keys())
        for col_idx, category in enumerate(categories):
            tk.Label(board_frame, text=category, font=self.category_font, bg="#00004d", fg="white", relief="ridge", bd=3, padx=10, pady=5, width=15).grid(row=2, column=col_idx, padx=5, pady=5)

        # Value Buttons
        # Ensure we get the correct values from the current quiz data, assuming all categories have same values
        if self.current_jeopardy_quiz_data:
            first_category_values = list(self.current_jeopardy_quiz_data.values())[0]
            dollar_values = sorted(list(first_category_values.keys()))
        else:
            dollar_values = [] # Should not happen if quiz data is present
        
        for row_idx, value in enumerate(dollar_values):
            for col_idx, category in enumerate(categories):
                btn_text = f"${value}"
                btn_command = lambda c=category, v=value: self._show_jeopardy_question(c, v)
                btn = tk.Button(board_frame, text=btn_text, command=btn_command, font=self.value_font, bg="#000080", fg="white", activebackground="#4169E1", activeforeground="white", relief="raised", bd=3, padx=10, pady=10, width=10, height=2)
                btn.grid(row=row_idx + 3, column=col_idx, padx=5, pady=5, sticky="nsew") # +3 for module header, score, and category row
                
                # Store button reference and initialize answered state for the CURRENT MODULE
                if category not in self.answered_jeopardy_questions_in_module:
                    self.answered_jeopardy_questions_in_module[category] = {}

                # Preserve answered state if it already exists for this question
                # Otherwise, initialize it to False
                answered_state = False
                if value in self.answered_jeopardy_questions_in_module[category]:
                    answered_state = self.answered_jeopardy_questions_in_module[category][value].get('answered', False)

                self.answered_jeopardy_questions_in_module[category][value] = {'button': btn, 'answered': answered_state}

                # If already answered, disable it from start
                if self.answered_jeopardy_questions_in_module[category][value]['answered']:
                     btn.config(state=tk.DISABLED, bg="#333366", fg="#cccccc") # Greyed out

        # Configure columns and rows to expand
        for i in range(len(categories)):
            board_frame.grid_columnconfigure(i, weight=1)
        for i in range(len(dollar_values) + 3): # +3 for module header, score, and category row
            board_frame.grid_rowconfigure(i, weight=1)

    def _show_jeopardy_question(self, category, value):
        self.current_category = category
        self.current_value = value
        self.current_jeopardy_question_data = self.current_jeopardy_quiz_data[category][value]

        # Disable the clicked button immediately
        button_info = self.answered_jeopardy_questions_in_module[category][value]
        self.current_jeopardy_question_button = button_info['button']
        self.current_jeopardy_question_button.config(state=tk.DISABLED, bg="#333366", fg="#cccccc")
        
        self.show_frame("jeopardy_question")
        self.jeopardy_clue_label.config(text=f"${value} - {category}:\n\n{self.current_jeopardy_question_data['clue']}")
        self.jeopardy_answer_entry.config(state=tk.NORMAL) # Re-enable the entry box
        self.jeopardy_answer_entry.delete(0, tk.END)
        self.jeopardy_feedback_label.config(text="")
        self.jeopardy_explanation_label.config(text="")
        self.submit_jeopardy_answer_button.pack(pady=10)
        self.return_to_jeopardy_board_button.pack_forget()

    def _setup_jeopardy_question_frame(self):
        question_frame = self.frames["jeopardy_question"]
        
        tk.Label(question_frame, text="Clue:", font=self.header_font, bg="#00004d", fg="#ffcc00").pack(pady=(10, 5))
        self.jeopardy_clue_label = tk.Label(question_frame, text="", font=self.clue_font, bg="#00004d", fg="#ffffff", wraplength=700, justify=tk.CENTER)
        self.jeopardy_clue_label.pack(pady=10)

        tk.Label(question_frame, text="Your Answer:", font=self.text_font, bg="#00004d", fg="#e0e0e0").pack(pady=(15, 5))
        self.jeopardy_answer_entry = tk.Entry(question_frame, font=self.answer_font, width=50, bd=2, relief="groove", bg="#e0e0e0", fg="#000033")
        self.jeopardy_answer_entry.pack(pady=5)
        self.jeopardy_answer_entry.bind("<Return>", self._submit_jeopardy_answer_on_enter)

        self.submit_jeopardy_answer_button = tk.Button(question_frame, text="Submit Answer", command=self._submit_jeopardy_answer, font=self.button_font, bg="#00aa00", fg="white", activebackground="#00cc00", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.submit_jeopardy_answer_button.pack(pady=10)

        self.jeopardy_feedback_label = tk.Label(question_frame, text="", font=self.header_font, bg="#00004d", fg="#ffffff")
        self.jeopardy_feedback_label.pack(pady=10)

        self.jeopardy_explanation_label = tk.Label(question_frame, text="", font=self.text_font, bg="#00004d", fg="#e0e0e0", wraplength=700, justify=tk.LEFT)
        self.jeopardy_explanation_label.pack(pady=10)

        self.return_to_jeopardy_board_button = tk.Button(question_frame, text="Return to Board", command=self._return_to_board_or_next_module, font=self.button_font, bg="#2980b9", fg="white", activebackground="#3498db", activeforeground="white", relief="raised", bd=3, padx=10, pady=5, borderwidth=0, highlightthickness=0)
        self.return_to_jeopardy_board_button.pack_forget()

    def _submit_jeopardy_answer_on_enter(self, event):
        self._submit_jeopardy_answer()

    def _submit_jeopardy_answer(self):
        global overall_score, overall_total_questions_answered, overall_total_questions_possible

        user_answer = self.jeopardy_answer_entry.get().strip()
        correct_answer = self.current_jeopardy_question_data['answer']
        explanation = self.current_jeopardy_question_data['explanation']
        value = self.current_value

        self.jeopardy_answer_entry.config(state=tk.DISABLED)
        self.submit_jeopardy_answer_button.pack_forget()

        overall_total_questions_possible += 1 # Count every question attempted globally

        if user_answer.lower() == correct_answer.lower():
            overall_score += value
            overall_total_questions_answered += 1
            self.jeopardy_feedback_label.config(text=f"Correct! You earned ${value}!", fg="#2ecc71")
        else:
            overall_score -= value
            self.jeopardy_feedback_label.config(text=f"Incorrect. You lost ${value}.", fg="#e74c3c")
        
        self.jeopardy_explanation_label.config(text=f"The correct answer was: '{correct_answer}'.\nExplanation: {explanation}")
        self.current_module_score_label.config(text=f"{player_name}'s Score: ${overall_score}") # Update score on board

        # Mark as answered in this module's state tracking
        if self.current_category not in self.answered_jeopardy_questions_in_module:
            self.answered_jeopardy_questions_in_module[self.current_category] = {}
        self.answered_jeopardy_questions_in_module[self.current_category][self.current_value] = {'button': self.current_jeopardy_question_button, 'answered': True}
        
        self.return_to_jeopardy_board_button.pack(pady=10)

    def _return_to_board_or_next_module(self):
        # FIX: Correctly check if all questions in the current module's Jeopardy are answered
        total_questions_in_current_module_quiz = 0
        answered_questions_in_current_module_quiz = 0

        # Iterate through the actual questions defined for the current module's quiz
        for category_name, questions_by_value in self.current_jeopardy_quiz_data.items():
            total_questions_in_current_module_quiz += len(questions_by_value)
            for value_key in questions_by_value.keys():
                # Check if this specific question (by category_name and value_key) is marked as answered
                if self.answered_jeopardy_questions_in_module.get(category_name, {}).get(value_key, {}).get('answered', False):
                    answered_questions_in_current_module_quiz += 1
        
        if answered_questions_in_current_module_quiz == total_questions_in_current_module_quiz:
            messagebox.showinfo("Module Complete!", f"Congratulations, {player_name}! You've completed all questions for Module {self.current_module_index}!")
            self.start_module_lessons(self.current_module_index + 1) # Move to next module's lessons
        else:
            self._setup_jeopardy_board() # Re-draw board with updated state
            self.show_frame("jeopardy_board")

    def _setup_conclusion_frame(self):
        conclusion_frame = self.frames["conclusion"]
        tk.Label(conclusion_frame, text="🎉 QUEST COMPLETE! 🎉", font=self.title_font, bg="#00004d", fg="#ffcc00").pack(pady=20)
        self.final_message_label = tk.Label(conclusion_frame, text="", font=self.header_font, bg="#00004d", fg="#e0e0e0", wraplength=700)
        self.final_message_label.pack(pady=10)
        self.final_score_display_label = tk.Label(conclusion_frame, text="", font=self.title_font, bg="#00004d", fg="#ffffff")
        self.final_score_display_label.pack(pady=20)
        self.final_rank_label = tk.Label(conclusion_frame, text="", font=self.header_font, bg="#00004d", fg="#ffcc00")
        self.final_rank_label.pack(pady=10)
        tk.Label(conclusion_frame, text="Keep coding, keep learning, and never stop building!", font=self.text_font, bg="#00004d", fg="#e0e0e0", wraplength=700).pack(pady=20)
        tk.Label(conclusion_frame, text="Your coding adventure has just begun!\nHappy coding!", font=self.button_font, bg="#00004d", fg="#2ecc71").pack(pady=10)

    def show_conclusion(self):
        self.show_frame("conclusion")
        self.final_message_label.config(text=f"Great game, {player_name}!")
        self.final_score_display_label.config(text=f"Your Final Score: ${overall_score}")

        # Calculate final rank based on total questions answered and overall score
        total_possible_points_overall = sum(
            sum(q.keys()) for module in MODULE_DATA for q in module['jeopardy_quiz'].values()
        )
        
        if overall_total_questions_answered > 0: # Check if any questions were actually attempted
            # Simple ranking based on score vs max possible for attempted questions
            # Or, for consistency, let's use the total possible points from all questions
            if overall_score >= total_possible_points_overall * 0.8:
                rank = "Python Grandmaster!"
            elif overall_score >= total_possible_points_overall * 0.5:
                rank = "Skilled Python Coder!"
            elif overall_score > 0:
                rank = "Aspiring Python Apprentice!"
            else:
                rank = "Needs more practice!"
        else:
            rank = "No questions played in Jeopardy!"

        self.final_rank_label.config(text=f"Rank: {rank}")


# --- Main Application Start ---
if __name__ == "__main__":
    root = tk.Tk()
    app = PythonCodingJeopardyTutorial(root)
    root.mainloop()
