/**
 * Сервис для работы с localStorage
 */

interface LocalStorageService {
  /**
   * Сохраняет значение в localStorage
   * @param key - ключ для сохранения значения
   * @param value - значение для сохранения (будет преобразовано в JSON строку)
   */
  setItem<T>(key: string, value: T): void;

  /**
   * Получает значение из localStorage
   * @param key - ключ для получения значения
   * @param defaultValue - значение по умолчанию, если ключ не найден
   * @returns значение из localStorage или defaultValue
   */
  getItem<T>(key: string, defaultValue: T): T;

  /**
   * Удаляет значение из localStorage
   * @param key - ключ для удаления
   */
  removeItem(key: string): void;

  /**
   * Очищает все значения из localStorage
   */
  clear(): void;
}

class LocalStorageServiceImpl implements LocalStorageService {
  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(
        `Ошибка при сохранении значения в localStorage по ключу "${key}":`,
        error
      );
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }

      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(
        `Ошибка при получении значения из localStorage по ключу "${key}":`,
        error
      );
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(
        `Ошибка при удалении значения из localStorage по ключу "${key}":`,
        error
      );
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Ошибка при очистке localStorage:", error);
    }
  }
}

// Экспортируем экземпляр сервиса как синглтон
export const localStorageService = new LocalStorageServiceImpl();
