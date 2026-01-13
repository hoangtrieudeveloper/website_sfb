/**
 * Contact API Service
 * Functions for fetching contact-related data from the public API
 */

import { PublicEndpoints } from "./endpoints";
import { publicApiCall } from "./client";

export async function getContactData(locale?: 'vi' | 'en' | 'ja') {
  try {
    const response = await publicApiCall<{ success: boolean; data?: any }>(
      PublicEndpoints.contact.get,
      {},
      locale
    );

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    return null;
  }
}
