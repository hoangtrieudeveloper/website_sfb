/**
 * @deprecated This file is kept for backward compatibility.
 * Please use the new structure:
 * - For admin APIs: import { adminApiCall, AdminEndpoints } from "@/lib/api/admin"
 * - For public APIs: import { publicApiCall, PublicEndpoints } from "@/lib/api/public"
 * - For auth: import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/auth/token"
 * 
 * This file will be removed in a future version.
 */

// Re-export from new structure for backward compatibility
export {
  adminApiCall as apiCall,
  AdminEndpoints as API_ENDPOINTS,
} from "./api/admin";

export {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
} from "./auth/token";

