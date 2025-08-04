document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        // Main buttons
        analyzeBtn.addEventListener('click', analyzeMeals);
        document.getElementById('add-snack-btn').addEventListener('click', addSnackInput);

        // History management
        document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
        document.getElementById('export-btn').addEventListener('click', exportHistory);
        document.getElementById('import-file').addEventListener('change', importHistory);
        document.getElementById('generate-routine-btn').addEventListener('click', generateMuscleRoutine);
        document.getElementById('generate-plan-btn').addEventListener('click', generateMealPlan);
        
        // Initial load
        loadHistory();
        addSnackInput(); // Add one snack field by default
    }
});

function addSnackInput() {
    const container = document.getElementById('snacks-container');
    const snackId = `snack-${Date.now()}`;
    const newSnack = document.createElement('div');
    newSnack.className = 'snack-entry';
    newSnack.innerHTML = `
        <label for="${snackId}-food" class="sr-only">Snack Food</label>
        <input type="text" id="${snackId}-food" class="snack-food" placeholder="e.g., Apple">
        <label for="${snackId}-time" class="sr-only">Snack Time</label>
        <input type="time" id="${snackId}-time" class="snack-time">
    `;
    container.appendChild(newSnack);
}

function addSnackInputWithData(food, time) {
    const container = document.getElementById('snacks-container');
    const snackId = `snack-${Date.now()}`;
    const newSnack = document.createElement('div');
    newSnack.className = 'snack-entry';
    newSnack.innerHTML = `
        <label for="${snackId}-food" class="sr-only">Snack Food</label>
        <input type="text" id="${snackId}-food" class="snack-food" value="${food || ''}">
        <label for="${snackId}-time" class="sr-only">Snack Time</label>
        <input type="time" id="${snackId}-time" class="snack-time" value="${time || ''}">
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
            mood: document.getElementById('breakfast-mood').value,
            nutrition: {} // Placeholder for nutrition data
        },
        lunch: {
            food: document.getElementById('lunch').value.trim(),
            time: document.getElementById('lunch-time').value,
            mood: document.getElementById('lunch-mood').value,
            nutrition: {} // Placeholder for nutrition data
        },
        dinner: {
            food: document.getElementById('dinner').value.trim(),
            time: document.getElementById('dinner-time').value,
            mood: document.getElementById('dinner-mood').value,
            nutrition: {} // Placeholder for nutrition data
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

function generatePersonalizedSuggestions(history) {
    if (history.length < 3) {
        return ["Keep logging for a few more days to unlock personalized suggestions!"];
    }

    const suggestions = new Set();
    const allFoods = [];
    let energizedMeals = [];

    history.forEach(day => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const meal = day[mealType];
            if (meal.food) {
                allFoods.push(meal.food.toLowerCase());
                if (meal.mood === 'energized') {
                    energizedMeals.push({ meal: meal.food.toLowerCase(), type: mealType });
                }
            }
        });
    });

    // Suggestion 1: Recommend a popular and energizing meal
    if (energizedMeals.length > 0) {
        const favoriteEnergizingMeal = energizedMeals.reduce((a, b, i, arr) => 
            (arr.filter(v => v.meal === a.meal).length >= arr.filter(v => v.meal === b.meal).length) ? a : b, null);
        
        if (favoriteEnergizingMeal) {
            suggestions.add(`You often feel energized after eating ${favoriteEnergizingMeal.meal}. Consider having it for ${favoriteEnergizingMeal.type} again soon!`);
        }
    }

    // Suggestion 2: Nudge towards more variety if diet is repetitive
    const foodVariety = new Set(allFoods).size;
    if (allFoods.length > 5 && foodVariety / allFoods.length < 0.5) {
        suggestions.add("You have a consistent routine. Try introducing a new vegetable or protein this week to diversify your nutrients.");
    }

    // Add back some of the original basic suggestions if relevant
    const todayLog = history[0];
    if (todayLog.waterIntake < 6) {
        suggestions.add(`You logged ${todayLog.waterIntake || 0} glasses of water today. Aim for at least 6-8 glasses.`);
    }
    if (todayLog.dinner.time) {
        const dinnerHour = parseInt(todayLog.dinner.time.split(':')[0], 10);
        if (dinnerHour >= 21) {
            suggestions.add('Eating dinner late may affect sleep quality. Consider an earlier mealtime.');
        }
    }

    return suggestions.size > 0 ? Array.from(suggestions) : ["Your diet seems balanced today. Keep up the great work!"];
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
       const dailySuggestions = generatePersonalizedSuggestions(history); // Use personalized suggestions
       const dailyMacros = analyzeDay(todayLog);
   
       displayDailyAnalysis(dailySuggestions, tips); // Pass tips down
       renderMacroChart(dailyMacros);

    if (history.length >= 3) {
        const weeklySummary = generateWeeklySummary(history);
        displayWeeklySummary(weeklySummary);
    }
}

function generateWeeklySummary(history) {
    const summary = {
        lateDinners: 0,
        skippedBreakfasts: 0,
        energizedMeals: 0,
        sluggishMeals: 0,
        totalDays: Math.min(history.length, 7),
        mealTimes: { breakfast: [], lunch: [], dinner: [] }
    };

    history.slice(0, 7).forEach(day => {
        if (day.dinner.time) {
            const dinnerHour = parseInt(day.dinner.time.split(':')[0], 10);
            if (dinnerHour >= 21) summary.lateDinners++;
            summary.mealTimes.dinner.push(day.dinner.time);
        }
        
        if (day.breakfast.food) {
            summary.mealTimes.breakfast.push(day.breakfast.time);
        } else {
            summary.skippedBreakfasts++;
        }

        if(day.lunch.time) summary.mealTimes.lunch.push(day.lunch.time);

        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            if (day[mealType].mood === 'energized') summary.energizedMeals++;
            if (day[mealType].mood === 'sluggish') summary.sluggishMeals++;
        });
    });

    // Calculate Rhythm Score
    const calculateTimeConsistency = (times) => {
        if (times.length < 2) return 100; // Perfect score if 0 or 1 time logged
        const timeInMinutes = times.map(t => {
            const [hours, minutes] = t.split(':').map(Number);
            return hours * 60 + minutes;
        });
        const averageTime = timeInMinutes.reduce((a, b) => a + b, 0) / timeInMinutes.length;
        const variance = timeInMinutes.reduce((a, b) => a + Math.pow(b - averageTime, 2), 0) / timeInMinutes.length;
        const stdDev = Math.sqrt(variance);
        // Normalize score: 100 for perfect consistency (std dev = 0), decreases as variance grows.
        // A standard deviation of 60 mins results in a score around 50.
        return Math.max(0, 100 - (stdDev / 60) * 50);
    };

    const breakfastConsistency = calculateTimeConsistency(summary.mealTimes.breakfast);
    const lunchConsistency = calculateTimeConsistency(summary.mealTimes.lunch);
    const dinnerConsistency = calculateTimeConsistency(summary.mealTimes.dinner);
    
    summary.rhythmScore = Math.round((breakfastConsistency + lunchConsistency + dinnerConsistency) / 3);

    return summary;
}

// --- NEW: Community Tips ---
function displayCommunityTip(suggestions, tips) {
    const tipContainer = document.getElementById('community-tip-container');
    const tipText = document.getElementById('community-tip-text');
    let relevantTips = [];

    suggestions.forEach(suggestion => {
        if (suggestion.includes('protein')) relevantTips.push(...(tips.protein || []));
        if (suggestion.includes('vegetables')) relevantTips.push(...(tips.vegetables || []));
        if (suggestion.includes('water')) relevantTips.push(...(tips.water || []));
    });

    if (relevantTips.length === 0) {
        relevantTips = tips.general || []; // Show a general tip if no specific ones apply
    }

    if (relevantTips.length > 0) {
        const randomTip = relevantTips[Math.floor(Math.random() * relevantTips.length)];
        tipText.textContent = randomTip;
        tipContainer.classList.remove('hidden');
    } else {
        tipContainer.classList.add('hidden');
    }
}

// --- Display Functions ---
function displayDailyAnalysis(suggestions, tips) {
    const suggestionsEl = document.getElementById('suggestions');
    suggestionsEl.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsEl.innerHTML = '<li>Your diet seems balanced today. Keep up the great work!</li>';
        document.getElementById('community-tip-container').classList.add('hidden');
    } else {
        suggestions.forEach(s => {
            const li = document.createElement('li');
            li.textContent = s;
            suggestionsEl.appendChild(li);
        });
        displayCommunityTip(suggestions, tips); // Display a relevant community tip
    }
    document.getElementById('analysis-output').classList.remove('hidden');
}

function displayWeeklySummary(summary) {
    const summaryEl = document.getElementById('weekly-summary');
    
    const rhythmExplanation = summary.rhythmScore > 80 ? "Fantastic! Your meal times are very consistent." :
                              summary.rhythmScore > 60 ? "Good job. Your meal schedule is fairly regular." :
                              "Try to eat your meals at more consistent times for better energy levels.";

    summaryEl.innerHTML = `
        <div class="summary-metric">
            <span class="metric-value">${summary.rhythmScore}</span>
            <span class="metric-label">Meal Rhythm Score</span>
            <p class="metric-explanation">${rhythmExplanation}</p>
        </div>
        <div class="summary-details">
            <p>Over the last ${summary.totalDays} days:</p>
            <ul>
                <li>You had a late dinner on <strong>${summary.lateDinners}</strong> day(s).</li>
                <li>You skipped breakfast on <strong>${summary.skippedBreakfasts}</strong> day(s).</li>
                <li>You felt energized after <strong>${summary.energizedMeals}</strong> meal(s) and sluggish after <strong>${summary.sluggishMeals}</strong>.</li>
            </ul>
        </div>
    `;
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

function renderHistory(history) { // Now accepts history as an argument
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<li>No meal history yet.</li>';
        return;
    }

    history.forEach(meal => {
        const card = document.createElement('li');
        card.className = 'meal-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-labelledby', `meal-date-${meal.id}`);

        const header = document.createElement('h3');
        header.id = `meal-date-${meal.id}`;
        header.textContent = meal.date;

        const mealInfo = document.createElement('div');
        mealInfo.className = 'meal-info';

        const snacksHtml = (meal.snacks && meal.snacks.length > 0)
            ? meal.snacks.map(s => `<p><strong>Snack:</strong> ${s.food}</p>${formatNutrition(s.nutrition)}`).join('')
            : '<p><strong>Snacks:</strong> None</p>';

        mealInfo.innerHTML = `
            <p><strong>Breakfast:</strong> ${meal.breakfast.food || 'N/A'} at ${meal.breakfast.time || 'N/A'} (Mood: ${meal.breakfast.mood})</p>
            ${formatNutrition(meal.breakfast.nutrition)}
            <p><strong>Lunch:</strong> ${meal.lunch.food || 'N/A'} at ${meal.lunch.time || 'N/A'} (Mood: ${meal.lunch.mood})</p>
            ${formatNutrition(meal.lunch.nutrition)}
            <p><strong>Dinner:</strong> ${meal.dinner.food || 'N/A'} at ${meal.dinner.time || 'N/A'} (Mood: ${meal.dinner.mood})</p>
            ${formatNutrition(meal.dinner.nutrition)}
            ${snacksHtml}
            <p><strong>Water:</strong> ${meal.waterIntake || 0} glasses</p>
        `;

        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.innerHTML = `
            <button onclick="editMeal(${meal.id})" aria-label="Edit meal from ${meal.date}">Edit</button>
            <button onclick="deleteMeal(${meal.id})" class="delete" aria-label="Delete meal from ${meal.date}">Delete</button>
        `;

        card.appendChild(header);
        card.appendChild(mealInfo);
        card.appendChild(actions);
        historyList.appendChild(card);
    });
}

// --- Data Persistence Layer (Replaced with API calls) ---

const API_URL = 'http://localhost:3000/api/meals';
const NUTRITION_API_URL = 'http://localhost:3000/api/calorieninjas';
const QUESTS_API_URL = 'http://localhost:3000/api/quests';
const TIPS_API_URL = 'http://localhost:3000/api/community-tips';

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
    // --- NEW: Fetch nutrition data before saving, with improved error handling ---
    
    // Create a more robust helper function to fetch nutrition for a meal type
    const fetchNutrition = async (meal) => {
        if (!meal.food) return; // Exit if there's no food to look up

        try {
            // Use POST request with a body for the new, more powerful endpoint
            const response = await fetch(NUTRITION_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: meal.food })
            });
            
            if (response.ok) {
                const nutritionData = await response.json();
                // Check if the API returned valid nutrition data
                // The new endpoint sums the nutrients, so we check if calories > 0
                if (nutritionData.items && nutritionData.items.length > 0) {
                    const item = nutritionData.items[0];
                    meal.nutrition = {
                        calories: Math.round(item.calories),
                        fat: Math.round(item.fat_total_g),
                        protein: Math.round(item.protein_g),
                        carbs: Math.round(item.carbohydrates_total_g)
                    };
                } else {
                    // Handle cases where CalorieNinjas doesn't recognize the food
                    alert(`CalorieNinjas API worked, but it could not find any nutrition data for "${meal.food}".\n\nPlease try being more specific (e.g., "1 slice of whole wheat bread" instead of "bread").`);
                    meal.nutrition = {}; // Ensure it's an empty object
                }
            } else {
                // Handle HTTP errors (like 401 Unauthorized, 402 Payment Required, 500 Server Error)
                const errorData = await response.json().catch(() => ({ error: "Could not parse the error response from server." })); 
                const errorMessage = errorData.error || `The server responded with an error (Status: ${response.status}).`;
                const errorDetails = errorData.details ? JSON.stringify(errorData.details) : 'No specific details were provided.';
                alert(`Could not fetch nutrition data for "${meal.food}".\n\nReason: ${errorMessage}\nDetails: ${errorDetails}\n\nPlease check your backend server logs and your CalorieNinjas API key.`);
            }
        } catch (networkError) {
            // Handle network errors (e.g., the backend server is not running)
            console.error('Network error fetching nutrition data:', networkError);
            alert(`Failed to connect to the backend server to get nutrition data for "${meal.food}".\n\nPlease make sure your 'node server.js' is running correctly.\n\nError: ${networkError.message}`);
        }
    };

    // Fetch for all main meals and snacks in parallel
    const nutritionPromises = [
        fetchNutrition(newMealData.breakfast),
        fetchNutrition(newMealData.lunch),
        fetchNutrition(newMealData.dinner),
        ...newMealData.snacks.map(snack => fetchNutrition(snack))
    ];
    await Promise.all(nutritionPromises);
    
    // --- END NEW ---

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
    
    // Fetch all data in parallel
    const [history, quests, tips] = await Promise.all([
        getMealHistory(),
        fetch(QUESTS_API_URL).then(res => res.json()),
        fetch(TIPS_API_URL).then(res => res.json())
    ]);

    console.log('[DEBUG] History loaded from server:', history);
    console.log('[DEBUG] Quests loaded from server:', quests);
    console.log('[DEBUG] Tips loaded from server:', tips);

    renderHistory(history);
    displayQuests(history, quests);
    
    // Pass the already fetched history and tips to the analysis functions
    runAnalysisOnLoadedData(history, tips); 
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
   function runAnalysisOnLoadedData(history, tips) {
       console.log('[DEBUG] runAnalysisOnLoadedData called with history:', history);
       if (history.length === 0) {
           document.getElementById('analysis-output').classList.add('hidden');
           document.getElementById('charts-container').classList.add('hidden');
           document.getElementById('weekly-summary-container').classList.add('hidden');
           return;
       };
   
       const todayLog = history[0];
       const dailySuggestions = generatePersonalizedSuggestions(history); // Using the personalized one now
       const dailyMacros = analyzeDay(todayLog);
   
       displayDailyAnalysis(dailySuggestions, tips); // Pass tips down
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

function formatNutrition(nutrition) {
    if (!nutrition || Object.keys(nutrition).length === 0) {
        return ''; // Don't display anything if there's no nutrition data
    }
    return `
        <div class="nutrition-details">
            <p>Calories: ${nutrition.calories || 'N/A'}, Protein: ${nutrition.protein || 'N/A'}g, Fat: ${nutrition.fat || 'N/A'}g, Carbs: ${nutrition.carbs || 'N/A'}g</p>
        </div>
    `;
}

function generateMuscleRoutine() {
    const routine = {
        title: "3-Day Muscle-Building Split (Push/Pull/Legs)",
        description: "This routine is designed to maximize muscle growth by targeting all major muscle groups over three days. Rest for 60-90 seconds between sets. Aim for progressive overload by increasing weight or reps over time.",
        days: [
            {
                day: "Day 1: Push (Chest, Shoulders, Triceps)",
                exercises: [
                    "Bench Press: 3 sets of 5-8 reps",
                    "Overhead Press: 3 sets of 8-12 reps",
                    "Incline Dumbbell Press: 3 sets of 8-12 reps",
                    "Lateral Raises: 3 sets of 12-15 reps",
                    "Tricep Pushdowns: 3 sets of 10-15 reps"
                ]
            },
            {
                day: "Day 2: Pull (Back, Biceps)",
                exercises: [
                    "Pull-Ups or Lat Pulldowns: 3 sets of 8-12 reps",
                    "Barbell Rows: 3 sets of 8-12 reps",
                    "Face Pulls: 3 sets of 15-20 reps",
                    "Bicep Curls: 3 sets of 10-15 reps",
                    "Hammer Curls: 3 sets of 10-15 reps"
                ]
            },
            {
                day: "Day 3: Legs (Quads, Hamstrings, Calves)",
                exercises: [
                    "Squats: 3 sets of 5-8 reps",
                    "Romanian Deadlifts: 3 sets of 8-12 reps",
                    "Leg Press: 3 sets of 10-15 reps",
                    "Leg Curls: 3 sets of 12-15 reps",
                    "Calf Raises: 4 sets of 15-20 reps"
                ]
            }
        ]
    };

    const outputContainer = document.getElementById('routine-output');
    let html = `<h3 id="routine-title">${routine.title}</h3><p>${routine.description}</p>`;
    routine.days.forEach((day, index) => {
        const dayId = `day-${index + 1}`;
        html += `<h4 id="${dayId}">${day.day}</h4><ul aria-labelledby="${dayId}">`;
        day.exercises.forEach(exercise => {
            html += `<li>${exercise}</li>`;
        });
        html += `</ul>`;
    });

    outputContainer.innerHTML = html;
    outputContainer.classList.remove('hidden');
    outputContainer.setAttribute('aria-labelledby', 'routine-title');
}

// --- NEW: Meal Plan Generation ---
const DIVERSE_MEAL_IDEAS = {
    breakfast: [
        "Greek Yogurt with Honey and Nuts",
        "Avocado Toast with a Poached Egg",
        "Smoothie with Spinach, Banana, and Protein Powder",
        "Whole Wheat Pancakes with Berries",
        "Breakfast Burrito with Black Beans and Salsa"
    ],
    lunch: [
        "Lentil Soup with a side of Whole Wheat Bread",
        "Turkey and Avocado Wrap",
        "Mason Jar Salad with Chickpeas and a Vinaigrette",
        "Leftover Salmon with Roasted Asparagus",
        "Caprese Salad with Fresh Mozzarella, Tomatoes, and Basil"
    ],
    dinner: [
        "Sheet Pan Lemon Herb Chicken with Potatoes and Green Beans",
        "Black Bean Burgers on Whole Wheat Buns",
        "Shrimp Scampi with Zucchini Noodles",
        "Vegetable Stir-fry with Tofu and Brown Rice",
        "Stuffed Bell Peppers with Quinoa and Ground Turkey"
    ]
};

function createMealPlan(history) {
    if (!history || history.length < 3) {
        return null;
    }

    const getFavoriteMeal = (mealType) => {
        const meals = history
            .map(day => day[mealType])
            .filter(meal => meal && meal.food && meal.mood === 'energized')
            .map(meal => meal.food.toLowerCase());
        
        if (meals.length === 0) return null;
        
        return meals.reduce((a, b, i, arr) => 
            (arr.filter(v => v === a).length >= arr.filter(v => v === b).length) ? a : b, null);
    };

    const usedMeals = new Set();

    const getUniqueMeal = (mealType, favorite) => {
        let meal;
        // 50% chance to use a favorite if it exists and hasn't been used
        if (favorite && !usedMeals.has(favorite) && Math.random() < 0.5) {
            meal = favorite;
        } else {
            // Pick a random new meal, ensuring it's not a duplicate
            const mealOptions = DIVERSE_MEAL_IDEAS[mealType];
            do {
                meal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
            } while (usedMeals.has(meal));
        }
        usedMeals.add(meal);
        return meal;
    };

    const favorites = {
        breakfast: getFavoriteMeal('breakfast'),
        lunch: getFavoriteMeal('lunch'),
        dinner: getFavoriteMeal('dinner')
    };

    const plan = {
        day1: {
            breakfast: getUniqueMeal('breakfast', favorites.breakfast),
            lunch: getUniqueMeal('lunch', favorites.lunch),
            dinner: getUniqueMeal('dinner', favorites.dinner)
        },
        day2: {
            breakfast: getUniqueMeal('breakfast', favorites.breakfast),
            lunch: getUniqueMeal('lunch', favorites.lunch),
            dinner: getUniqueMeal('dinner', favorites.dinner)
        },
        day3: {
            breakfast: getUniqueMeal('breakfast', favorites.breakfast),
            lunch: getUniqueMeal('lunch', favorites.lunch),
            dinner: getUniqueMeal('dinner', favorites.dinner)
        }
    };
    return plan;
}

async function generateMealPlan() {
    const history = await getMealHistory();
    const plan = createMealPlan(history);

    if (!plan) {
        alert("Please log at least 3 days of meals to generate a personalized plan.");
        return;
    }

    displayMealPlan(plan);
}

function displayMealPlan(plan) {
    const planOutput = document.getElementById('meal-plan-output');
    let html = '<h3>Your 3-Day Plan</h3>';
    for (const day in plan) {
        html += `<div class="meal-plan-day"><h4>${day.charAt(0).toUpperCase() + day.slice(1)}</h4><ul>`;
        for (const mealType in plan[day]) {
            html += `<li><strong>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}:</strong> ${plan[day][mealType]}</li>`;
        }
        html += '</ul></div>';
    }
    planOutput.innerHTML = html;
    planOutput.classList.remove('hidden');
    document.getElementById('meal-plan-actions').classList.remove('hidden');

    // Add event listeners for the new buttons
    document.getElementById('export-grocery-btn').addEventListener('click', () => exportToGrocery(plan));
    document.getElementById('find-meal-kits-btn').addEventListener('click', () => findMealKits(plan));
}

function exportToGrocery(plan) {
    const ingredients = new Set();
    Object.values(plan).forEach(day => {
        Object.values(day).forEach(meal => {
            // Very basic keyword extraction. A real implementation would be more robust.
            meal.split(' ').forEach(word => {
                const cleanedWord = word.replace(/,$/, '').toLowerCase();
                if (FOOD_KEYWORDS.protein.includes(cleanedWord) || FOOD_KEYWORDS.vegetables.includes(cleanedWord) || FOOD_KEYWORDS.fruits.includes(cleanedWord) || FOOD_KEYWORDS.carbs.includes(cleanedWord) || FOOD_KEYWORDS.fats.includes(cleanedWord)) {
                    ingredients.add(cleanedWord);
                }
            });
        });
    });

    let fileContent = "Your Meal Map Grocery List\n\n";
    fileContent += "-------------------------\n\n";
    
    if (ingredients.size > 0) {
        fileContent += Array.from(ingredients).map(item => `- ${item.charAt(0).toUpperCase() + item.slice(1)}`).join('\n');
    } else {
        fileContent += "No specific ingredients found in your meal plan. Try adding more variety!";
    }

    // Create a Blob from the content
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'grocery-list.txt';
    
    // Append to the document, click, and then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function findMealKits(plan) {
    // This would redirect to a meal kit service with search parameters.
    const mainDinner = plan.day1.dinner || "healthy dinner";
    const url = `https://www.hellofresh.com/recipes/search?q=${encodeURIComponent(mainDinner)}`;
    
    alert(`Searching for meal kits related to "${mainDinner}"...\n(You will be redirected to an external site)`);
    window.open(url, '_blank');
}

// --- NEW: Wellness Quests ---
function checkQuestProgress(history, quests) {
    const progress = {
        hydrate: 0,
        earlyBird: 0,
        rainbow: new Set()
    };

    let consecutiveHydrationDays = 0;
    for (const day of history) {
        // Hydration quest (consecutive days)
        if (day.waterIntake >= 8) {
            consecutiveHydrationDays++;
        } else {
            consecutiveHydrationDays = 0; // Reset if the streak is broken
        }
        progress.hydrate = Math.max(progress.hydrate, consecutiveHydrationDays);

        // Early Bird quest
        if (day.breakfast.time && new Date(`1970-01-01T${day.breakfast.time}`).getHours() < 9) {
            progress.earlyBird++;
        }

        // Rainbow quest (unique vegetables over the last 7 days)
        if (history.indexOf(day) < 7) {
            const allFoods = [day.breakfast.food, day.lunch.food, day.dinner.food, ...day.snacks.map(s => s.food)].join(' ').toLowerCase();
            FOOD_KEYWORDS.vegetables.forEach(veg => {
                if (allFoods.includes(veg)) {
                    progress.rainbow.add(veg);
                }
            });
        }
    }
    
    return {
        hydrate: progress.hydrate,
        earlyBird: Math.min(progress.earlyBird, quests.earlyBird.goal), // Cap progress at goal
        rainbow: progress.rainbow.size
    };
}

function displayQuests(history, quests) {
    const progress = checkQuestProgress(history, quests);
    const questsOutput = document.getElementById('quests-output');
    let html = '';

    for (const key in quests) {
        const quest = quests[key];
        const currentProgress = progress[key];
        const percentage = Math.min((currentProgress / quest.goal) * 100, 100);
        
        html += `
            <div class="quest-card ${percentage === 100 ? 'completed' : ''}">
                <div class="quest-info">
                    <h4>${quest.title} ${percentage === 100 ? '🏆' : ''}</h4>
                    <p>${quest.description}</p>
                </div>
                <div class="quest-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${percentage}%;"></div>
                    </div>
                    <span>${currentProgress} / ${quest.goal}</span>
                </div>
            </div>
        `;
    }

    questsOutput.innerHTML = html;
    document.getElementById('quests-container').classList.remove('hidden');
}

window.addEventListener('load', () => {
    if (typeof axe !== 'undefined') {
        console.log('Running accessibility test...');
        axe.run(document.body, (err, results) => {
            if (err) {
                console.error('Accessibility test error:', err);
                return;
            }
            if (results.violations.length === 0) {
                console.log('Accessibility test passed! No violations found.');
            } else {
                console.warn(`Accessibility issues found (${results.violations.length}):`);
                console.table(results.violations);
            }
        });
    }
});

