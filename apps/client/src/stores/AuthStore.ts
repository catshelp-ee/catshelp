import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import type { User } from '@interfaces/user.ts';

class AuthStore {
    constructor() {
        makeAutoObservable(this);
    }

    user: User | null = null;

    private userFetchPromise: Promise<User> | null = null;


    /**
     * A function to fetch the current user.
     *
     * @param {boolean} [force=false] - If true, it will always
     * fetch the user, even if it is already set.
     *
     * @return {Promise<User>} A promise that resolves to the user
     * or throws an error if the user could not be fetched.
     */
    public async fetchUser(force = false) {
        if (!force && this.user) {
            return this.user;
        }

        if (this.userFetchPromise) {
            return this.userFetchPromise;
        }

        this.userFetchPromise = axios.get<User>('/api/users/me')
            .then(({ data }) => {
                if (!data) {
                    throw new Error('Failed to fetch user');
                }

                runInAction(() => {
                    this.user = data;
                });

                return data;
            })
            .finally(() => {
                // Clear on success and failure so a failed fetch doesn't stick forever
                runInAction(() => {
                    this.userFetchPromise = null;
                });
            });

        return this.userFetchPromise;
    }

    public isAdmin() {
        return this.user?.role === 'ADMIN';
    }

    /**
     * Function to log out of both Portal and Hub. Ignores any errors with logging out of Hub.
     */
    public async logout() {
        await axios.post('/api/auth/logout');
        window.location.href = "/login";
    }

    /**
     * A function to initialize the store.
     *
     * @return {Promise<void>} A promise that resolves,
     * when the store is initialized.
     */
    async initialize() {
        await this.fetchUser(true);
    }
}

export default new AuthStore();
