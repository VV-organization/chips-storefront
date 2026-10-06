export const project = {
  name:"Chips",
  chipsPerRuble:1.7,
  steamFeePercent:5,
  preview: process.env.NEXT_PUBLIC_CATALOG_MODE !== "live",
} as const;
