import { GROUNDED_DESTINATIONS } from '../groundData';
import { ActivitySlot, TravelTheme, TravelPace } from '../../types/travel';

export class AttractionTool {
  public static readonly toolName = 'attraction_curator';
  public static readonly description = 'Selects and schedules grounded points of interest tailored to pace, themes, and weather safety.';

  public static execute(
    destinationKey: string,
    dayIndex: number,
    themes: TravelTheme[],
    pace: TravelPace,
    isRainy: boolean = false
  ): ActivitySlot[] {
    const dest = GROUNDED_DESTINATIONS[destinationKey] || GROUNDED_DESTINATIONS['rishikesh-landour'];
    const allAttractions = dest.attractions;

    // Filter by weather: if rainy, prioritize indoor-preferred or all-weather activities
    const weatherSafeAttractions = allAttractions.filter(attr => {
      if (isRainy) {
        return attr.weatherSuitability !== 'dry-only';
      }
      return true;
    });

    // Pacing rules:
    // 'relaxed': 2 activities per day with generous buffer
    // 'moderate': 3 activities per day
    // 'fast-paced': 3-4 activities per day
    const targetCount = pace === 'relaxed' ? 2 : pace === 'moderate' ? 3 : 4;

    const slots: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening'];
    const selected: ActivitySlot[] = [];

    // Cycle through available attractions based on dayIndex to ensure variety
    for (let i = 0; i < targetCount; i++) {
      const slotName = slots[i % slots.length];
      const candidateIndex = (dayIndex * 2 + i) % weatherSafeAttractions.length;
      const raw = weatherSafeAttractions[candidateIndex];

      const timeRange = slotName === 'Morning' ? '08:30 AM – 11:30 AM' : slotName === 'Afternoon' ? '01:30 PM – 04:30 PM' : '05:30 PM – 08:00 PM';

      selected.push({
        id: `${raw.id}-d${dayIndex}-${i}`,
        timeSlot: slotName,
        timeRange,
        title: raw.title,
        description: raw.description,
        location: `${dest.name}, ${dest.state}`,
        coordinates: { lat: raw.lat, lng: raw.lng },
        category: raw.category,
        costInr: raw.costForTwoInr,
        durationHours: raw.timeNeededHours,
        weatherSuitability: raw.weatherSuitability,
        tags: raw.tags,
        bookingTip: raw.bookingTip,
        sourceAttribution: raw.sourceCitation,
      });
    }

    return selected;
  }
}
