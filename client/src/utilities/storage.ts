const isExtension = !!chrome && !!chrome.storage;

class Storage {
  #storage: globalThis.Storage;

  constructor(storage: globalThis.Storage) {
    this.#storage = storage;
  }

  async get(keys: string[]): Promise<{ [key: string]: any }> {
    const result: { [key: string]: any } = {};
    return keys.reduce((result: { [key: string]: any }, key: string) => {
      const value =
        JSON.parse(this.#storage.getItem(key) ?? 'null') ?? undefined;
      if (value !== undefined) result[key] = value;
      return result;
    }, result);
  }

  async set(data: { [key: string]: any }): Promise<void> {
    Object.entries(data).forEach(([key, value]) =>
      this.#storage.setItem(key, JSON.stringify(value)),
    );
  }

  async remove(keys: string[]): Promise<void> {
    return keys.forEach((key) => this.#storage.removeItem(key));
  }

  async clear(): Promise<void> {
    return this.#storage.clear();
  }
}

const pageStorage = {
  local: new Storage(localStorage),
  sync: new Storage(localStorage),
  session: new Storage(sessionStorage),
};

const storage = isExtension ? chrome.storage : pageStorage;
export default storage;
