export const membershipStatuses = ["active", "suspended", "removed"] as const;

export type MembershipStatus = (typeof membershipStatuses)[number];
