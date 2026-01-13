import { PublicEndpoints } from "@/lib/api/public";
import { publicApiCall } from "@/lib/api/public/client";

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

