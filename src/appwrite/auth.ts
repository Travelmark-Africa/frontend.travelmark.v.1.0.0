import { Account, Models } from 'appwrite';
import { client } from './config';
import { ADMIN } from '@/appwrite/config';

/**
 * Auth service for handling authentication with Appwrite
 * Modified to work with a pre-created user from Appwrite console
 */
export class AuthService {
  private account: Account;

  // Pre-existing user ID from Appwrite console
  private readonly EXISTING_USER_ID = ADMIN.USER_ID;

  constructor() {
    this.account = new Account(client);
  }

  /**
   * Login with email and password for the pre-existing user
   */

  async login(email: string, password: string): Promise<Models.Session> {
    console.log(email, password);
    return await this.account.createEmailPasswordSession(email, password);
  }

  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await this.account.get();
    } catch {
      return null;
    }
  }

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    await this.account.deleteSession('current');
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }

  /**
   * Update user's name
   */
  async updateName(name: string): Promise<Models.User<Models.Preferences>> {
    return await this.account.updateName(name);
  }

  /**
   * Update user's password
   */
  async updatePassword(password: string, oldPassword?: string): Promise<Models.User<Models.Preferences>> {
    return await this.account.updatePassword(password, oldPassword);
  }

  /**
   * Get the pre-existing user ID
   */
  getExistingUserId(): string {
    return this.EXISTING_USER_ID;
  }
}
