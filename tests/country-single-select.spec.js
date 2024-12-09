import { test, expect } from '@playwright/test';

// Зададим константы для нашего теста

const URL = 'https://appmagic.rocks/top-charts/apps';
const testCountryName = 'Algeria';

// Для отделения данных и логики напишем класс для нашего CountrySingleSelect

class CountrySingleSelect {

    // Инициализируем классу контекст

    constructor(page) {
        this.page = page;
    }

    // Метод ниже возвращает нам объект с аттрибутами, по которым мы будем находить необходимые нам элементы в DOM
    // Ключи объекта - название элемента, который мы ищем на странице

    attr() {
        return {
            selector: 'country-single-select span:nth-child(2)',
            input: 'input[placeholder="Start typing country name..."]',
            choose: `button .text-overflow:text("${testCountryName}")`,
            panel: 'country-single-select-panel',
            clearInputIcon: 'selector-search div:nth-child(1)',
        };
    }

    // Метод getLocator принимает название ключа и по нему находит возвращает элемент на странице, используя объект метода attr()

    getLocator(selectorKey) {
        return this.page.locator(this.attr()[selectorKey]);
    }
}

// Ниже описан сценарий представленный в тестовом задании.
// Исходя из задач и возможности их перестановки, я сократил его до минимума

// Логику в виде кликов и заполнений, скринов оставил в тесте, так как это хорошо читается и не нагромождает код.
// Expect написал только на проверку количества символов, как указано в ТЗ.
// Возможно - неправильно понял - напишите, и я реализую экспекты на каждый шаг.

test('Country Selector Test', async ({ page }) => {

    // Открываем страницу по URL
    await page.goto(URL);

    // Присваиваем переменной класс, передаем контекст
    const country = new CountrySingleSelect(page);

    // Кликаем на иконку селектора стран
    await country.getLocator('selector').click();

    // Проверяем максимальное количество символов в инпуте, введя большее число, чем в документации
    await country.getLocator('input')
        .fill('a'.repeat(256))
        .then(async () => {
            // Убедимся, что длина строки ограничена до 255 символов
            expect(await country.getLocator('input')).toHaveValue('a'.repeat(255));
        });

    // Заскриниваем панель селектора в состоянии no-data
    await country.getLocator('panel').screenshot({ path: 'no-data-panel.png' });

    // Очищаем инпут по клику на иконку
    await country.getLocator('clearInputIcon').click();

    // Вводим название страны в инпут
    await country.getLocator('input').fill(testCountryName);

    // Выбираем страну из выпадающего списка и кликаем, тем самым закрывая селектор
    await country.getLocator('choose').click();
});