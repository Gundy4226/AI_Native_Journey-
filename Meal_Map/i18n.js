// i18n.js

const ALL_TRANSLATIONS = {
    "en": {
      "title": "Meal Map",
      "logYourDailyIntake": "Log Your Daily Intake",
      "waterIntake": "Water Intake (glasses)",
      "waterIntakePlaceholder": "e.g., 8",
      "breakfast": "Breakfast",
      "breakfastPlaceholder": "e.g., Oatmeal with berries",
      "lunch": "Lunch",
      "lunchPlaceholder": "e.g., Grilled chicken salad",
      "dinner": "Dinner",
      "dinnerPlaceholder": "e.g., Salmon with roasted vegetables",
      "snacks": "Snacks",
      "addSnack": "+ Add Snack",
      "analyzeMyDay": "Analyze My Day",
      "todaysAnalysis": "Today's Analysis",
      "suggestionsForImprovement": "Suggestions for Improvement:",
      "communityTip": "💡 Community Tip",
      "dataVisualized": "Data Visualized",
      "macroChartTitle": "Today's Food Group Distribution",
      "yourWeekAtAGlance": "Your Week at a Glance",
      "workoutRoutine": "Workout Routine",
      "generateMuscleBuildingRoutine": "Generate Muscle-Building Routine",
      "mealPlanGenerator": "Meal Plan Generator",
      "generate3DayMealPlan": "Generate a 3-Day Meal Plan",
      "exportToGroceryList": "Export to Grocery List",
      "findMealKits": "Find Meal Kits",
      "wellnessQuests": "Wellness Quests",
      "mealHistory": "Meal History",
      "import": "Import",
      "export": "Export",
      "clearAll": "Clear All",
      "selectATime": "Select a time",
      "howDidItFeel": "How did it feel?",
      "energized": "Energized",
      "satisfied": "Satisfied",
      "sluggish": "Sluggish",
      "noMealHistory": "No meal history yet.",
      "edit": "Edit",
      "delete": "Delete",
      "logMealAlert": "Please log at least one meal or snack.",
      "generatePlanAlert": "Please log at least 3 days of meals to generate a personalized plan.",
      "confirmClearHistory": "Are you sure you want to delete ALL entries? This cannot be undone.",
      "confirmDeleteEntry": "Are you sure you want to delete this entry?",
      "importDisabled": "Import is disabled in server mode.",
      "searchMealKits": "Searching for meal kits related to \"{searchQuery}\"...\n(You will be redirected to an external site)",
      "noHistoryToExport": "There is no history to export.",
      "confirmImport": "This will clear your current history and replace it with the imported data. Are you sure?",
      "importSuccess": "History imported successfully!",
      "importError": "Failed to import history",
      "routineTitle": "3-Day Muscle-Building Split (Push/Pull/Legs)",
      "routineDescription": "This routine is designed to maximize muscle growth by targeting all major muscle groups over three days. Rest for 60-90 seconds between sets. Aim for progressive overload by increasing weight or reps over time.",
      "pushDay": "Day 1: Push (Chest, Shoulders, Triceps)",
      "pullDay": "Day 2: Pull (Back, Biceps)",
      "legDay": "Day 3: Legs (Quads, Hamstrings, Calves)",
      "benchPress": "Bench Press: 3 sets of 5-8 reps",
      "overheadPress": "Overhead Press: 3 sets of 8-12 reps",
      "inclinePress": "Incline Dumbbell Press: 3 sets of 8-12 reps",
      "lateralRaises": "Lateral Raises: 3 sets of 12-15 reps",
      "tricepPushdowns": "Tricep Pushdowns: 3 sets of 10-15 reps",
      "pullUps": "Pull-Ups or Lat Pulldowns: 3 sets of 8-12 reps",
      "barbellRows": "Barbell Rows: 3 sets of 8-12 reps",
      "facePulls": "Face Pulls: 3 sets of 15-20 reps",
      "bicepCurls": "Bicep Curls: 3 sets of 10-15 reps",
      "hammerCurls": "Hammer Curls: 3 sets of 10-15 reps",
      "squats": "Squats: 3 sets of 5-8 reps",
      "romanianDeadlifts": "Romanian Deadlifts: 3 sets of 8-12 reps",
      "legPress": "Leg Press: 3 sets of 10-15 reps",
      "legCurls": "Leg Curls: 3 sets of 12-15 reps",
      "calfRaises": "Calf Raises: 4 sets of 15-20 reps",
      "couldNotFindNutritionData": "Could not find nutrition data for \"{food}\".",
      "couldNotFetchNutritionData": "Could not fetch nutrition data for \"{food}\". Reason: {reason}",
      "failedToConnectNutrition": "Failed to connect to the backend server for nutrition data.",
      "your3DayPlan": "Your 3-Day Plan",
      "day1": "Day 1",
      "day2": "Day 2",
      "day3": "Day 3",
      "mealIdea_Yogurt": "Greek Yogurt with Honey and Nuts",
      "mealIdea_AvocadoToast": "Avocado Toast with a Poached Egg",
      "mealIdea_Smoothie": "Smoothie with Spinach, Banana, and Protein Powder",
      "mealIdea_Pancakes": "Whole Wheat Pancakes with Berries",
      "mealIdea_Burrito": "Breakfast Burrito with Black Beans and Salsa",
      "mealIdea_LentilSoup": "Lentil Soup with a side of Whole Wheat Bread",
      "mealIdea_TurkeyWrap": "Turkey and Avocado Wrap",
      "mealIdea_MasonJarSalad": "Mason Jar Salad with Chickpeas and a Vinaigrette",
      "mealIdea_LeftoverSalmon": "Leftover Salmon with Roasted Asparagus",
      "mealIdea_CapreseSalad": "Caprese Salad with Fresh Mozzarella, Tomatoes, and Basil",
      "mealIdea_SheetPanChicken": "Sheet Pan Lemon Herb Chicken with Potatoes and Green Beans",
      "mealIdea_BlackBeanBurgers": "Black Bean Burgers on Whole Wheat Buns",
      "mealIdea_ShrimpScampi": "Shrimp Scampi with Zucchini Noodles",
      "mealIdea_VegetableStirFry": "Vegetable Stir-fry with Tofu and Brown Rice",
      "mealIdea_StuffedPeppers": "Stuffed Bell Peppers with Quinoa and Ground Turkey",
      "groceryListTitle": "Your Meal Map Grocery List",
      "noIngredients": "No specific ingredients found in your meal plan.",
      "quest_hydrate_title": "Hydration Hero",
      "quest_hydrate_description": "Log 8+ glasses of water for 3 days in a row.",
      "quest_earlyBird_title": "Early Bird",
      "quest_earlyBird_description": "Eat breakfast before 9 AM for 3 days.",
      "quest_rainbow_title": "Eat the Rainbow",
      "quest_rainbow_description": "Log at least 4 different vegetables in one week.",
      "suggestion_keepLogging": "Keep logging for a few more days to unlock personalized suggestions!",
      "suggestion_energized": "You often feel energized after eating {meal}. Consider having it for {type} again soon!",
      "suggestion_routine": "You have a consistent routine. Try introducing a new vegetable or protein this week to diversify your nutrients.",
      "suggestion_water": "You logged {waterIntake} glasses of water today. Aim for at least 6-8 glasses.",
      "suggestion_lateDinner": "Eating dinner late may affect sleep quality. Consider an earlier mealtime.",
      "suggestion_balanced": "Your diet seems balanced today. Keep up the great work!",
      "summary_rhythm_great": "Fantastic! Your meal times are very consistent.",
      "summary_rhythm_good": "Good job. Your meal schedule is fairly regular.",
      "summary_rhythm_improvement": "Try to eat your meals at more consistent times for better energy levels.",
      "summary_rhythm_score": "Meal Rhythm Score",
      "summary_overLastDays": "Over the last {totalDays} days:",
      "summary_lateDinners": "You had a late dinner on <strong>{lateDinners}</strong> day(s).",
      "summary_skippedBreakfasts": "You skipped breakfast on <strong>{skippedBreakfasts}</strong> day(s).",
      "summary_moods": "You felt energized after <strong>{energizedMeals}</strong> meal(s) and sluggish after <strong>{sluggishMeals}</strong>.",
      "chart_protein": "Protein",
      "chart_carbs": "Carbs",
      "chart_fats": "Fats",
      "chart_vegetables": "Vegetables",
      "chart_fruits": "Fruits",
      "chart_foodGroups": "Food Groups",
      "history_snack": "Snack",
      "history_snacks": "Snacks",
      "history_noSnacks": "None",
      "history_mood": "Mood",
      "history_water": "Water",
      "history_glasses": "glasses"
    },
    "es": {
      "title": "Mapa de Comidas",
      "logYourDailyIntake": "Registra tu Consumo Diario",
      "waterIntake": "Consumo de Agua (vasos)",
      "waterIntakePlaceholder": "ej., 8",
      "breakfast": "Desayuno",
      "breakfastPlaceholder": "ej., Avena con bayas",
      "lunch": "Almuerzo",
      "lunchPlaceholder": "ej., Ensalada de pollo a la parrilla",
      "dinner": "Cena",
      "dinnerPlaceholder": "ej., Salmón con verduras asadas",
      "snacks": "Aperitivos",
      "addSnack": "+ Añadir Aperitivo",
      "analyzeMyDay": "Analizar mi Día",
      "todaysAnalysis": "Análisis de Hoy",
      "suggestionsForImprovement": "Sugerencias para Mejorar:",
      "communityTip": "💡 Consejo de la Comunidad",
      "dataVisualized": "Visualización de Datos",
      "macroChartTitle": "Distribución de Grupos de Alimentos de Hoy",
      "yourWeekAtAGlance": "Tu Semana de un Vistazo",
      "workoutRoutine": "Rutina de Ejercicios",
      "generateMuscleBuildingRoutine": "Generar Rutina para Desarrollar Músculo",
      "mealPlanGenerator": "Generador de Plan de Comidas",
      "generate3DayMealPlan": "Generar un Plan de Comidas de 3 Días",
      "exportToGroceryList": "Exportar a la Lista de Compras",
      "findMealKits": "Buscar Kits de Comida",
      "wellnessQuests": "Misiones de Bienestar",
      "mealHistory": "Historial de Comidas",
      "import": "Importar",
      "export": "Exportar",
      "clearAll": "Limpiar Todo",
      "selectATime": "Selecciona una hora",
      "howDidItFeel": "¿Cómo te sentiste?",
      "energized": "Energizado",
      "satisfied": "Satisfecho",
      "sluggish": "Lento",
      "noMealHistory": "Aún no hay historial de comidas.",
      "edit": "Editar",
      "delete": "Eliminar",
      "logMealAlert": "Por favor, registra al menos una comida o aperitivo.",
      "generatePlanAlert": "Por favor, registra al menos 3 días de comidas para generar un plan personalizado.",
      "confirmClearHistory": "¿Estás seguro de que quieres eliminar TODAS las entradas? Esto no se puede deshacer.",
      "confirmDeleteEntry": "¿Estás seguro de que quieres eliminar esta entrada?",
      "importDisabled": "La importación está deshabilitada en el modo de servidor.",
      "searchMealKits": "Buscando kits de comida relacionados con \"{searchQuery}\"...\n(Serás redirigido a un sitio externo)",
      "noHistoryToExport": "No hay historial para exportar.",
      "confirmImport": "Esto borrará tu historial actual y lo reemplazará con los datos importados. ¿Estás seguro?",
      "importSuccess": "¡Historial importado con éxito!",
      "importError": "Error al importar el historial",
      "routineTitle": "División de 3 Días para Desarrollar Músculo (Empuje/Tirón/Piernas)",
      "routineDescription": "Esta rutina está diseñada para maximizar el crecimiento muscular al enfocarse en todos los grupos musculares principales durante tres días. Descansa de 60 a 90 segundos entre series. Busca la sobrecarga progresiva aumentando el peso o las repeticiones con el tiempo.",
      "pushDay": "Día 1: Empuje (Pecho, Hombros, Tríceps)",
      "pullDay": "Día 2: Tirón (Espalda, Bíceps)",
      "legDay": "Día 3: Piernas (Cuádriceps, Isquiotibiales, Pantorrillas)",
      "benchPress": "Press de Banca: 3 series de 5-8 repeticiones",
      "overheadPress": "Press Militar: 3 series de 8-12 repeticiones",
      "inclinePress": "Press Inclinado con Mancuernas: 3 series de 8-12 repeticiones",
      "lateralRaises": "Elevaciones Laterales: 3 series de 12-15 repeticiones",
      "tricepPushdowns": "Extensiones de Tríceps: 3 series de 10-15 repeticiones",
      "pullUps": "Dominadas o Jalones al Pecho: 3 series de 8-12 repeticiones",
      "barbellRows": "Remo con Barra: 3 series de 8-12 repeticiones",
      "facePulls": "Face Pulls: 3 series de 15-20 repeticiones",
      "bicepCurls": "Curls de Bíceps: 3 series de 10-15 repeticiones",
      "hammerCurls": "Curls de Martillo: 3 series de 10-15 repeticiones",
      "squats": "Sentadillas: 3 series de 5-8 repeticiones",
      "romanianDeadlifts": "Peso Muerto Rumano: 3 series de 8-12 repeticiones",
      "legPress": "Prensa de Piernas: 3 series de 10-15 repeticiones",
      "legCurls": "Curls de Piernas: 3 series de 12-15 repeticiones",
      "calfRaises": "Elevaciones de Pantorrillas: 4 series de 15-20 repeticiones",
      "couldNotFindNutritionData": "No se pudieron encontrar datos de nutrición para \"{food}\".",
      "couldNotFetchNutritionData": "No se pudieron obtener los datos de nutrición para \"{food}\". Razón: {reason}",
      "failedToConnectNutrition": "No se pudo conectar al servidor backend para los datos de nutrición.",
      "your3DayPlan": "Tu Plan de 3 Días",
      "day1": "Día 1",
      "day2": "Día 2",
      "day3": "Día 3",
      "mealIdea_Yogurt": "Yogur Griego con Miel y Nueces",
      "mealIdea_AvocadoToast": "Tostada de Aguacate con Huevo Escalfado",
      "mealIdea_Smoothie": "Batido con Espinacas, Plátano y Proteína en Polvo",
      "mealIdea_Pancakes": "Panqueques de Trigo Integral con Bayas",
      "mealIdea_Burrito": "Burrito de Desayuno con Frijoles Negros y Salsa",
      "mealIdea_LentilSoup": "Sopa de Lentejas con una guarnición de Pan de Trigo Integral",
      "mealIdea_TurkeyWrap": "Wrap de Pavo y Aguacate",
      "mealIdea_MasonJarSalad": "Ensalada en Frasco con Garbanzos y Vinagreta",
      "mealIdea_LeftoverSalmon": "Salmón sobrante con Espárragos Asados",
      "mealIdea_CapreseSalad": "Ensalada Caprese con Mozzarella Fresca, Tomates y Albahaca",
      "mealIdea_SheetPanChicken": "Pollo al Limón y Hierbas en una Sola Bandeja con Papas y Judías Verdes",
      "mealIdea_BlackBeanBurgers": "Hamburguesas de Frijoles Negros en Panes de Trigo Integral",
      "mealIdea_ShrimpScampi": "Gambas al Ajillo con Fideos de Calabacín",
      "mealIdea_VegetableStirFry": "Salteado de Verduras con Tofu y Arroz Integral",
      "mealIdea_StuffedPeppers": "Pimientos Rellenos con Quinoa y Pavo Molido",
      "groceryListTitle": "Tu Lista de Compras de Meal Map",
      "noIngredients": "No se encontraron ingredientes específicos en tu plan de comidas.",
      "quest_hydrate_title": "Héroe de la Hidratación",
      "quest_hydrate_description": "Registra 8+ vasos de agua durante 3 días seguidos.",
      "quest_earlyBird_title": "Pájaro Madrugador",
      "quest_earlyBird_description": "Desayuna antes de las 9 AM durante 3 días.",
      "quest_rainbow_title": "Come el Arcoíris",
      "quest_rainbow_description": "Registra al menos 4 verduras diferentes en una semana.",
      "suggestion_keepLogging": "¡Sigue registrando durante unos días más para desbloquear sugerencias personalizadas!",
      "suggestion_energized": "A menudo te sientes con energía después de comer {meal}. ¡Considera volver a tenerlo para {type} pronto!",
      "suggestion_routine": "Tienes una rutina constante. Intenta introducir una nueva verdura o proteína esta semana para diversificar tus nutrientes.",
      "suggestion_water": "Registraste {waterIntake} vasos de agua hoy. Intenta beber al menos 6-8 vasos.",
      "suggestion_lateDinner": "Cenar tarde puede afectar la calidad del sueño. Considera una hora de comida más temprana.",
      "suggestion_balanced": "Tu dieta parece equilibrada hoy. ¡Sigue así!",
      "summary_rhythm_great": "¡Fantástico! Tus horarios de comida son muy consistentes.",
      "summary_rhythm_good": "Buen trabajo. Tu horario de comidas es bastante regular.",
      "summary_rhythm_improvement": "Intenta comer tus comidas a horas más consistentes para tener mejores niveles de energía.",
      "summary_rhythm_score": "Puntuación de Ritmo de Comida",
      "summary_overLastDays": "Durante los últimos {totalDays} días:",
      "summary_lateDinners": "Cenaste tarde en <strong>{lateDinners}</strong> día(s).",
      "summary_skippedBreakfasts": "Te saltaste el desayuno en <strong>{skippedBreakfasts}</strong> día(s).",
      "summary_moods": "Te sentiste con energía después de <strong>{energizedMeals}</strong> comida(s) y lento después de <strong>{sluggishMeals}</strong>.",
      "chart_protein": "Proteína",
      "chart_carbs": "Carbohidratos",
      "chart_fats": "Grasas",
      "chart_vegetables": "Verduras",
      "chart_fruits": "Frutas",
      "chart_foodGroups": "Grupos de Alimentos",
      "history_snack": "Aperitivo",
      "history_snacks": "Aperitivos",
      "history_noSnacks": "Ninguno",
      "history_mood": "Ánimo",
      "history_water": "Agua",
      "history_glasses": "vasos"
    }
};

let translations = {};

function setLanguage(lang) {
    translations = ALL_TRANSLATIONS[lang] || ALL_TRANSLATIONS['en'];
    updateContent(lang);
    localStorage.setItem('language', lang);
}

function updateContent(currentLang) {
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });

    if (translations.title) {
        document.title = translations.title;
    }
    
    if (typeof populateMainMealTimes === 'function') {
        populateMainMealTimes();
    }
    
    document.querySelectorAll('#language-switcher button').forEach(button => {
        button.classList.toggle('lang-active', button.getAttribute('data-lang') === currentLang);
    });
}

function getTranslation(key, replacements = {}) {
    let translation = translations[key] || key;
    for (const placeholder in replacements) {
        translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
    }
    return translation;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    const initialLang = savedLang || (['en', 'es'].includes(browserLang) ? browserLang : 'en');
    
    setLanguage(initialLang);

    if (typeof addSnackInput === 'function') {
        const container = document.getElementById('snacks-container');
        if (container && container.innerHTML.trim() === '') {
             addSnackInput();
        }
    }

    const switcher = document.getElementById('language-switcher');
    if(switcher) {
        switcher.addEventListener('click', (event) => {
            if (event.target.matches('[data-lang]')) {
                const lang = event.target.getAttribute('data-lang');
                setLanguage(lang);
            }
        });
    }
});
