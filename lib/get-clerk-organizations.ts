import { clerkClient } from "@clerk/nextjs/server";

export async function getClerkOrganizations() {
  try {
    const client = await clerkClient();
    const organizationsList =
      await client.organizations.getOrganizationList();
    return organizationsList.data.map((org) => org.id);
  } catch (error) {
    console.error("Error fetching organizations from Clerk:", error);
    return [];
  }
}
