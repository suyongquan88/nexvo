/**
 * Singapore top 10 retail / e-commerce sites by monthly web traffic.
 * Sources: Semrush SG retail rankings (Mar 2026), Statista (Dec 2025).
 */
export const VERIFY_PLATFORMS = [
  { value: "shopee_sg", label: "Shopee Singapore" },
  { value: "lazada_sg", label: "Lazada Singapore" },
  { value: "aliexpress", label: "AliExpress" },
  { value: "samsung", label: "Samsung" },
  { value: "amazon_sg", label: "Amazon Singapore" },
  { value: "ebay", label: "eBay" },
  { value: "fairprice", label: "NTUC FairPrice" },
  { value: "shein", label: "SHEIN" },
  { value: "ikea", label: "IKEA" },
  { value: "carousell", label: "Carousell" },
] as const;

export type VerifyPlatform = (typeof VERIFY_PLATFORMS)[number]["value"];
