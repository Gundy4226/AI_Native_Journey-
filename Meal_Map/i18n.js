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
      "searchMealKits": "Searching for meal kits related to \"{searchQuery}\"...\n(You will be redirected to an external site)"
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
      "searchMealKits": "Buscando kits de comida relacionados con \"{searchQuery}\"...\n(Serás redirigido a un sitio externo)"
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
