import { db } from "@/lib/db";
import { getClerkOrganizations } from "@/lib/get-clerk-organizations";

export async function synchronizeOrganizations() {
  const clerkOrgIds = await getClerkOrganizations();
  const allLocalOrgs = await db.organization.findMany();
  return allLocalOrgs
    .filter((localOrg) => !clerkOrgIds.includes(localOrg.id))
    .map((org) => org.id);
}
