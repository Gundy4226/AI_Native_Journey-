# Get the user's name first
user_name = input("Hello! What's your name? ").strip() # .strip() removes accidental spaces

# --- Name-based greeting logic ---
if user_name == "Ramon": # This check is case-sensitive, as per your request
    print("Que lo que, it's the AI genio Ramon!")
else:
    print(f"Hello, {user_name}! Nice to meet you.")

# Get the user's location
user_location = input("Where are you coming from? ").strip()

# --- Location-based greeting logic ---
# We'll convert the input to lowercase for a flexible check
if user_location.lower() == "nyc":
    print("Yerrrrrrr!") # This message only prints for NYC

# The final general welcome message for everyone
print("Welcome to the Python zone! Let's get coding.")