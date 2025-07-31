document.addEventListener('DOMContentLoaded', () => {
    // Main buttons
    document.getElementById('analyze-btn').addEventListener('click', analyzeMeals);
    document.getElementById('add-snack-btn').addEventListener('click', addSnackInput);

    // History management
    document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
    document.getElementById('export-btn').addEventListener('click', exportHistory);
    document.getElementById('import-file').addEventListener('change', importHistory);
    
    // Initial load
    loadHistory();
    addSnackInput(); // Add one snack field by default
});

function addSnackInput() {
    const container = document.getElementById('snacks-container');
    const newSnack = document.createElement('div');
    newSnack.className = 'snack-entry';
    newSnack.innerHTML = `
        <input type="text" class="snack-food" placeholder="e.g., Apple">
        <input type="time" class="snack-time">
    `;
    container.appendChild(newSnack);
}

function addSnackInputWithData(food, time) {
    const container = document.getElementById('snacks-container');
    const newSnack = document.createElement('div');
    newSnack.className = 'snack-entry';
    newSnack.innerHTML = `
        <input type="text" class="snack-food" value="${food || ''}">
        <input type="time" class="snack-time" value="${time || ''}">
    `;
    container.appendChild(newSnack);
}

function analyzeMeals() {
    console.log('[DEBUG] analyzeMeals called.');
    const snacks = [];
    document.querySelectorAll('.snack-entry').forEach(entry => {
        const food = entry.querySelector('.snack-food').value.trim();
        const time = entry.querySelector('.snack-time').value;
        if (food) {
            snacks.push({ food, time });
        }
    });

    // Check if we are in "edit mode" by looking for the hidden input's value
    const idHolder = document.getElementById('meal-id-holder');
    const existingId = idHolder && idHolder.value ? parseInt(idHolder.value, 10) : null;

    console.log(`[DEBUG] Existing ID from holder: ${existingId}`);

    const mealData = {
        // Use the existing ID if it's there, otherwise create a new one
        id: existingId || Date.now(),
        date: new Date().toLocaleDateString(),
        waterIntake: document.getElementById('water-intake').value,
        breakfast: {
            food: document.getElementById('breakfast').value.trim(),
            time: document.getElementById('breakfast-time').value,
            mood: document.getElementById('breakfast-mood').value
        },
        lunch: {
            food: document.getElementById('lunch').value.trim(),
            time: document.getElementById('lunch-time').value,
            mood: document.getElementById('lunch-mood').value
        },
        dinner: {
            food: document.getElementById('dinner').value.trim(),
            time: document.getElementById('dinner-time').value,
            mood: document.getElementById('dinner-mood').value
        },
        snacks: snacks
    };

    // If editing, preserve the original date instead of creating a new one.
    if (existingId) {
        const originalMeal = mealHistoryCache.find(m => m.id === existingId);
        if (originalMeal) {
            mealData.date = originalMeal.date;
        }
    }

    if (!mealData.breakfast.food && !mealData.lunch.food && !mealData.dinner.food && mealData.snacks.length === 0) {
        alert('Please log at least one meal or snack.');
        return;
    }

    console.log('[DEBUG] Saving meal data:', mealData);
    saveMealHistory(mealData); // This will now handle the next steps

    // Clear the ID holder after we've passed the data to be saved.
    if (idHolder) {
        idHolder.value = '';
    }
}

function clearInputs() {
    document.getElementById('water-intake').value = '';
    document.getElementById('breakfast').value = '';
    document.getElementById('breakfast-time').value = '';
    document.getElementById('breakfast-mood').value = 'none';
    document.getElementById('lunch').value = '';
    document.getElementById('lunch-time').value = '';
    document.getElementById('lunch-mood').value = 'none';
    document.getElementById('dinner').value = '';
    document.getElementById('dinner-time').value = '';
    document.getElementById('dinner-mood').value = 'none';
    
    const snacksContainer = document.getElementById('snacks-container');
    snacksContainer.innerHTML = '';
    addSnackInput();
}

// --- Analysis Engine ---
const FOOD_KEYWORDS = {
    protein: ['chicken', 'beef', 'fish', 'salmon', 'tuna', 'eggs', 'tofu', 'lentils', 'beans'],
    carbs: ['bread', 'pasta', 'rice', 'potatoes', 'oatmeal', 'cereal', 'bagel'],
    fats: ['avocado', 'nuts', 'seeds', 'olive oil', 'cheese'],
    vegetables: ['salad', 'broccoli', 'spinach', 'carrots', 'peppers', 'onions'],
    fruits: ['apple', 'banana', 'berries', 'orange', 'grapes']
};

function analyzeDay(mealData) {
    const allFoods = [
        mealData.breakfast.food,
        mealData.lunch.food,
        mealData.dinner.food,
        ...mealData.snacks.map(s => s.food)
    ].join(' ').toLowerCase();

    let macroCounts = { protein: 0, carbs: 0, fats: 0, vegetables: 0, fruits: 0 };
    for (const macro in FOOD_KEYWORDS) {
        for (const keyword of FOOD_KEYWORDS[macro]) {
            if (allFoods.includes(keyword)) {
                macroCounts[macro]++;
            }
        }
    }
    return macroCounts;
}

function generateSuggestionsForDay(mealData) {
    const suggestions = [];
    const macros = analyzeDay(mealData);

    if (macros.protein < 2) suggestions.push("Consider adding more protein sources to your main meals.");
    if (macros.vegetables < 2) suggestions.push("Try to include more vegetables in your diet for essential vitamins.");
    if (mealData.waterIntake < 6) suggestions.push(`You logged ${mealData.waterIntake || 0} glasses of water. Aim for at least 6-8 glasses a day.`);
    
    if (mealData.dinner.time) {
        const dinnerHour = parseInt(mealData.dinner.time.split(':')[0], 10);
        if (dinnerHour >= 21) {
            suggestions.push('Eating dinner late may affect sleep quality. Consider an earlier mealtime.');
        }
    }

    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        if (mealData[mealType].mood === 'sluggish') {
            suggestions.push(`You felt sluggish after ${mealType}. Reflect on the meal to see if certain foods might be the cause.`);
        }
    });

    return suggestions;
}

async function runAllAnalysis() {
    const history = await getMealHistory(); // Ensure we have the latest data
    if (history.length === 0) {
        document.getElementById('analysis-output').classList.add('hidden');
        document.getElementById('charts-container').classList.add('hidden');
        document.getElementById('weekly-summary-container').classList.add('hidden');
        return;
    };

    const todayLog = history[0];
    const dailySuggestions = generateSuggestionsForDay(todayLog);
    const dailyMacros = analyzeDay(todayLog);

    displayDailyAnalysis(dailySuggestions);
    renderMacroChart(dailyMacros);

    if (history.length >= 3) {
        const weeklySummary = generateWeeklySummary(history);
        displayWeeklySummary(weeklySummary);
    }
}

function generateWeeklySummary(history) { // This function is okay as it receives history
    const summary = { lateDinners: 0, skippedBreakfasts: 0, energizedMeals: 0, sluggishMeals: 0 };

    history.slice(0, 7).forEach(day => {
        if (day.dinner.time && parseInt(day.dinner.time.split(':')[0], 10) >= 21) summary.lateDinners++;
        if (!day.breakfast.food) summary.skippedBreakfasts++;
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            if (day[mealType].mood === 'energized') summary.energizedMeals++;
            if (day[mealType].mood === 'sluggish') summary.sluggishMeals++;
        });
    });

    return `
        <p>Over the last ${history.length} days:</p>
        <ul>
            <li>You had a late dinner on <strong>${summary.lateDinners}</strong> day(s).</li>
            <li>You skipped breakfast on <strong>${summary.skippedBreakfasts}</strong> day(s).</li>
            <li>You felt energized after <strong>${summary.energizedMeals}</strong> meal(s) and sluggish after <strong>${summary.sluggishMeals}</strong>.</li>
        </ul>
    `;
}

// --- Display Functions ---
function displayDailyAnalysis(suggestions) {
    const suggestionsEl = document.getElementById('suggestions');
    suggestionsEl.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsEl.innerHTML = '<li>Your diet seems balanced today. Keep up the great work!</li>';
    } else {
        suggestions.forEach(s => {
            const li = document.createElement('li');
            li.textContent = s;
            suggestionsEl.appendChild(li);
        });
    }
    document.getElementById('analysis-output').classList.remove('hidden');
}

function displayWeeklySummary(summaryHTML) {
    const summaryEl = document.getElementById('weekly-summary');
    summaryEl.innerHTML = summaryHTML;
    document.getElementById('weekly-summary-container').classList.remove('hidden');
}

let macroChartInstance = null;
function renderMacroChart(macroData) {
    const ctx = document.getElementById('macro-chart').getContext('2d');
    if (macroChartInstance) {
        macroChartInstance.destroy();
    }
    macroChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Protein', 'Carbs', 'Fats', 'Vegetables', 'Fruits'],
            datasets: [{
                label: 'Food Groups',
                data: [
                    macroData.protein,
                    macroData.carbs,
                    macroData.fats,
                    macroData.vegetables,
                    macroData.fruits
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Today\'s Food Group Distribution' }
            }
        }
    });
    document.getElementById('charts-container').classList.remove('hidden');
}

function renderHistory(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    history.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'card';

        const header = document.createElement('div');
        header.className = 'card-header';
        header.textContent = `${meal.date} - Water: ${meal.waterIntake || 0} glasses`;

        const mealInfo = document.createElement('div');
        mealInfo.className = 'meal-info';
        mealInfo.innerHTML = `
            <p><strong>Breakfast:</strong> ${meal.breakfast.food || 'N/A'} at ${meal.breakfast.time || 'N/A'} (Mood: ${meal.breakfast.mood})</p>
            <p><strong>Lunch:</strong> ${meal.lunch.food || 'N/A'} at ${meal.lunch.time || 'N/A'} (Mood: ${meal.lunch.mood})</p>
            <p><strong>Dinner:</strong> ${meal.dinner.food || 'N/A'} at ${meal.dinner.time || 'N/A'} (Mood: ${meal.dinner.mood})</p>
            <p><strong>Snacks:</strong> ${meal.snacks.map(s => s.food).join(', ') || 'None'}</p>
            <p><strong>Water:</strong> ${meal.waterIntake || 0} glasses</p>
        `;

        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.innerHTML = `
            <button onclick="editMeal(${meal.id})">Edit</button>
            <button onclick="deleteMeal(${meal.id})">Delete</button>
        `;

        card.appendChild(header);
        card.appendChild(mealInfo);
        card.appendChild(actions);
        historyList.appendChild(card);
    });
}

// --- Data Persistence Layer (Replaced with API calls) ---

const API_URL = 'http://localhost:3000/api/meals';

// Global variable to hold the history data
let mealHistoryCache = [];

async function getMealHistory() {
    try {
        const response = await fetch(API_URL);
        mealHistoryCache = await response.json();
        // The server returns meals in the order they were added, so we reverse it
        // to show the most recent meal first, matching the old functionality.
        return mealHistoryCache.slice().reverse();
    } catch (error) {
        console.error('Failed to fetch meal history:', error);
        return []; // Return empty array on error
    }
}

async function saveMealHistory(newMealData) {
    const isEditing = mealHistoryCache.some(meal => meal.id === newMealData.id);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${newMealData.id}` : API_URL;

    try {
        console.log(`[DEBUG] Sending ${method} request to ${url}`);
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMealData)
        });
        // After saving, reload the history to reflect the changes
        clearInputs();
        await loadHistory(); // Ensure history is loaded before we potentially analyze

        // --- NEW: Automatically scroll to the analysis section ---
        const analysisSection = document.getElementById('analysis-output');
        if (analysisSection) {
            analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
        // --- END NEW ---
        
    } catch (error) {
        console.error('Failed to save meal data:', error);
    }
}

async function deleteMeal(id, suppressConfirm = false) {
    if (!suppressConfirm && !confirm('Are you sure you want to delete this entry?')) {
        return;
    }
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadHistory(); // Refresh the list
    } catch (error) {
        console.error('Failed to delete meal:', error);
    }
}

// editMeal now just populates the form. The actual update happens in saveMealHistory.
function editMeal(id) {
    console.log(`[DEBUG] editMeal called for ID: ${id}`);
    const mealToEdit = mealHistoryCache.find(m => m.id === id);
    if (!mealToEdit) return;

    // Populate main fields
    document.getElementById('water-intake').value = mealToEdit.waterIntake;
    document.getElementById('breakfast').value = mealToEdit.breakfast.food;
    document.getElementById('breakfast-time').value = mealToEdit.breakfast.time;
    document.getElementById('breakfast-mood').value = mealToEdit.breakfast.mood;
    document.getElementById('lunch').value = mealToEdit.lunch.food;
    document.getElementById('lunch-time').value = mealToEdit.lunch.time;
    document.getElementById('lunch-mood').value = mealToEdit.lunch.mood;
    document.getElementById('dinner').value = mealToEdit.dinner.food;
    document.getElementById('dinner-time').value = mealToEdit.dinner.time;
    document.getElementById('dinner-mood').value = mealToEdit.dinner.mood;

    // Populate snacks
    const snacksContainer = document.getElementById('snacks-container');
    snacksContainer.innerHTML = ''; // Clear existing snack fields
    if (mealToEdit.snacks && mealToEdit.snacks.length > 0) {
        mealToEdit.snacks.forEach(snack => addSnackInputWithData(snack.food, snack.time));
    } else {
        addSnackInput(); // Add one empty snack field if there are no snacks
    }

    // This hidden input will hold the ID for the save function to know it's an edit.
    let idHolder = document.getElementById('meal-id-holder');
    if (!idHolder) {
        idHolder = document.createElement('input');
        idHolder.type = 'hidden';
        idHolder.id = 'meal-id-holder';
        document.body.appendChild(idHolder);
    }
    idHolder.value = id;

    window.scrollTo(0, 0);
    console.log(`[DEBUG] Populated form for editing. Hidden ID holder value is now: ${idHolder.value}`);
}

async function loadHistory() {
    console.log('[DEBUG] loadHistory called.');
    const history = await getMealHistory(); // history is already reversed here
    console.log('[DEBUG] History loaded from server:', history);
    renderHistory(history);
    // Pass the already fetched history to the analysis functions
    runAnalysisOnLoadedData(history); 
}

function clearHistory() {
    if (!confirm('Are you sure you want to delete ALL entries? This cannot be undone.')) {
        return;
    }
    // To delete all, we can send multiple delete requests.
    const historyToDelete = [...mealHistoryCache]; // Create a copy
    Promise.all(historyToDelete.map(meal => deleteMeal(meal.id, true)))
        .then(() => {
            loadHistory(); // Refresh after all deletions are done
        })
        .catch(error => console.error('Failed to clear history:', error));
}

// This is the new function that will be called after data is loaded
function runAnalysisOnLoadedData(history) {
    console.log('[DEBUG] runAnalysisOnLoadedData called with history:', history);
    if (history.length === 0) {
        document.getElementById('analysis-output').classList.add('hidden');
        document.getElementById('charts-container').classList.add('hidden');
        document.getElementById('weekly-summary-container').classList.add('hidden');
        return;
    };

    const todayLog = history[0];
    const dailySuggestions = generateSuggestionsForDay(todayLog);
    const dailyMacros = analyzeDay(todayLog);

    displayDailyAnalysis(dailySuggestions);
    renderMacroChart(dailyMacros);

    if (history.length >= 3) {
        const weeklySummary = generateWeeklySummary(history);
        displayWeeklySummary(weeklySummary);
    }
}

// The export/import functionality worked with localStorage.
// This will need to be re-thought or disabled in a server-based setup.
// For now, let's disable them to prevent confusion.
function exportHistory() {
    // This now triggers a download directly from the server's export endpoint
    // The correct path is /api/export, not /api/meals/export
    window.location.href = 'http://localhost:3000/api/export';
}

function importHistory(event) {
    alert('Import is disabled in server mode.');
    // const file = event.target.files[0];
    // if (!file) return;
    // const reader = new FileReader();
    // reader.onload = function(e) {
    //     try {
    //         const importedHistory = JSON.parse(e.target.result);
    //         if (Array.isArray(importedHistory)) {
    //             localStorage.setItem('mealHistory', JSON.stringify(importedHistory));
    //             loadHistory();
    //         } else {
    //             alert('Invalid file format.');
    //         }
    //     } catch (err) {
    //         alert('Error reading or parsing file.');
    //     }
    // };
    // reader.readAsText(file);
    // event.target.value = '';
}


function renderHistory(history) { // Now accepts history as an argument
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    history.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'card';

        const header = document.createElement('div');
        header.className = 'card-header';
        header.textContent = `${meal.date} - Water: ${meal.waterIntake || 0} glasses`;

        const mealInfo = document.createElement('div');
        mealInfo.className = 'meal-info';
        mealInfo.innerHTML = `
            <p><strong>Breakfast:</strong> ${meal.breakfast.food || 'N/A'} at ${meal.breakfast.time || 'N/A'} (Mood: ${meal.breakfast.mood})</p>
            <p><strong>Lunch:</strong> ${meal.lunch.food || 'N/A'} at ${meal.lunch.time || 'N/A'} (Mood: ${meal.lunch.mood})</p>
            <p><strong>Dinner:</strong> ${meal.dinner.food || 'N/A'} at ${meal.dinner.time || 'N/A'} (Mood: ${meal.dinner.mood})</p>
            <p><strong>Snacks:</strong> ${meal.snacks.map(s => s.food).join(', ') || 'None'}</p>
            <p><strong>Water:</strong> ${meal.waterIntake || 0} glasses</p>
        `;

        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.innerHTML = `
            <button onclick="editMeal(${meal.id})">Edit</button>
            <button onclick="deleteMeal(${meal.id})">Delete</button>
        `;

        card.appendChild(header);
        card.appendChild(mealInfo);
        card.appendChild(actions);
        historyList.appendChild(card);
    });
}
