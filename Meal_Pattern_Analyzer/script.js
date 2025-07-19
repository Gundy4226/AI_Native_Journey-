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
    const snacks = [];
    document.querySelectorAll('.snack-entry').forEach(entry => {
        const food = entry.querySelector('.snack-food').value.trim();
        const time = entry.querySelector('.snack-time').value;
        if (food) {
            snacks.push({ food, time });
        }
    });

    const mealData = {
        id: Date.now(),
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

    if (!mealData.breakfast.food && !mealData.lunch.food && !mealData.dinner.food && mealData.snacks.length === 0) {
        alert('Please log at least one meal or snack.');
        return;
    }

    saveMealHistory(mealData);
    loadHistory();
    clearInputs();
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

function runAllAnalysis() {
    const history = getMealHistory();
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

function generateWeeklySummary(history) {
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

function renderHistory() {
    const history = getMealHistory();
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    history.forEach(meal => {
        const li = document.createElement('li');
        li.dataset.id = meal.id;
        li.innerHTML = `
            <span class="date">${meal.date} - Water: ${meal.waterIntake || 0} glasses</span>
            <div class="meal-details">
                <p><strong>Breakfast:</strong> ${meal.breakfast.food || 'N/A'} (at ${meal.breakfast.time || 'N/A'}) - <em>Felt: ${meal.breakfast.mood || 'N/A'}</em></p>
                <p><strong>Lunch:</strong> ${meal.lunch.food || 'N/A'} (at ${meal.lunch.time || 'N/A'}) - <em>Felt: ${meal.lunch.mood || 'N/A'}</em></p>
                <p><strong>Dinner:</strong> ${meal.dinner.food || 'N/A'} (at ${meal.dinner.time || 'N/A'}) - <em>Felt: ${meal.dinner.mood || 'N/A'}</em></p>
                <p><strong>Snacks:</strong></p>
                <ul>
                    ${meal.snacks.map(s => `<li>${s.food} (at ${s.time || 'N/A'})</li>`).join('') || '<li>N/A</li>'}
                </ul>
            </div>
            <div class="actions">
                <button onclick="editMeal(${meal.id})">Edit</button>
                <button class="delete" onclick="deleteMeal(${meal.id})">Delete</button>
            </div>
        `;
        historyList.appendChild(li);
    });
}

// --- Data CRUD Functions ---
function getMealHistory() {
    return JSON.parse(localStorage.getItem('mealHistory')) || [];
}

function saveMealHistory(newMealData) {
    let history = getMealHistory();
    const existingIndex = history.findIndex(meal => meal.id === newMealData.id);
    if (existingIndex > -1) {
        history[existingIndex] = newMealData;
    } else {
        history.unshift(newMealData);
    }
    localStorage.setItem('mealHistory', JSON.stringify(history));
}

function deleteMeal(id, suppressConfirm = false) {
    const confirmed = suppressConfirm || confirm('Are you sure you want to delete this meal log?');
    if (confirmed) {
        let history = getMealHistory();
        history = history.filter(meal => meal.id !== id);
        localStorage.setItem('mealHistory', JSON.stringify(history));
        loadHistory();
    }
}

function editMeal(id) {
    const mealToEdit = getMealHistory().find(meal => meal.id === id);
    if (!mealToEdit) return;

    document.getElementById('water-intake').value = mealToEdit.waterIntake || '';
    document.getElementById('breakfast').value = mealToEdit.breakfast.food || '';
    document.getElementById('breakfast-time').value = mealToEdit.breakfast.time || '';
    document.getElementById('breakfast-mood').value = mealToEdit.breakfast.mood || 'none';
    document.getElementById('lunch').value = mealToEdit.lunch.food || '';
    document.getElementById('lunch-time').value = mealToEdit.lunch.time || '';
    document.getElementById('lunch-mood').value = mealToEdit.lunch.mood || 'none';
    document.getElementById('dinner').value = mealToEdit.dinner.food || '';
    document.getElementById('dinner-time').value = mealToEdit.dinner.time || '';
    document.getElementById('dinner-mood').value = mealToEdit.dinner.mood || 'none';

    const snacksContainer = document.getElementById('snacks-container');
    snacksContainer.innerHTML = '';
    if (mealToEdit.snacks && mealToEdit.snacks.length > 0) {
        mealToEdit.snacks.forEach(snack => addSnackInputWithData(snack.food, snack.time));
    } else {
        addSnackInput();
    }
    
    deleteMeal(id, true);

    window.scrollTo(0, 0);
    alert('Editing meal. Make your changes and click "Analyze My Day" to save the updated entry.');
}

function loadHistory() {
    renderHistory();
    runAllAnalysis();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all meal history? This cannot be undone.')) {
        localStorage.removeItem('mealHistory');
        loadHistory();
    }
}

function exportHistory() {
    const history = getMealHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal_history.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importHistory(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedHistory = JSON.parse(e.target.result);
            if (Array.isArray(importedHistory)) {
                localStorage.setItem('mealHistory', JSON.stringify(importedHistory));
                loadHistory();
                alert('History imported successfully!');
            } else {
                throw new Error('Invalid file format.');
            }
        } catch (error) {
            alert(`Error importing file: ${error.message}`);
        }
    };
    reader.readAsText(file);
}
