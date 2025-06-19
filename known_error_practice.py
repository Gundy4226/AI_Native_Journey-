# This script greets the user
user_name = input("Hello! What's your name? ").strip() # Get user's name and remove extra spaces

# --- Conditional Logic for Name-Based Greeting ---
if user_name == "Ramon": # Check if the entered name is EXACTLY "Ramon" (case-sensitive)
    print("Que lo que, it's the AI genio Ramon!")
    # Introducing a variable ONLY if user_name is "Ramon"
    secret_message = "Your mission, should you choose to accept it, is to master Python!"
else: # If the name is anything other than "Ramon"
    print(f"Hello, {user_name}! Nice to meet you.")

# This message is for everyone, after the specific greeting
print("Welcome to the Python zone! Let's get coding.")

# --- COMPLEX ERROR INTRODUCED HERE ---
# We are trying to print 'secret_message' AFTER the if/else block.
# This variable was only created if user_name was "Ramon".
# If user_name is NOT "Ramon", 'secret_message' will never be created.
print(secret_message) # This line will cause an error for most users!