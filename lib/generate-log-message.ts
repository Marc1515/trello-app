import { ACTION, AuditLog } from "@/generated/prisma/browser";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case ACTION.CREATE:
      return `created ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
    case ACTION.UPDATE:
      return `updated ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
    case ACTION.DELETE:
      return `deleted ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
    default:
      return `unkown action ${entityType.toLocaleLowerCase()} "${entityTitle}"`;
  }
};
