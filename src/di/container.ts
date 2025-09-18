import { localStorageService } from "../services/localStorageService";
import type { LocalStorageService } from "../services/localStorageService";

class DIContainer {
  private services: Map<string, any> = new Map();

  register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  resolve<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found`);
    }
    return service;
  }
}

export const container = new DIContainer();
container.register<LocalStorageService>("StorageService", localStorageService);
