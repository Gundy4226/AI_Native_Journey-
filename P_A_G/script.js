// Data for default recommendations and colors based on categorized moods
const affirmationsByMood = {
    general: {
        affirmations: [
            "You are capable of amazing things today.",
            "Your potential is limitless.",
            "Every challenge is an opportunity to grow.",
            "You are resilient and strong.",
            "Believe in your unique journey.",
            "Today is a fresh start, embrace it.",
            "Your dreams are within reach.",
            "You bring light to the world."
        ],
        emoji: '✨',
        recommendation: "Take a moment to appreciate something small today."
    },
    happy: {
        affirmations: [
            "Keep shining your light, you are a joy!",
            "Your happiness is contagious.",
            "Embrace this wonderful feeling!",
            "Today is beautiful because you are in it.",
            "Let your joy inspire others.",
            "You deserve all the good things coming your way."
        ],
        emoji: '😊',
        recommendation: "Share your joy with someone close to you!"
    },
    stressed: {
        affirmations: [
            "Take a deep breath; you've got this.",
            "You are strong enough to overcome anything.",
            "Prioritize your peace and well-being.",
            "Release what you cannot control.",
            "One moment at a time is all you need.",
            "Your inner strength is greater than any challenge."
        ],
        emoji: '😥',
        recommendation: "Try a 5-minute breathing exercise: inhale for 4, hold for 4, exhale for 6."
    },
    motivated: {
        affirmations: [
            "Go out there and conquer your goals!",
            "Your determination will lead to success.",
            "Every step forward, no matter how small, is progress.",
            "Unleash your inner power!",
            "You have the discipline to achieve anything you set your mind to.",
            "Today is an opportunity to build the future you desire."
        ],
        emoji: '🚀',
        recommendation: "Break down your biggest goal into 3 small, actionable steps."
    },
    calm: {
        affirmations: [
            "Find your peace in the present moment.",
            "Let tranquility guide your day.",
            "All is well, and you are safe.",
            "Breathe, and simply be.",
            "Your mind is clear, and your spirit is serene.",
            "Embrace the quiet moments of your day.",
            "Observe your thoughts without judgment, like clouds passing by."
        ],
        emoji: '🧘',
        recommendation: "Spend 10 minutes in quiet reflection or gentle stretching."
    },
    anxious: {
        affirmations: [
            "I am safe and secure. My breath brings calm.",
            "This feeling will pass, just as the waves recede.",
            "I am strong enough to handle this. I can ride this wave.",
            "One gentle breath at a time, I find my center.",
            "I choose peace over worry. My focus is on the present.",
            "My breath is my anchor in this moment, grounding me.",
            "I am in control of my reactions, not my fears.",
            "I am supported and loved, and I release tension with each exhale."
        ],
        emoji: '😬',
        recommendation: "Connect with a loved one or try a grounding exercise: list 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste."
    },
    depressed: {
        affirmations: [
            "This moment will pass, and better days are ahead. Light returns, like the dawn.",
            "You are worthy of love and happiness, just as you are.",
            "Even small steps are progress; honor your journey.",
            "It's okay not to be okay. Allow yourself grace.",
            "Reach out if you need support; you are not alone on this path.",
            "You are valued just as you are, a unique part of the universe.",
            "Light will find its way back into your life, through every open space.",
            "Healing is a process, and you are on your way, guided by inner wisdom."
        ],
        emoji: '😔',
        recommendation: "Reach out to a friend or family member, even for a brief chat."
    },
    mindful: {
        affirmations: [
            "I am present in this moment, calm and centered.",
            "My breath is my guide, flowing freely and peacefully.",
            "I release all tension with each exhale.",
            "I am connected to my inner wisdom and strength.",
            "May I be happy, may I be well, may I be peaceful.",
            "I am grateful for my body and all it does for me.",
            "I flow with the rhythm of life, embracing change.",
            "My mind is still, my spirit is free."
        ],
        emoji: '🧠',
        recommendation: "Practice mindful eating: focus on the taste, texture, and smell of your next meal."
    },
    achy: {
        affirmations: [
            "Listen to your body; it's asking for gentle care.",
            "Release tension with each gentle stretch and breath.",
            "Your body is strong and capable of healing.",
            "Ease and comfort are returning to you now.",
            "Be kind to yourself and allow for rest.",
            "Each moment of stillness brings you closer to comfort."
        ],
        emoji: '😩',
        recommendation: "Try some gentle stretches or a warm bath to soothe your muscles."
    }
};

const moodColors = {
    general: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
    happy: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
    stressed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
    motivated: { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
    calm: { bg: '#CCFBF1', text: '#0D9488', border: '#99F6E4' },
    anxious: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
    depressed: { bg: '#EFF6FF', text: '#1E3A8A', border: '#BFDBFE' },
    mindful: { bg: '#E6FFFA', text: '#2C7A7B', border: '#B2F5EA' },
    achy: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' }
};

const userNameInput = document.getElementById('userNameInput');
const moodSelect = document.getElementById('moodSelect');

const generateAffirmationBtn = document.getElementById('generateAffirmationBtn');
const affirmationOutput = document.getElementById('affirmationOutput');
const actionButtons = document.getElementById('actionButtons');
const copyBtn = document.getElementById('copyBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const resetBtn = document.getElementById('resetBtn');
const recommendationOutput = document.getElementById('recommendationOutput');

const historyList = document.getElementById('historyList');
const favoritesList = document.getElementById('favoritesList');

const supportDogModal = document.getElementById('supportDogModal');
const closeDogModalBtn = document.getElementById('closeDogModalBtn');
const yogaVisualModal = document.getElementById('yogaVisualModal');
const closeYogaModalBtn = document.getElementById('closeYogaModalBtn');
const sunSalutationModal = document.getElementById('sunSalutationModal');
const closeSunSalutationModalBtn = document.getElementById('closeSunSalutationModalBtn');

let currentAffirmation = "";

const MAX_HISTORY_ITEMS = 5;

// --- Local Storage Functions ---
function getStoredFavorites() {
    try {
        const favorites = JSON.parse(localStorage.getItem('affirmationFavorites')) || [];
        return favorites;
    } catch (e) {
        console.error("Error parsing favorites from localStorage", e);
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem('affirmationFavorites', JSON.stringify(favorites));
}

function getStoredHistory() {
     try {
        const history = JSON.parse(localStorage.getItem('affirmationHistory')) || [];
        return history;
    } catch (e) {
        console.error("Error parsing history from localStorage", e);
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem('affirmationHistory', JSON.stringify(history));
}

function renderFavorites() {
    const favorites = getStoredFavorites();
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<li class="text-gray-400">No favorites yet.</li>';
        return;
    }

    favorites.forEach((fav, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${fav.text} <span class="date">${fav.date}</span></span>
            <button class="remove-fav-btn" data-index="${index}">✖</button>
        `;
        favoritesList.appendChild(li);
    });

    favoritesList.querySelectorAll('.remove-fav-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const indexToRemove = parseInt(event.target.dataset.index);
            removeFavorite(indexToRemove);
        });
    });
}

function removeFavorite(index) {
    const favorites = getStoredFavorites();
    favorites.splice(index, 1);
    saveFavorites(favorites);
    renderFavorites();
}

function renderHistory() {
    const history = getStoredHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = '<li class="text-gray-400">No affirmations generated yet.</li>';
        return;
    }

    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.text} <span class="date">${item.date}</span>
        `;
        historyList.appendChild(li);
    });
}

function addAffirmationToHistory(affirmationText) {
    const history = getStoredHistory();
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    history.unshift({ text: affirmationText, date: dateString });

    if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
    }
    saveHistory(history);
    renderHistory();
}

// Consolidated affirmation generation and display logic (no AI, no Mad Libs)
function generateAndDisplayAffirmation() {
    const userName = userNameInput.value.trim();
    const selectedMood = moodSelect.value;
    const moodData = affirmationsByMood[selectedMood];
    const relevantAffirmations = moodData.affirmations || affirmationsByMood.general.affirmations;
    const randomIndex = Math.floor(Math.random() * relevantAffirmations.length);
    let chosenAffirmation = relevantAffirmations[randomIndex];

    if (userName !== "") {
        chosenAffirmation = `${userName}, ${chosenAffirmation}`;
    }
    
    updateAffirmationAndRecommendationDisplay(chosenAffirmation, selectedMood);
}

// Function to update the display
function updateAffirmationAndRecommendationDisplay(affirmationText, selectedMood) {
    const moodInfo = affirmationsByMood[selectedMood] || affirmationsByMood.general;
    const moodEmoji = moodInfo.emoji || '';
    const recommendationText = moodInfo.recommendation || "";

    affirmationOutput.innerHTML = `<span class="emoji">${moodEmoji}</span>${affirmationText}`;
    
    if (recommendationText) {
        recommendationOutput.textContent = `💡 Recommendation: ${recommendationText}`;
    } else {
        recommendationOutput.textContent = "";
    }
    recommendationOutput.classList.remove('hidden');

    currentAffirmation = affirmationText;

    const colors = moodColors[selectedMood] || moodColors.general;
    affirmationOutput.style.backgroundColor = colors.bg;
    affirmationOutput.style.borderColor = colors.border;
    affirmationOutput.style.color = colors.text;

    actionButtons.classList.remove('hidden');
    addAffirmationToHistory(affirmationText);

    // Hide all modals before showing new ones
    hideSupportDogModal();
    hideYogaVisualModal();
    hideSunSalutationModal();

    // Trigger modals based on selected mood
    if (selectedMood === 'depressed' && supportDogModal) {
        showSupportDogModal();
    } else if ((selectedMood === 'anxious' || selectedMood === 'stressed') && sunSalutationModal) {
        showSunSalutationModal();
    } else if ((selectedMood === 'mindful' || selectedMood === 'achy' || selectedMood === 'calm') && yogaVisualModal) {
        showYogaVisualModal();
    }
}


function copyAffirmation() {
    if (currentAffirmation) {
        document.execCommand('copy');
        navigator.clipboard.writeText(currentAffirmation)
            .then(() => {
                messagebox.alert('Affirmation copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                messagebox.alert('Failed to copy affirmation.');
            });
    }
}

function favoriteAffirmation() {
    if (currentAffirmation) {
        const favorites = getStoredFavorites();
        const now = new Date();
        const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const newFavorite = { text: currentAffirmation, date: dateString };

        if (!favorites.some(fav => fav.text === newFavorite.text)) {
            favorites.unshift(newFavorite);
            saveFavorites(favorites);
            renderFavorites();
            messagebox.alert('Affirmation added to favorites!');
        } else {
            messagebox.alert('This affirmation is already in your favorites!');
        }
    }
}

function resetGenerator() {
    userNameInput.value = "";
    moodSelect.value = "general"; // Reset dropdown
    
    affirmationOutput.textContent = "Select a mood and click the button!";
    affirmationOutput.style.backgroundColor = moodColors.general.bg;
    affirmationOutput.style.borderColor = moodColors.general.border;
    affirmationOutput.style.color = moodColors.general.text;

    actionButtons.classList.add('hidden');
    recommendationOutput.classList.add('hidden');
    currentAffirmation = "";

    // Hide all modals on reset
    hideSupportDogModal();
    hideYogaVisualModal();
    hideSunSalutationModal();
}

const messagebox = {
    alert: function(message) {
        const existingAlert = document.querySelector('.custom-message-box');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = 'custom-message-box';
        alertDiv.textContent = message;

        document.body.appendChild(alertDiv);

        alertDiv.offsetHeight; 

        alertDiv.classList.add('show');

        setTimeout(() => {
            alertDiv.classList.remove('show');
            alertDiv.addEventListener('transitionend', () => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, { once: true });
        }, 3000);
    }
};

// --- Modal Functions ---
function showSupportDogModal() {
    if (supportDogModal) supportDogModal.classList.add('show');
}

function hideSupportDogModal() {
    if (supportDogModal) supportDogModal.classList.remove('show');
}

function showYogaVisualModal() {
    if (yogaVisualModal) yogaVisualModal.classList.add('show');
}

function hideYogaVisualModal() {
    if (yogaVisualModal) yogaVisualModal.classList.remove('show');
}

function showSunSalutationModal() {
    if (sunSalutationModal) sunSalutationModal.classList.add('show');
}

function hideSunSalutationModal() {
    if (sunSalutationModal) sunSalutationModal.classList.remove('show');
}

// --- Event Listeners ---
generateAffirmationBtn.addEventListener('click', generateAndDisplayAffirmation);

copyBtn.addEventListener('click', copyAffirmation);
favoriteBtn.addEventListener('click', favoriteAffirmation);
resetBtn.addEventListener('click', resetGenerator);

// Existing modal event listeners with checks
if (closeDogModalBtn) closeDogModalBtn.addEventListener('click', hideSupportDogModal);
if (supportDogModal) supportDogModal.addEventListener('click', (event) => {
    if (event.target === supportDogModal) {
        hideSupportDogModal();
    }
});

if (closeYogaModalBtn) closeYogaModalBtn.addEventListener('click', hideYogaVisualModal);
if (yogaVisualModal) yogaVisualModal.addEventListener('click', (event) => {
    if (event.target === yogaVisualModal) {
        hideYogaVisualModal();
    }
});

if (closeSunSalutationModalBtn) closeSunSalutationModalBtn.addEventListener('click', hideSunSalutationModal);
if (sunSalutationModal) sunSalutationModal.addEventListener('click', (event) => {
    if (event.target === sunSalutationModal) {
        hideSunSalutationModal();
    }
});

userNameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        generateAndDisplayAffirmation();
    }
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
    renderHistory();
    affirmationOutput.style.backgroundColor = moodColors.general.bg;
    affirmationOutput.style.borderColor = moodColors.general.border;
    affirmationOutput.style.color = moodColors.general.text;
    document.getElementById('background-image-div').style.backgroundImage = "url('https://images.pexels.com/photos/1769395/pexels-photo-1769395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')";
});
