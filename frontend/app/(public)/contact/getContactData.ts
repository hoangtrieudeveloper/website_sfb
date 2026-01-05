import { PublicEndpoints } from "@/lib/api/public";
import { buildUrl } from "@/lib/api/base";

export async function getContactData() {
  try {
    const response = await fetch(buildUrl(PublicEndpoints.contact.get), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`[Contact Page] Failed to fetch contact data: ${response.status}`);
      return null;
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error("[Contact Page] Error fetching contact data:", error);
    return null;
  }
}

