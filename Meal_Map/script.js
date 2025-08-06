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

        // Event delegation for meal plan actions
        document.getElementById('meal-plan-actions').addEventListener('click', (event) => {
            if (!currentMealPlan) return;
            if (event.target.id === 'export-grocery-btn') {
                exportToGrocery(currentMealPlan);
            }
            if (event.target.id === 'find-meal-kits-btn') {
                findMealKits(currentMealPlan);
            }
        });
        
        // Initial data load - main meal times are populated from i18n.js
        loadHistory();
    }
});

function populateMainMealTimes() {
    const breakfastSelect = document.getElementById('breakfast-time');
    const lunchSelect = document.getElementById('lunch-time');
    const dinnerSelect = document.getElementById('dinner-time');

    if (breakfastSelect) {
        breakfastSelect.innerHTML = generateTimeOptionsHTML({ startHour: 6, endHour: 11 }); 
    }
    if (lunchSelect) {
        lunchSelect.innerHTML = generateTimeOptionsHTML({ startHour: 11, endHour: 15 });
    }
    if (dinnerSelect) {
        dinnerSelect.innerHTML = generateTimeOptionsHTML({ startHour: 17, endHour: 22 });
    }
}

function generateTimeOptionsHTML(options = {}) {
    const { selectedValue = '', startHour = 0, endHour = 24 } = options;
    
    let optionsHTML = `<option value="" disabled ${!selectedValue ? 'selected' : ''}>${getTranslation('selectATime')}</option>`;

    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, '0');
            const minute = m.toString().padStart(2, '0');
            const timeValue = `${hour}:${minute}`;
            
            const ampm = h >= 12 ? 'PM' : 'AM';
            let displayHour = h % 12;
            if (displayHour === 0) displayHour = 12;
            const displayTime = `${displayHour}:${minute} ${ampm}`;
            
            const isSelected = timeValue === selectedValue ? 'selected' : '';
            optionsHTML += `<option value="${timeValue}" ${isSelected}>${displayTime}</option>`;
        }
    }
    return optionsHTML;
}

function addSnackInput() {
    const container = document.getElementById('snacks-container');
    const snackId = `snack-${Date.now()}`;
    const newSnack = document.createElement('div');
    newSnack.className = 'snack-entry';
    // No hour constraints for snacks
    newSnack.innerHTML = `
        <label for="${snackId}-food" class="sr-only">Snack Food</label>
        <input type="text" id="${snackId}-food" class="snack-food" placeholder="e.g., Apple">
        <label for="${snackId}-time" class="sr-only">Snack Time</label>
        <select id="${snackId}-time" class="snack-time">
            ${generateTimeOptionsHTML()}
        </select>
    `;
    container.appendChild(newSnack);
}

function addSnackInputWithData(food, time) {
    const container = document.getElementById('snacks-container');
    const snackId = `snack-${Date.now()}`;
    const newSnack = document.createElement('div');
    newSnack.className = 'snack-entry';
    // No hour constraints for snacks, but pass the selected time
    newSnack.innerHTML = `
        <label for="${snackId}-food" class="sr-only">Snack Food</label>
        <input type="text" id="${snackId}-food" class="snack-food" value="${food || ''}">
        <label for="${snackId}-time" class="sr-only">Snack Time</label>
        <select id="${snackId}-time" class="snack-time">
            ${generateTimeOptionsHTML({ selectedValue: time })}
        </select>
    `;
    container.appendChild(newSnack);
}
// ... Rest of script.js remains the same as the last correct version
// I will append the rest of the file content here to provide a single, complete update.
// ... from previous correct read ...
function analyzeMeals() {
    try {
        console.log('[DEBUG] analyzeMeals called.');
        const snacks = [];
        document.querySelectorAll('.snack-entry').forEach(entry => {
            const food = entry.querySelector('.snack-food').value.trim();
            const time = entry.querySelector('.snack-time').value;
            if (food) {
                snacks.push({ food, time, nutrition: {} });
            }
        });

        const idHolder = document.getElementById('meal-id-holder');
        const existingId = idHolder && idHolder.value ? parseInt(idHolder.value, 10) : null;

        const mealData = {
            id: existingId || Date.now(),
            date: new Date().toLocaleDateString(),
            waterIntake: document.getElementById('water-intake').value,
            breakfast: {
                food: document.getElementById('breakfast').value.trim(),
                time: document.getElementById('breakfast-time').value,
                mood: document.getElementById('breakfast-mood').value,
                nutrition: {}
            },
            lunch: {
                food: document.getElementById('lunch').value.trim(),
                time: document.getElementById('lunch-time').value,
                mood: document.getElementById('lunch-mood').value,
                nutrition: {}
            },
            dinner: {
                food: document.getElementById('dinner').value.trim(),
                time: document.getElementById('dinner-time').value,
                mood: document.getElementById('dinner-mood').value,
                nutrition: {}
            },
            snacks: snacks
        };

        if (existingId) {
            const originalMeal = mealHistoryCache.find(m => m.id === existingId);
            if (originalMeal) {
                mealData.date = originalMeal.date;
            }
        }

        if (!mealData.breakfast.food && !mealData.lunch.food && !mealData.dinner.food && mealData.snacks.length === 0) {
            alert(getTranslation('logMealAlert'));
            return;
        }

        saveMealHistory(mealData);

        if (idHolder) {
            idHolder.value = '';
        }
    } catch (error) {
        console.error('An unexpected error occurred in analyzeMeals:', error);
        alert(`A critical error occurred. Error: ${error.message}`);
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

const FOOD_KEYWORDS = {
    protein: ['chicken', 'beef', 'fish', 'salmon', 'tuna', 'eggs', 'tofu', 'lentils', 'beans', 'shrimp', 'scampi', 'bean', 'burgers'],
    carbs: ['bread', 'pasta', 'rice', 'potatoes', 'oatmeal', 'cereal', 'bagel', 'noodles', 'buns', 'wheat'],
    fats: ['avocado', 'nuts', 'seeds', 'olive oil', 'cheese'],
    vegetables: ['salad', 'broccoli', 'spinach', 'carrots', 'peppers', 'onions', 'green beans', 'zucchini'],
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

    if (energizedMeals.length > 0) {
        const favoriteEnergizingMeal = energizedMeals.reduce((a, b) => 
            (energizedMeals.filter(v => v.meal === a.meal).length >= energizedMeals.filter(v => v.meal === b.meal).length) ? a : b);
        
        if (favoriteEnergizingMeal) {
            suggestions.add(`You often feel energized after eating ${favoriteEnergizingMeal.meal}. Consider having it for ${favoriteEnergizingMeal.type} again soon!`);
        }
    }

    const foodVariety = new Set(allFoods).size;
    if (allFoods.length > 5 && foodVariety / allFoods.length < 0.5) {
        suggestions.add("You have a consistent routine. Try introducing a new vegetable or protein this week to diversify your nutrients.");
    }

    const todayLog = history.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
    });

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
        displayCommunityTip(suggestions, tips);
    }
}

function renderMacroChart(macroData) {
    const ctx = document.getElementById('macro-chart').getContext('2d');
    if (window.macroChartInstance) {
        window.macroChartInstance.destroy();
    }
    window.macroChartInstance = new Chart(ctx, {
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
}

const RENDER_URL = 'https://ai-native-journey-bp45.onrender.com';
const API_URL = `${RENDER_URL}/api/meals`;
const NUTRITION_API_URL = `${RENDER_URL}/api/calorieninjas`;
const QUESTS_API_URL = `${RENDER_URL}/api/quests`;
const TIPS_API_URL = `${RENDER_URL}/api/community-tips`;

let mealHistoryCache = [];
let currentMealPlan = null;

async function getMealHistory() {
    try {
        const response = await fetch(API_URL);
        mealHistoryCache = await response.json();
        return mealHistoryCache.slice().reverse();
    } catch (error) {
        console.error('Failed to fetch meal history:', error);
        return [];
    }
}

async function saveMealHistory(newMealData) {
    const fetchImage = async (meal) => {
        if (!meal.food) return;
        try {
            const response = await fetch(`${RENDER_URL}/api/food-image?query=${encodeURIComponent(meal.food)}`);
            if (response.ok) {
                const data = await response.json();
                meal.imageUrl = data.imageUrl;
            }
        } catch (error) {
            console.error(`Could not fetch image for ${meal.food}:`, error);
        }
    };

    const fetchNutrition = async (meal) => {
        if (!meal.food) return;

        try {
            const response = await fetch(NUTRITION_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: meal.food })
            });
            
            if (response.ok) {
                const nutritionData = await response.json();
                if (nutritionData.items && nutritionData.items.length > 0) {
                    const item = nutritionData.items[0];
                    meal.nutrition = {
                        calories: Math.round(item.calories),
                        fat: Math.round(item.fat_total_g),
                        protein: Math.round(item.protein_g),
                        carbs: Math.round(item.carbohydrates_total_g)
                    };
                } else {
                    alert(`Could not find nutrition data for "${meal.food}".`);
                    meal.nutrition = {};
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Could not fetch nutrition data for "${meal.food}". Reason: ${errorData.error || response.statusText}`);
            }
        } catch (networkError) {
            console.error('Network error fetching nutrition data:', networkError);
            alert(`Failed to connect to the backend server for nutrition data.`);
        }
    };

    const dataPromises = [
        fetchNutrition(newMealData.breakfast),
        fetchNutrition(newMealData.lunch),
        fetchNutrition(newMealData.dinner),
        ...newMealData.snacks.map(snack => fetchNutrition(snack)),
        fetchImage(newMealData.breakfast),
        fetchImage(newMealData.lunch),
        fetchImage(newMealData.dinner)
    ];
    await Promise.all(dataPromises);

    const isEditing = mealHistoryCache.some(meal => meal.id === newMealData.id);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${newMealData.id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMealData)
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(`Server responded with ${response.status}. ${JSON.stringify(errorBody)}`);
        }

        clearInputs();
        await loadHistory();
        
        const analysisSection = document.getElementById('analysis-and-charts');
        if (analysisSection) {
            analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
        
    } catch (error) {
        console.error('Failed to save meal data:', error);
        alert(`A critical error occurred while saving. Error: ${error.message}`);
    }
}

async function deleteMeal(id, suppressConfirm = false) {
    if (!suppressConfirm && !confirm(getTranslation('confirmDeleteEntry'))) {
        return;
    }
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadHistory();
    } catch (error) {
        console.error('Failed to delete meal:', error);
    }
}

function editMeal(id) {
    const mealToEdit = mealHistoryCache.find(m => m.id === id);
    if (!mealToEdit) return;

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

    const snacksContainer = document.getElementById('snacks-container');
    snacksContainer.innerHTML = '';
    if (mealToEdit.snacks && mealToEdit.snacks.length > 0) {
        mealToEdit.snacks.forEach(snack => addSnackInputWithData(snack.food, snack.time));
    } else {
        addSnackInput();
    }

    let idHolder = document.getElementById('meal-id-holder');
    if (!idHolder) {
        idHolder = document.createElement('input');
        idHolder.type = 'hidden';
        idHolder.id = 'meal-id-holder';
        document.body.appendChild(idHolder);
    }
    idHolder.value = id;

    window.scrollTo(0, 0);
}

async function loadHistory() {
    const [history, quests, tips] = await Promise.all([
        getMealHistory().catch(() => []),
        fetch(QUESTS_API_URL).then(res => res.json()).catch(() => ({})),
        fetch(TIPS_API_URL).then(res => res.json()).catch(() => ({}))
    ]);

    renderHistory(history);
    displayQuests(history, quests);
    runAnalysisOnLoadedData(history, tips); 
}

function clearHistory() {
    if (!confirm(getTranslation('confirmClearHistory'))) {
        return;
    }
    const historyToDelete = [...mealHistoryCache];
    Promise.all(historyToDelete.map(meal => deleteMeal(meal.id, true)))
        .then(() => loadHistory())
        .catch(error => console.error('Failed to clear history:', error));
}

function runAnalysisOnLoadedData(history, tips) {
   const analysisCard = document.getElementById('analysis-and-charts');
   if (history.length === 0) {
       analysisCard.classList.add('hidden');
       document.getElementById('weekly-summary-container').classList.add('hidden');
       return;
   };

   const todayLog = history.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest);
   const dailySuggestions = generatePersonalizedSuggestions(history);
   const dailyMacros = analyzeDay(todayLog);

   displayDailyAnalysis(dailySuggestions, tips);
   renderMacroChart(dailyMacros);
   analysisCard.classList.remove('hidden');

   if (history.length >= 3) {
       const weeklySummary = generateWeeklySummary(history);
       displayWeeklySummary(weeklySummary);
   } else {
       document.getElementById('weekly-summary-container').classList.add('hidden');
   }
}

function renderHistory(history) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<li>No meal history yet.</li>';
        return;
    }

    history.forEach(meal => {
        const card = document.createElement('li');
        card.className = 'meal-card';
        card.setAttribute('aria-labelledby', `meal-date-${meal.id}`);

        let imagesHtml = '<div class="meal-images-container">';
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            if (meal[mealType] && meal[mealType].imageUrl) {
                imagesHtml += `
                    <div class="meal-image-wrapper">
                        <p>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</p>
                        <img src="${meal[mealType].imageUrl}" alt="${meal[mealType].food}" class="food-image">
                    </div>
                `;
            }
        });
        imagesHtml += '</div>';

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
            <button onclick="editMeal(${meal.id})">Edit</button>
            <button onclick="deleteMeal(${meal.id})" class="delete">Delete</button>
        `;

        card.appendChild(header);
        if (imagesHtml.includes('img')) {
            card.innerHTML += imagesHtml;
        }
        card.appendChild(mealInfo);
        card.appendChild(actions);
        historyList.appendChild(card);
    });
}
