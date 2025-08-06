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

    if (breakfastSelect) breakfastSelect.innerHTML = generateTimeOptionsHTML({ startHour: 6, endHour: 11 }); 
    if (lunchSelect) lunchSelect.innerHTML = generateTimeOptionsHTML({ startHour: 11, endHour: 15 });
    if (dinnerSelect) dinnerSelect.innerHTML = generateTimeOptionsHTML({ startHour: 17, endHour: 22 });
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
            const displayTime = `${displayHour}:${minute.padStart(2,'0')} ${ampm}`;
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

function analyzeMeals() {
    try {
    const snacks = [];
    document.querySelectorAll('.snack-entry').forEach(entry => {
        const food = entry.querySelector('.snack-food').value.trim();
        const time = entry.querySelector('.snack-time').value;
            if (food) snacks.push({ food, time, nutrition: {} });
    });
    const idHolder = document.getElementById('meal-id-holder');
    const existingId = idHolder && idHolder.value ? parseInt(idHolder.value, 10) : null;
    const mealData = {
        id: existingId || Date.now(),
        date: new Date().toLocaleDateString(),
        waterIntake: document.getElementById('water-intake').value,
            breakfast: { food: document.getElementById('breakfast').value.trim(), time: document.getElementById('breakfast-time').value, mood: document.getElementById('breakfast-mood').value, nutrition: {} },
            lunch: { food: document.getElementById('lunch').value.trim(), time: document.getElementById('lunch-time').value, mood: document.getElementById('lunch-mood').value, nutrition: {} },
            dinner: { food: document.getElementById('dinner').value.trim(), time: document.getElementById('dinner-time').value, mood: document.getElementById('dinner-mood').value, nutrition: {} },
        snacks: snacks
    };
    if (existingId) {
        const originalMeal = mealHistoryCache.find(m => m.id === existingId);
            if (originalMeal) mealData.date = originalMeal.date;
        }
    if (!mealData.breakfast.food && !mealData.lunch.food && !mealData.dinner.food && mealData.snacks.length === 0) {
            alert(getTranslation('logMealAlert'));
        return;
    }
        saveMealHistory(mealData);
        if (idHolder) idHolder.value = '';
    } catch (error) {
        console.error('An unexpected error in analyzeMeals:', error);
        alert(`A critical error occurred: ${error.message}`);
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

function getFoodKeywords() {
    const lang = localStorage.getItem('language') || 'en';
    if (lang === 'es') {
        return {
            protein: ['pollo', 'carne', 'pescado', 'salmón', 'atún', 'huevos', 'tofu', 'lentejas', 'frijoles', 'camarones', 'gambas', 'hamburguesas'],
            carbs: ['pan', 'pasta', 'arroz', 'patatas', 'avena', 'cereal', 'bagel', 'fideos', 'bollos', 'trigo'],
            fats: ['aguacate', 'nueces', 'semillas', 'aceite de oliva', 'queso'],
            vegetables: ['ensalada', 'brócoli', 'espinacas', 'zanahorias', 'pimientos', 'cebollas', 'judías verdes', 'calabacín'],
            fruits: ['manzana', 'plátano', 'bayas', 'naranja', 'uvas']
        };
    }
    // Default to English
    return {
        protein: ['chicken', 'beef', 'fish', 'salmon', 'tuna', 'eggs', 'tofu', 'lentils', 'beans', 'shrimp', 'scampi', 'bean', 'burgers'],
        carbs: ['bread', 'pasta', 'rice', 'potatoes', 'oatmeal', 'cereal', 'bagel', 'noodles', 'buns', 'wheat'],
        fats: ['avocado', 'nuts', 'seeds', 'olive oil', 'cheese'],
        vegetables: ['salad', 'broccoli', 'spinach', 'carrots', 'peppers', 'onions', 'green beans', 'zucchini'],
        fruits: ['apple', 'banana', 'berries', 'orange', 'grapes']
    };
}

function analyzeDay(mealData) {
    const allFoods = [mealData.breakfast.food, mealData.lunch.food, mealData.dinner.food, ...mealData.snacks.map(s => s.food)].join(' ').toLowerCase();
    const keywords = getFoodKeywords();
    let macroCounts = { protein: 0, carbs: 0, fats: 0, vegetables: 0, fruits: 0 };
    for (const macro in keywords) {
        for (const keyword of keywords[macro]) {
            if (allFoods.includes(keyword)) macroCounts[macro]++;
        }
    }
    return macroCounts;
}

function generatePersonalizedSuggestions(history) {
    if (history.length < 3) return [getTranslation("suggestion_keepLogging")];
    
    const suggestions = new Set();
    const allFoods = [];
    let energizedMeals = [];

    history.forEach(day => {
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            const meal = day[mealType];
            if (meal.food) {
                allFoods.push(meal.food.toLowerCase());
                if (meal.mood === 'energized') energizedMeals.push({ meal: meal.food.toLowerCase(), type: mealType });
            }
        });
    });

    if (energizedMeals.length > 0) {
        const favoriteEnergizingMeal = energizedMeals.reduce((a, b) => (energizedMeals.filter(v => v.meal === a.meal).length >= energizedMeals.filter(v => v.meal === b.meal).length) ? a : b);
        if (favoriteEnergizingMeal) {
            suggestions.add(getTranslation("suggestion_energized", { meal: favoriteEnergizingMeal.meal, type: getTranslation(favoriteEnergizingMeal.type) }));
        }
    }

    const foodVariety = new Set(allFoods).size;
    if (allFoods.length > 5 && foodVariety / allFoods.length < 0.5) {
        suggestions.add(getTranslation("suggestion_routine"));
    }

    const todayLog = history.reduce((latest, current) => new Date(current.date) > new Date(latest.date) ? current : latest);
    if (todayLog.waterIntake < 6) {
        suggestions.add(getTranslation("suggestion_water", { waterIntake: todayLog.waterIntake || 0 }));
    }

    if (todayLog.dinner.time) {
        const dinnerHour = parseInt(todayLog.dinner.time.split(':')[0], 10);
        if (dinnerHour >= 21) suggestions.add(getTranslation("suggestion_lateDinner"));
    }

    return suggestions.size > 0 ? Array.from(suggestions) : [getTranslation("suggestion_balanced")];
}

function displayCommunityTip(suggestions, tips) {
    const tipContainer = document.getElementById('community-tip-container');
    const tipText = document.getElementById('community-tip-text');
    let relevantTips = [];
    const keywords = getFoodKeywords();

    suggestions.forEach(suggestion => {
        if (suggestion.includes(keywords.protein[0])) relevantTips.push(...(tips.protein || []));
        if (suggestion.includes(keywords.vegetables[0])) relevantTips.push(...(tips.vegetables || []));
        if (suggestion.includes(getTranslation('history_water').toLowerCase())) relevantTips.push(...(tips.water || []));
    });

    if (relevantTips.length === 0) relevantTips = tips.general || [];
    
    if (relevantTips.length > 0) {
        tipText.textContent = relevantTips[Math.floor(Math.random() * relevantTips.length)];
        tipContainer.classList.remove('hidden');
    } else {
        tipContainer.classList.add('hidden');
    }
}

function displayDailyAnalysis(suggestions, tips) {
    const suggestionsEl = document.getElementById('suggestions');
    suggestionsEl.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsEl.innerHTML = `<li>${getTranslation("suggestion_balanced")}</li>`;
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
        if (day.lunch.time) summary.mealTimes.lunch.push(day.lunch.time);
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
            if (day[mealType].mood === 'energized') summary.energizedMeals++;
            if (day[mealType].mood === 'sluggish') summary.sluggishMeals++;
        });
    });
    const calculateTimeConsistency = (times) => {
        if (times.length < 2) return 100;
        const timeInMinutes = times.map(t => {
            const [hours, minutes] = t.split(':').map(Number);
            return hours * 60 + minutes;
        });
        const averageTime = timeInMinutes.reduce((a, b) => a + b, 0) / timeInMinutes.length;
        const variance = timeInMinutes.reduce((a, b) => a + Math.pow(b - averageTime, 2), 0) / timeInMinutes.length;
        const stdDev = Math.sqrt(variance);
        return Math.max(0, 100 - (stdDev / 60) * 50);
    };
    const breakfastConsistency = calculateTimeConsistency(summary.mealTimes.breakfast);
    const lunchConsistency = calculateTimeConsistency(summary.mealTimes.lunch);
    const dinnerConsistency = calculateTimeConsistency(summary.mealTimes.dinner);
    summary.rhythmScore = Math.round((breakfastConsistency + lunchConsistency + dinnerConsistency) / 3);
    return summary;
}

function displayWeeklySummary(summary) {
    const summaryEl = document.getElementById('weekly-summary');
    let rhythmExplanation;
    if (summary.rhythmScore > 80) {
        rhythmExplanation = getTranslation('summary_rhythm_great');
    } else if (summary.rhythmScore > 60) {
        rhythmExplanation = getTranslation('summary_rhythm_good');
    } else {
        rhythmExplanation = getTranslation('summary_rhythm_improvement');
    }

    summaryEl.innerHTML = `
        <div class="summary-metric">
            <span class="metric-value">${summary.rhythmScore}</span>
            <span class="metric-label">${getTranslation('summary_rhythm_score')}</span>
            <p class="metric-explanation">${rhythmExplanation}</p>
        </div>
        <div class="summary-details">
            <p>${getTranslation('summary_overLastDays', { totalDays: summary.totalDays })}</p>
            <ul>
                <li>${getTranslation('summary_lateDinners', { lateDinners: summary.lateDinners })}</li>
                <li>${getTranslation('summary_skippedBreakfasts', { skippedBreakfasts: summary.skippedBreakfasts })}</li>
                <li>${getTranslation('summary_moods', { energizedMeals: summary.energizedMeals, sluggishMeals: summary.sluggishMeals })}</li>
            </ul>
        </div>
    `;
    document.getElementById('weekly-summary-container').classList.remove('hidden');
}

let macroChartInstance = null;
function renderMacroChart(macroData) {
    const ctx = document.getElementById('macro-chart').getContext('2d');
    if (macroChartInstance) macroChartInstance.destroy();
    
    const labels = [
        getTranslation('chart_protein'),
        getTranslation('chart_carbs'),
        getTranslation('chart_fats'),
        getTranslation('chart_vegetables'),
        getTranslation('chart_fruits')
    ];

    macroChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: getTranslation('chart_foodGroups'),
                data: [macroData.protein, macroData.carbs, macroData.fats, macroData.vegetables, macroData.fruits],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: getTranslation('macroChartTitle') }
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
                    alert(getTranslation('couldNotFindNutritionData', { food: meal.food }));
                    meal.nutrition = {};
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(getTranslation('couldNotFetchNutritionData', { food: meal.food, reason: errorData.error || response.statusText }));
            }
        } catch (networkError) {
            console.error('Network error fetching nutrition data:', networkError);
            alert(getTranslation('failedToConnectNutrition'));
        }
    };
    const dataPromises = [
        fetchNutrition(newMealData.breakfast),
        fetchNutrition(newMealData.lunch),
        fetchNutrition(newMealData.dinner),
        ...newMealData.snacks.map(snack => fetchNutrition(snack))
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
        if (analysisSection) analysisSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Failed to save meal data:', error);
        alert(`A critical error occurred while saving. Error: ${error.message}`);
    }
}

async function deleteMeal(id, suppressConfirm = false) {
    if (!suppressConfirm && !confirm(getTranslation('confirmDeleteEntry'))) return;
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
    if (!confirm(getTranslation('confirmClearHistory'))) return;
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
        historyList.innerHTML = `<li>${getTranslation('noMealHistory')}</li>`;
        return;
    }
    history.forEach(meal => {
        const card = document.createElement('li');
        card.className = 'meal-card';
        card.setAttribute('aria-labelledby', `meal-date-${meal.id}`);
        const header = document.createElement('h3');
        header.id = `meal-date-${meal.id}`;
        header.textContent = meal.date;
        const mealInfo = document.createElement('div');
        mealInfo.className = 'meal-info';

        const snacksHtml = (meal.snacks && meal.snacks.length > 0) 
            ? meal.snacks.map(s => `<p><strong>${getTranslation('history_snack')}:</strong> ${s.food}</p>${formatNutrition(s.nutrition)}`).join('') 
            : `<p><strong>${getTranslation('history_snacks')}:</strong> ${getTranslation('history_noSnacks')}</p>`;
        
        mealInfo.innerHTML = `
            <p><strong>${getTranslation('breakfast')}:</strong> ${meal.breakfast.food || 'N/A'} at ${meal.breakfast.time || 'N/A'} (${getTranslation('history_mood')}: ${getTranslation(meal.breakfast.mood) || 'N/A'})</p>${formatNutrition(meal.breakfast.nutrition)}
            <p><strong>${getTranslation('lunch')}:</strong> ${meal.lunch.food || 'N/A'} at ${meal.lunch.time || 'N/A'} (${getTranslation('history_mood')}: ${getTranslation(meal.lunch.mood) || 'N/A'})</p>${formatNutrition(meal.lunch.nutrition)}
            <p><strong>${getTranslation('dinner')}:</strong> ${meal.dinner.food || 'N/A'} at ${meal.dinner.time || 'N/A'} (${getTranslation('history_mood')}: ${getTranslation(meal.dinner.mood) || 'N/A'})</p>${formatNutrition(meal.dinner.nutrition)}
            ${snacksHtml}
            <p><strong>${getTranslation('history_water')}:</strong> ${meal.waterIntake || 0} ${getTranslation('history_glasses')}</p>
        `;
        const actions = document.createElement('div');
        actions.className = 'actions';
        actions.innerHTML = `<button onclick="editMeal(${meal.id})">${getTranslation('edit')}</button><button onclick="deleteMeal(${meal.id})" class="delete">${getTranslation('delete')}</button>`;
        
        card.appendChild(header);
        card.appendChild(mealInfo);
        card.appendChild(actions);
        historyList.appendChild(card);
    });
}

function formatNutrition(nutrition) {
    if (!nutrition || Object.keys(nutrition).length === 0) return '';
    return `<div class="nutrition-details"><p>Calories: ${nutrition.calories || 'N/A'}, Protein: ${nutrition.protein || 'N/A'}g, Fat: ${nutrition.fat || 'N/A'}g, Carbs: ${nutrition.carbs || 'N/A'}g</p></div>`;
}

function checkQuestProgress(history, quests) {
    const progress = { hydrate: 0, earlyBird: 0, rainbow: new Set() };
    const keywords = getFoodKeywords(); // Use translated keywords
    let consecutiveHydrationDays = 0;

    for (const day of history) {
        if (day.waterIntake >= 8) {
            consecutiveHydrationDays++;
        } else {
            consecutiveHydrationDays = 0;
        }
        progress.hydrate = Math.max(progress.hydrate, consecutiveHydrationDays);

        if (day.breakfast.time && new Date(`1970-01-01T${day.breakfast.time}`).getHours() < 9) {
            progress.earlyBird++;
        }

        if (history.indexOf(day) < 7) {
            const allFoods = [day.breakfast.food, day.lunch.food, day.dinner.food, ...day.snacks.map(s => s.food)].join(' ').toLowerCase();
            keywords.vegetables.forEach(veg => { // Check against translated vegetable keywords
                if (allFoods.includes(veg)) progress.rainbow.add(veg);
            });
        }
    }

    return {
        hydrate: progress.hydrate,
        earlyBird: Math.min(progress.earlyBird, quests.earlyBird.goal),
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
        
        // Use translation keys for title and description
        const title = getTranslation(`quest_${key}_title`);
        const description = getTranslation(`quest_${key}_description`);

        html += `
            <div class="quest-card ${percentage === 100 ? 'completed' : ''}">
                <div class="quest-info">
                    <h4>${title} ${percentage === 100 ? '🏆' : ''}</h4>
                    <p>${description}</p>
                </div>
                <div class="quest-progress">
                    <div class="progress-bar-container"><div class="progress-bar" style="width: ${percentage}%;"></div></div>
                    <span>${currentProgress} / ${quest.goal}</span>
                </div>
        </div>
    `;
    }
    questsOutput.innerHTML = html;
    document.getElementById('quests-container').classList.remove('hidden');
}

function generateMuscleRoutine() {
    const routine = {
        title: getTranslation("routineTitle"),
        description: getTranslation("routineDescription"),
        days: [
            { 
                day: getTranslation("pushDay"), 
                exercises: [
                    getTranslation("benchPress"), 
                    getTranslation("overheadPress"), 
                    getTranslation("inclinePress"), 
                    getTranslation("lateralRaises"), 
                    getTranslation("tricepPushdowns")
                ] 
            },
            { 
                day: getTranslation("pullDay"), 
                exercises: [
                    getTranslation("pullUps"), 
                    getTranslation("barbellRows"), 
                    getTranslation("facePulls"), 
                    getTranslation("bicepCurls"), 
                    getTranslation("hammerCurls")
                ] 
            },
            { 
                day: getTranslation("legDay"), 
                exercises: [
                    getTranslation("squats"), 
                    getTranslation("romanianDeadlifts"), 
                    getTranslation("legPress"), 
                    getTranslation("legCurls"), 
                    getTranslation("calfRaises")
                ] 
            }
        ]
    };
    const outputContainer = document.getElementById('routine-output');
    let html = `<h3 id="routine-title">${routine.title}</h3><p>${routine.description}</p>`;
    routine.days.forEach((day, index) => {
        const dayId = `day-${index + 1}`;
        html += `<h4 id="${dayId}">${day.day}</h4><ul aria-labelledby="${dayId}">`;
        day.exercises.forEach(exercise => { html += `<li>${exercise}</li>`; });
        html += `</ul>`;
    });
    outputContainer.innerHTML = html;
    outputContainer.classList.remove('hidden');
    outputContainer.setAttribute('aria-labelledby', 'routine-title');
}

const DIVERSE_MEAL_IDEAS = {
    breakfast: ["mealIdea_Yogurt", "mealIdea_AvocadoToast", "mealIdea_Smoothie", "mealIdea_Pancakes", "mealIdea_Burrito"],
    lunch: ["mealIdea_LentilSoup", "mealIdea_TurkeyWrap", "mealIdea_MasonJarSalad", "mealIdea_LeftoverSalmon", "mealIdea_CapreseSalad"],
    dinner: ["mealIdea_SheetPanChicken", "mealIdea_BlackBeanBurgers", "mealIdea_ShrimpScampi", "mealIdea_VegetableStirFry", "mealIdea_StuffedPeppers"]
};

function createMealPlan(history) {
    if (!history || history.length < 3) return null;
    
    const getFavoriteMeal = (mealType) => {
        const meals = history.map(day => day[mealType]).filter(meal => meal && meal.food && meal.mood === 'energized').map(meal => meal.food.toLowerCase());
        if (meals.length === 0) return null;
        return meals.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length) ? a : b, null);
    };

    const usedMeals = new Set();
    const getUniqueMeal = (mealType, favorite) => {
        let mealKey;
        if (favorite && !usedMeals.has(favorite) && Math.random() < 0.5) {
            // This is tricky because the favorite is a string, not a key. We won't translate favorites for now.
            usedMeals.add(favorite);
            return favorite; 
        } else {
            const mealOptions = DIVERSE_MEAL_IDEAS[mealType];
            do {
                mealKey = mealOptions[Math.floor(Math.random() * mealOptions.length)];
            } while (usedMeals.has(mealKey));
        }
        usedMeals.add(mealKey);
        return getTranslation(mealKey); // Translate the key to a meal string
    };

    const favorites = { breakfast: getFavoriteMeal('breakfast'), lunch: getFavoriteMeal('lunch'), dinner: getFavoriteMeal('dinner') };
    
    return {
        day1: { breakfast: getUniqueMeal('breakfast', favorites.breakfast), lunch: getUniqueMeal('lunch', favorites.lunch), dinner: getUniqueMeal('dinner', favorites.dinner) },
        day2: { breakfast: getUniqueMeal('breakfast', favorites.breakfast), lunch: getUniqueMeal('lunch', favorites.lunch), dinner: getUniqueMeal('dinner', favorites.dinner) },
        day3: { breakfast: getUniqueMeal('breakfast', favorites.breakfast), lunch: getUniqueMeal('lunch', favorites.lunch), dinner: getUniqueMeal('dinner', favorites.dinner) }
    };
}

async function generateMealPlan() {
    const history = await getMealHistory();
    const plan = createMealPlan(history);
    if (!plan) {
        alert(getTranslation('generatePlanAlert'));
        return;
    }
    displayMealPlan(plan);
}

function displayMealPlan(plan) {
    currentMealPlan = plan;
    const planOutput = document.getElementById('meal-plan-output');
    let html = `<h3>${getTranslation('your3DayPlan')}</h3>`;
    const dayKeys = { day1: 'day1', day2: 'day2', day3: 'day3' };

    for (const dayKey in plan) {
        const dayNum = dayKeys[dayKey];
        html += `<div class="meal-plan-day"><h4>${getTranslation(dayNum)}</h4><ul>`;
        for (const mealType in plan[dayKey]) {
            html += `<li><strong>${getTranslation(mealType)}:</strong> ${plan[dayKey][mealType]}</li>`;
        }
        html += '</ul></div>';
    }
    planOutput.innerHTML = html;
    planOutput.classList.remove('hidden');
    document.getElementById('meal-plan-actions').classList.remove('hidden');
}

function exportToGrocery(plan) {
    const ingredients = new Set();
    const keywords = getFoodKeywords();
    const allKeywords = Object.values(keywords).flat();

    Object.values(plan).forEach(day => {
        Object.values(day).forEach(meal => {
            // Since meal plans can be in English even when the UI is Spanish, check both sets of keywords
            const mealWords = meal.toLowerCase().split(' ');
            mealWords.forEach(word => {
                const cleanedWord = word.replace(/,$/, '');
                if (allKeywords.includes(cleanedWord)) {
                    ingredients.add(cleanedWord);
                }
            });
        });
    });
    let fileContent = `${getTranslation('groceryListTitle')}\n\n-------------------------\n\n`;
    if (ingredients.size > 0) {
        fileContent += Array.from(ingredients).map(item => `- ${item.charAt(0).toUpperCase() + item.slice(1)}`).join('\n');
    } else {
        fileContent += getTranslation('noIngredients');
    }
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'grocery-list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function findMealKits(plan) {
    const mainDinner = plan.day1.dinner || "healthy dinner";
    const keywords = getFoodKeywords();
    const allKeywords = Object.values(keywords).flat();
    const searchTerms = mainDinner.toLowerCase().split(' ').filter(word => allKeywords.includes(word.replace(/,$/, '')));
    const searchQuery = searchTerms.length > 0 ? searchTerms.join(' ') : mainDinner;
    const url = `https://www.hellofresh.com/recipes/search?q=${encodeURIComponent(searchQuery)}`;
    alert(getTranslation('searchMealKits', { searchQuery }));
    window.open(url, '_blank');
}

function exportHistory() {
    if (mealHistoryCache.length === 0) {
        alert(getTranslation('noHistoryToExport'));
        return;
    }
    const dataStr = JSON.stringify(mealHistoryCache, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'meal-history.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

function importHistory(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedHistory = JSON.parse(e.target.result);
            if (!Array.isArray(importedHistory)) {
                throw new Error("Invalid format");
            }
            // Simple validation of the first object
            if (importedHistory.length > 0) {
                const firstItem = importedHistory[0];
                if (!firstItem.id || !firstItem.date || !firstItem.breakfast) {
                     throw new Error("Invalid format: Missing required fields.");
                }
            }
            
            if (!confirm(getTranslation('confirmImport'))) return;

            // Clear existing history on the backend
            await Promise.all(mealHistoryCache.map(meal => deleteMeal(meal.id, true)));
            
            // Post new items
            for (const meal of importedHistory) {
                 // Remove nutrition and image data to force refetch
                ['breakfast', 'lunch', 'dinner'].forEach(m => {
                    if(meal[m]) {
                        delete meal[m].nutrition;
                        delete meal[m].imageUrl;
                    }
                });
                if (meal.snacks) {
                    meal.snacks.forEach(s => delete s.nutrition);
                }
               
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...meal, id: Date.now() + Math.random() }) // Ensure unique IDs
                });
            }
            
            await loadHistory();
            alert(getTranslation('importSuccess'));

        } catch (error) {
            console.error('Failed to import history:', error);
            alert(`${getTranslation('importError')}: ${error.message}`);
        }
    };
    reader.readAsText(file);
}

window.addEventListener('load', () => {
    if (typeof axe !== 'undefined') {
        axe.run(document.body, (err, results) => {
            if (err) console.error('Accessibility test error:', err);
            if (results.violations.length === 0) {
                console.log('Accessibility test passed!');
            } else {
                console.warn(`Accessibility issues found (${results.violations.length}):`);
                console.table(results.violations);
            }
        });
    }
});
