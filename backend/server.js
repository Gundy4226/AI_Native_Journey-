const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

// --- Server Setup ---
const app = express();
const PORT = 3000;

// --- Middleware ---
// Enable CORS for all routes to allow frontend access
app.use(cors()); 
// Enable built-in Express middleware to parse JSON bodies
app.use(express.json()); 

// --- Database Setup ---
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set default structure if db.json is empty
db.defaults({ meals: [] }).write();

// --- API Endpoints ---

// GET /api/meals - Retrieve all meal entries
app.get('/api/meals', (req, res) => {
  const meals = db.get('meals').value();
  res.json(meals);
});

// POST /api/meals - Add a new meal entry
app.post('/api/meals', (req, res) => {
  const newMeal = req.body;
  
  // Basic validation
  if (!newMeal || Object.keys(newMeal).length === 0) {
    return res.status(400).json({ error: 'Meal data is required.' });
  }

  // Add an id if it doesn't exist (the frontend might not create one anymore)
  if (!newMeal.id) {
    newMeal.id = Date.now();
  }

  db.get('meals').push(newMeal).write();
  res.status(201).json(newMeal);
});

// DELETE /api/meals/:id - Delete a meal entry
app.delete('/api/meals/:id', (req, res) => {
  const mealId = parseInt(req.params.id, 10);
  db.get('meals').remove({ id: mealId }).write();
  res.status(204).send(); // 204 No Content
});

// PUT /api/meals/:id - Update a meal entry
app.put('/api/meals/:id', (req, res) => {
  const mealId = parseInt(req.params.id, 10);
  const updatedMeal = req.body;

  db.get('meals')
    .find({ id: mealId })
    .assign(updatedMeal)
    .write();

  res.json(db.get('meals').find({ id: mealId }).value());
});

// GET /api/export - Export all data as JSON
app.get('/api/export', (req, res) => {
  const allMeals = db.get('meals').value();
  // Set headers to prompt a file download on the client side
  res.setHeader('Content-disposition', 'attachment; filename=meal_history.json');
  res.setHeader('Content-type', 'application/json');
  res.json(allMeals);
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 