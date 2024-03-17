import { clerkClient } from "@clerk/nextjs";

export async function getClerkOrganizations() {
  try {
    const organizationsList =
      await clerkClient.organizations.getOrganizationList();
    return organizationsList.map((org) => org.id);
  } catch (error) {
    console.error("Error fetching organizations from Clerk:", error);
    return [];
  }
}
