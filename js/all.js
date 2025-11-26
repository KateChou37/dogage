const birthdayInput = document.getElementById('birthday');
const calculateBtn = document.getElementById('calculate-btn');
const resultContainer = document.getElementById('result-container');
const dogAgeDisplay = document.getElementById('dog-age');
const humanAgeDisplay = document.getElementById('human-age');
const storageStatus = document.getElementById('storage-status');

const STORAGE_KEY = 'dogAgeCalculatorResult';

// --- 年齡計算邏輯 ---
function calculateDogAge(dogYears) {
    // 狗狗實際年齡 (dogYears)
    if (dogYears < 1) {
        // 小於一歲線性近似
        return (dogYears * 15).toFixed(1);
    } else if (dogYears < 2) {
        // 第一年: 每月約 1.25 歲
        return (dogYears * 15).toFixed(1);
    } else {
        // 前兩年 24 歲 (15 + 9)，之後每年加 4 歲
        const humanAge = 24 + (dogYears - 2) * 4;
        return humanAge.toFixed(1);
    }
}

function calculateAge() {
    const birthdayValue = birthdayInput.value;
    if (!birthdayValue) {
        alert('請先選擇狗狗的生日！');
        return;
    }

    const birthDate = new Date(birthdayValue);
    const today = new Date();
    
    // 計算毫秒差
    const diffTime = Math.abs(today - birthDate);
    // 轉換為年 (使用 365.25 天考量閏年)
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    
    // 狗狗實際年齡 (保留兩位小數)
    const dogAge = diffYears.toFixed(2);
    // 換算人類年齡 (保留一位小數)
    const humanAge = calculateDogAge(diffYears);

    // 顯示結果
    dogAgeDisplay.textContent = dogAge;
    humanAgeDisplay.textContent = humanAge;
    resultContainer.classList.remove('hidden');
    storageStatus.classList.add('hidden'); // 新計算後隱藏載入提示

    // 儲存到 Local Storage
    saveToLocalStorage(dogAge, humanAge);
}

// --- Local Storage 函式 ---
function saveToLocalStorage(dogAge, humanAge) {
    const result = {
        dogAge: dogAge,
        humanAge: humanAge,
        birthday: birthdayInput.value // 儲存輸入的日期
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
        console.error("無法使用 Local Storage:", e);
    }
}

function loadFromLocalStorage() {
    try {
        const storedResult = localStorage.getItem(STORAGE_KEY);
        if (storedResult) {
            const data = JSON.parse(storedResult);
            
            // 載入上次的生日輸入
            if (data.birthday) {
                birthdayInput.value = data.birthday;
            }

            // 顯示上次的計算結果
            dogAgeDisplay.textContent = data.dogAge;
            humanAgeDisplay.textContent = data.humanAge;
            resultContainer.classList.remove('hidden');
            
            // 顯示載入狀態提示
            storageStatus.classList.remove('hidden');
        }
    } catch (e) {
        console.error("載入 Local Storage 失敗:", e);
    }
}


// --- 事件監聽與初始化 ---
calculateBtn.addEventListener('click', calculateAge);

// 頁面載入時，自動載入上次的計算結果
window.addEventListener('load', loadFromLocalStorage);