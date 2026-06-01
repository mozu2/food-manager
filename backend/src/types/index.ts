export const VALID_UNITS = ["GRAM", "ML", "PIECE", "BAG", "BOTTLE", "BOX"] as const;

export type Unit = (typeof VALID_UNITS)[number];