import { RetailOperatingModel } from "./RetailOperatingModel";
import { BrandRefreshSection } from "./BrandRefreshSection";

/**
 * ModelSection — container wrapping both RetailOperatingModel and BrandRefreshSection
 * under a unified "The Model" header.
 * Purpose: Groups both sections as part of "The Model" offering.
 */
export function ModelSection() {
  return (
    <section id="the-model">
      <RetailOperatingModel hideLabel={false} />
      <BrandRefreshSection hideLabel={false} />
    </section>
  );
}
