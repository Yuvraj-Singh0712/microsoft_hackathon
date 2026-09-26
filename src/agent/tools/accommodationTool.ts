import { GROUNDED_DESTINATIONS } from '../groundData';

export interface AccommodationSelection {
  name: string;
  type: 'Boutique Homestay' | 'Riverside Resort' | 'Heritage Haveli' | 'Eco Lodge' | 'Cozy Hotel';
  costPerNightInr: number;
  totalNightsCostInr: number;
  rating: number;
  natureHighlight: string;
  address: string;
  amenities: string[];
}

export class AccommodationTool {
  public static readonly toolName = 'accommodation_matcher';
  public static readonly description = 'Finds vetted accommodations that balance budget constraints, ratings, and nature-centric vibes.';

  public static execute(
    destinationKey: string,
    nights: number,
    targetNightlyBudgetInr: number
  ): AccommodationSelection {
    const dest = GROUNDED_DESTINATIONS[destinationKey] || GROUNDED_DESTINATIONS['rishikesh-landour'];
    const candidates = [...dest.accommodations].sort((a, b) => a.costPerNightInr - b.costPerNightInr);

    // Pick highest rated stay that fits within targetNightlyBudgetInr, or fallback to the lowest cost stay
    let chosen = candidates[0];
    for (const stay of candidates) {
      if (stay.costPerNightInr <= targetNightlyBudgetInr) {
        chosen = stay;
      }
    }

    return {
      name: chosen.name,
      type: chosen.type,
      costPerNightInr: chosen.costPerNightInr,
      totalNightsCostInr: chosen.costPerNightInr * nights,
      rating: chosen.rating,
      natureHighlight: chosen.natureHighlight,
      address: chosen.address,
      amenities: chosen.amenities,
    };
  }
}
