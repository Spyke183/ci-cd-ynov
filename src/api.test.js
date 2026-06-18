import { countUsers } from './api';

describe('api - countUsers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renvoie le nombre d'utilisateurs en cas de succès", async () => {
    // On simule un fetch qui réussit et renvoie { count: 5 }.
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ count: 5 }) })
    );

    const count = await countUsers();

    expect(count).toBe(5);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/users');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("propage l'erreur en cas d'échec de l'API", async () => {
    // On simule un fetch qui échoue.
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));

    await expect(countUsers()).rejects.toThrow('Network Error');
  });
});
