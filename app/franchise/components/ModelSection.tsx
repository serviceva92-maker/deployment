import { RetailOperatingModel } from "./RetailOperatingModel";
import { BrandRefreshSection } from "./BrandRefreshSection";
import { LifestyleBand } from "./LifestyleBand";

/**
 * ModelSection — container wrapping RetailOperatingModel, BrandRefreshSection, and LifestyleBand
 * together as part of "The Model" offering.
 * Purpose: Groups all three sections as part of "The Model" menu item.
 */
export function ModelSection() {
  return (
    <section id="the-model">
      <RetailOperatingModel hideLabel={false} />
      <BrandRefreshSection hideLabel={false} />
      <LifestyleBand />
    </section>
  );
}
