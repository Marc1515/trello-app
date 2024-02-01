import { OrganizationSwitcher, auth } from "@clerk/nextjs";

const OrganizationIdPage = () => {
  const { userId, orgId } = auth();

  return <div>Organization Id Page!</div>;
};

export default OrganizationIdPage;
