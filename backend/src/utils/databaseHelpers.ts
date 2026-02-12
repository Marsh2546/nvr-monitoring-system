import { query } from "../databaseService";

// Function to handle duplicate key errors gracefully
export async function safeInsertWithRetry<T>(
  insertQuery: string,
  params: any[],
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await query<T>(insertQuery, params);
      return result[0]; // Return first result if successful
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a duplicate key error
      if (error.code === '23505' && error.constraint === 'nvr_status_history_pkey') {
        console.log(`Duplicate key detected on attempt ${attempt}, retrying...`);
        
        // Get the next available ID
        const nextId = await getNextAvailableId();
        
        // Update the query with the new ID
        const updatedQuery = insertQuery.replace(
          /VALUES\s*\(\s*\d+,/,
          `VALUES (${nextId},`
        );
        
        // Update params to remove the ID if it's the first parameter
        const updatedParams = params.slice(1);
        
        try {
          const result = await query<T>(updatedQuery, updatedParams);
          return result[0];
        } catch (retryError) {
          console.error(`Retry ${attempt} failed:`, retryError);
          if (attempt === maxRetries) {
            throw retryError;
          }
          // Wait before next retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } else {
        // If it's not a duplicate key error, throw immediately
        throw error;
      }
    }
  }
  
  throw lastError!;
}

// Function to get the next available ID
export async function getNextAvailableId(): Promise<number> {
  try {
    const result = await query<{ max_id: number }>(`
      SELECT COALESCE(MAX(id), 0) + 1 as max_id 
      FROM nvr_status_history
    `);
    return result[0].max_id;
  } catch (error) {
    console.error("Failed to get next available ID:", error);
    throw error;
  }
}

// Function to reset sequence
export async function resetSequence(): Promise<void> {
  try {
    await query(`
      SELECT setval('nvr_status_history_id_seq', 
        COALESCE((SELECT MAX(id) FROM nvr_status_history), 0) + 1, 
        true)
    `);
    console.log("Sequence reset successfully");
  } catch (error) {
    console.error("Failed to reset sequence:", error);
    throw error;
  }
}
