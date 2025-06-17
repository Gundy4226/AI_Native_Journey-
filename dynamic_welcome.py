# 1. Ask the user for their name and store it in a variable.
#    The 'input()' function displays a message and waits for the user to type something.
#    Whatever the user types is then stored in the 'name' variable.
name = input("What is your name? ")

# This line defines a fixed goal. We're not asking the user for this in this version.
goal = "AI Native"

# 2. Print a greeting that uses this name variable.
#    The 'f' before the string allows us to embed variables directly using curly braces {}.
print(f"Hello, my name is {name} and I am studying to become {goal}")