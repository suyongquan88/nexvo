import { getMarketplaceLinksForProduct } from "@/config/marketplaces";
import { buttonSizes, buttonVariants } from "@/design-system/Button";
import { cn } from "@/design-system/cn";

type Props = {
  searchKeyword: string;
  layout?: "row" | "stack";
};

export function CommerceMarketplaceLinks({
  searchKeyword,
  layout = "row",
}: Props) {
  const links = getMarketplaceLinksForProduct(searchKeyword);

  if (links.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-2",
        layout === "stack" ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap"
      )}
    >
      {links.map(({ marketplace, url }) => (
        <a
          key={marketplace.id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants.outline,
            buttonSizes.sm,
            "w-full justify-center sm:w-auto sm:min-w-[11rem]"
          )}
        >
          Compare on {marketplace.name}
        </a>
      ))}
    </div>
  );
}
