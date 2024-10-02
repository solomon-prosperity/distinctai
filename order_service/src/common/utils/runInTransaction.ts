import mongoose, { ClientSession } from 'mongoose';

/**
 * Runs the provided `mutations` callback within a transaction and commits the changes to the DB
 * only when it has run successfully.
 *
 * @param mutations A callback which does DB writes and reads using a transaction session.
 * @returns A promise that resolves with the result of the `mutations` callback or rejects with an error.
 */
export default async function runInTransaction<T>(
  mutations: (session: ClientSession) => Promise<T>,
): Promise<T> {
  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      // The mutations are performed within the transaction
      return mutations(session);
    });
    return result;
  } catch (error) {
    throw error;
  } finally {
    // Always ensure the session is ended
    session.endSession();
  }
}
