const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const customerIdInput = document.getElementById('customerId');
const nameInput = document.getElementById('name');
const submitBtn = document.getElementById('submit');
const clearBtn = document.getElementById('clear');
const savedBtn = document.getElementById('saved');

loadInputsFromLocalStorage();

// Получаем активную вкладку
async function getCurrentTab() {
    const queryOptions = { active: true, currentWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

// Вставка данных в поля
function pasteData(login, password) {
    const inputs = document.querySelectorAll("input");

    for (const input of inputs) {
        if (input.type === 'text') {
            input.value = login;
        } else if (input.type === 'password') {
            input.value = password;
        }

        // Инициируем событие input для каждого поля
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        input.dispatchEvent(event);
    }

    document.querySelector("button[type='submit']").click();
}

// Получаем данные из полей расширения
async function getData() {
    const tab = await getCurrentTab();

    const login = loginInput.value;
    const password = passwordInput.value + customerIdInput.value;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: pasteData,
        args: [login, password]
    });
}

// Сохраняем данные в localStorage
function saveInputsToLocalStorage() {

    const inputData = {
        login: loginInput.value,
        password: passwordInput.value,
        customerId: customerIdInput.value
    };

    localStorage.setItem('inputData', JSON.stringify(inputData));
}

// Функция, которая будет вызывать метод getData() при нажатии клавиши Enter
function handleEnterPress(event) {
    if (event.key === 'Enter') {
        getData();
    }
}

// Функция, которая будет загружать данные из локального хранилища и подставлять их в поля ввода
function loadInputsFromLocalStorage() {
    const storedData = localStorage.getItem('inputData');
    const storedAccounts = localStorage.getItem('accounts');

    if (storedData) {
        const inputData = JSON.parse(storedData);

        loginInput.value = inputData.login;
        passwordInput.value = inputData.password;
        customerIdInput.value = inputData.customerId;
    }

    if (storedAccounts) {
        const accounts = JSON.parse(storedAccounts);
        renderAccounts(accounts);
        console.log(accounts)
    }
}

function renderAccounts(accounts) {
    const form = document.getElementById('login-form');
    const currentUl = document.querySelector('ul');
    if (currentUl) {
        currentUl.remove();
    }

    let ul = document.createElement('ul');
    ul.innerHTML = `
        ${accounts.map(account => `
            <li id="${account.customerId}">${account.name} (id-${account.customerId})
                <span class="remove" data-id="${account.customerId}">ㅤX</span>
            </li>
        `).join('')}
    `
    form.after(ul);

    // Добавление обработчика событий к каждому элементу span.remove
    document.querySelectorAll('.remove').forEach(span => {
        span.addEventListener('click', function() {
            const idToRemove = this.getAttribute('data-id');

            accounts = accounts.filter(account => account.customerId !== idToRemove);

            localStorage.setItem('accounts', JSON.stringify(accounts));

            // Перерисовка списка аккаунтов
            renderAccounts(accounts);
        });
    });
}

// Очистка куки и сессии
function clearCash() {
    // Очищаем куки
    chrome.cookies.getAll({ domain: 'posiflora.com' }, function(cookies) {
        cookies.forEach(function(cookie) {
            chrome.cookies.remove({ url: "https://" + cookie.domain + cookie.path, name: cookie.name });
        });
    });

    // Очищаем sessionStorage
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: function() {
                sessionStorage.clear();
            }
        });
    });

    // Очищаем localStorage
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: function() {
                localStorage.clear();
            }
        });
    });

    // Очищаем кэш
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.browsingData.remove({
            "since": 0
        }, {
            "appcache": true,
            "cache": true
        }, function() {
            console.log("Cache cleared");
        });
    });

    // После выполнения всех операций вы можете обновить страницу, чтобы увидеть эффекты очистки
    chrome.tabs.reload();
}

function saveAccToLocalStorage() {

    if (!nameInput.value) {
        return;
    }

    const accData = {
        login: loginInput.value,
        password: passwordInput.value,
        customerId: customerIdInput.value,
        name: nameInput.value
    };

    const storedAccounts = JSON.parse(localStorage.getItem('accounts'));
    if (storedAccounts) {
        storedAccounts.push(accData);
        localStorage.setItem('accounts', JSON.stringify(storedAccounts));
    } else {
        localStorage.setItem('accounts', JSON.stringify([accData]));
    }

    loadInputsFromLocalStorage();
}

savedBtn.addEventListener('click', saveAccToLocalStorage);
submitBtn.addEventListener('click', getData);
clearBtn.addEventListener('click', clearCash);
loginInput.addEventListener('input', saveInputsToLocalStorage);
passwordInput.addEventListener('input', saveInputsToLocalStorage);
customerIdInput.addEventListener('input', saveInputsToLocalStorage);
loginInput.addEventListener('keydown', handleEnterPress);
passwordInput.addEventListener('keydown', handleEnterPress);
customerIdInput.addEventListener('keydown', handleEnterPress);
