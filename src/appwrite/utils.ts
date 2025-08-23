import { ID, Models } from 'appwrite';
import { databases } from './config';

/**
 * Utility class for handling CRUD operations with Appwrite
 */
export class AppwriteService {
  static async createDocument<T extends object>(
    databaseId: string,
    collectionId: string,
    data: T
  ): Promise<Models.Document> {
    return await databases.createDocument(databaseId, collectionId, ID.unique(), data);
  }

  static async getDocument(databaseId: string, collectionId: string, documentId: string): Promise<Models.Document> {
    return await databases.getDocument(databaseId, collectionId, documentId);
  }

  static async listDocuments(
    databaseId: string,
    collectionId: string,
    queries: string[] = []
  ): Promise<Models.DocumentList<Models.Document>> {
    return await databases.listDocuments(databaseId, collectionId, queries);
  }

  static async updateDocument<T extends object>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: T
  ): Promise<Models.Document> {
    return await databases.updateDocument(databaseId, collectionId, documentId, data);
  }

  static async deleteDocument(databaseId: string, collectionId: string, documentId: string): Promise<object> {
    return await databases.deleteDocument(databaseId, collectionId, documentId);
  }
}

// env variables
