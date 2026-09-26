import {
  Itinerary,
  ReplanningDelta,
  AgentThoughtStep,
  TripRequest
} from '../types/travel';
import { AgentPlanner, PlanGenerationResult } from './planner';

export type DisruptionType =
  | 'BUDGET_REDUCTION_35K'
  | 'RAIN_DISRUPTION_DAY2'
  | 'PURE_VEGETARIAN'
  | 'FAST_PACED_ADVENTURE'
  | 'SWAP_DESTINATION_HIMACHAL';

export class AgentReplanner {
  /**
   * Adapts existing itinerary dynamically in response to new constraints or external events
   */
  public static async replan(
    currentItinerary: Itinerary,
    disruptionType: DisruptionType,
    customInstructions?: string
  ): Promise<PlanGenerationResult & { delta: ReplanningDelta }> {
    const reasoningChain: string[] = [];
    const swappedActivities: ReplanningDelta['swappedActivities'] = [];
    const changeTrigger = customInstructions || disruptionType;

    reasoningChain.push(`Received disruption event: ${changeTrigger}`);

    // Create target modified request based on current itinerary
    const modifiedRequest: Partial<TripRequest> = {
      budgetInr: currentItinerary.budget.totalBudgetInr,
      durationDays: currentItinerary.durationDays,
      travelers: currentItinerary.travelers,
      pace: currentItinerary.pace,
      themes: [...currentItinerary.themes],
      origin: currentItinerary.origin,
      destination: currentItinerary.destination.toLowerCase().includes('tirthan') ? 'tirthan-kasol' : 'rishikesh-landour',
    };

    let summaryDesc = '';

    switch (disruptionType) {
      case 'BUDGET_REDUCTION_35K':
        modifiedRequest.budgetInr = 35000;
        reasoningChain.push('Budget reduced to ₹35,000. Re-optimizing lodging to high-value riverside eco-havens (₹3,200/nt vs ₹4,500/nt).');
        reasoningChain.push('Adjusting dining focus to authentic local food trail and Garhwali culinary specialties (₹650-₹750/meal for two).');
        summaryDesc = 'Budget optimized from ₹50,000 to ₹35,000. Preserved all core nature walks while rebalancing stay & dining allocations.';
        break;

      case 'RAIN_DISRUPTION_DAY2':
        reasoningChain.push('Severe rain forecasted on Day 2. Outdoor mountain waterfall trek flagged as hazardous.');
        reasoningChain.push('Triggered Attraction Curator: Swapping outdoor trail with Landour Sisters Bazaar Heritage Pottery Atelier and indoor Himalayan tea salon.');
        swappedActivities.push({
          original: 'Neer Garh Natural Waterfall & Forest Canopy Trail',
          replacement: 'Sisters Bazaar Heritage Pottery & Handcraft Atelier',
          reason: 'Monsoon shower safety protocol: Swapped slick outdoor rock trail with cozy indoor artisan pottery & tea craft.',
        });
        summaryDesc = 'Day 2 modified for heavy rain: Replaced outdoor waterfall trek with sheltered heritage pottery and artisanal cafe workshop.';
        break;

      case 'PURE_VEGETARIAN':
        modifiedRequest.dietary = 'vegetarian';
        reasoningChain.push('Dietary preference updated to Strictly Pure Vegetarian / Sattvic.');
        reasoningChain.push('Filtered all dining slots to verified vegetarian & organic mountain kitchen listings (Chotiwala, Beatles Bistro, Landour Bakehouse).');
        summaryDesc = 'All culinary recommendations updated to 100% pure vegetarian, farm-to-table mountain dining.';
        break;

      case 'FAST_PACED_ADVENTURE':
        modifiedRequest.pace = 'fast-paced';
        if (!modifiedRequest.themes?.includes('adventure')) {
          modifiedRequest.themes?.push('adventure');
        }
        reasoningChain.push('Pace switched from relaxed to fast-paced. Increasing daily activity density from 2 to 3-4 spots.');
        reasoningChain.push('Added high-adrenaline slots: Vashishta Gufa dawn trail and Landour ridge panorama.');
        summaryDesc = 'Itinerary restructured into high-energy format with 3-4 daily activities and early morning sunrise hikes.';
        break;

      case 'SWAP_DESTINATION_HIMACHAL':
        modifiedRequest.destination = 'tirthan-kasol';
        reasoningChain.push('Destination switched to Himachal Pradesh (Tirthan Valley & Parvati Pines).');
        reasoningChain.push('Dispatched Transit Tool: Shifted route to Luxury AC Volvo via Aut Tunnel.');
        reasoningChain.push('Dispatched Accommodation Matcher: Matched Tirthan River Whispers Chalet.');
        summaryDesc = 'Trip relocated from Uttarakhand to Tirthan Valley (Himachal Pradesh) with UNESCO Great Himalayan National Park trails.';
        break;
    }

    // Generate updated itinerary using core planner
    const rawPrompt = `Plan a ${modifiedRequest.durationDays || 5}-day trip from ${modifiedRequest.origin || 'Delhi'} for ${modifiedRequest.travelers || 2} under ₹${modifiedRequest.budgetInr || 50000}, focused on ${modifiedRequest.themes?.join(' and ')}, pace ${modifiedRequest.pace || 'relaxed'}.`;

    const planResult = await AgentPlanner.generatePlan(rawPrompt, modifiedRequest);

    if (!planResult.itinerary) {
      throw new Error('Re-planning generation failed');
    }

    // If rain disruption, explicitly adapt Day 2 in the plan
    if (disruptionType === 'RAIN_DISRUPTION_DAY2' && planResult.itinerary.days.length >= 2) {
      const day2 = planResult.itinerary.days[1];
      day2.weatherSummary = {
        tempC: 19,
        condition: 'Rainy',
        icon: '🌧️',
        rainProbability: 92,
        alert: 'HEAVY RAIN ADVISORY: Outdoor trails closed. Indoor cultural schedule active.',
      };
      day2.title = 'Day 2: Sheltered Artisan Pottery & Historic Bakehouse Atelier';
      day2.activities = [
        {
          id: 'pottery-rain-sub',
          timeSlot: 'Morning',
          timeRange: '09:30 AM – 12:30 PM',
          title: 'Sisters Bazaar Heritage Pottery & Handcraft Atelier',
          description: 'Indoor artisan craft studio tucked in historic colonial stone cottage. Learn clay molding and handmade beeswax candle crafting.',
          location: 'Landour, Uttarakhand',
          coordinates: { lat: 30.4612, lng: 78.1021 },
          category: 'culture',
          costInr: 800,
          durationHours: 2.5,
          weatherSuitability: 'indoor-preferred',
          tags: ['Indoor Artisan', 'Rain Friendly', 'Handcraft', 'Relaxing'],
          bookingTip: 'Complimentary warm herbal spiced rhododendron tea included.',
          sourceAttribution: 'Landour Community Cultural Archive Verified',
        },
        {
          id: 'bakehouse-tea-rain',
          timeSlot: 'Afternoon',
          timeRange: '02:00 PM – 04:30 PM',
          title: 'Landour Bakehouse & Colonial Literature Salon',
          description: 'Relax indoors with antique recipe book pastries, fresh cinnamon buns, and cozy mountain valley views through rain-streaked bay windows.',
          location: 'Sisters Bazaar, Landour',
          coordinates: { lat: 30.4608, lng: 78.1018 },
          category: 'food',
          costInr: 700,
          durationHours: 2.0,
          weatherSuitability: 'indoor-preferred',
          tags: ['Indoor Comfort', 'Rain View', 'Pastries & Coffee'],
          bookingTip: 'Reserve a corner table by the library bookshelves.',
          sourceAttribution: 'Ruskin Bond Recommended Himalayan Cafes',
        }
      ];
    }

    const costDiff = planResult.itinerary.budget.allocatedInr - currentItinerary.budget.allocatedInr;

    const delta: ReplanningDelta = {
      changeTrigger,
      timestamp: new Date().toLocaleTimeString(),
      changesSummary: summaryDesc,
      swappedActivities,
      costDifferenceInr: costDiff,
      newBudgetTotalInr: planResult.itinerary.budget.allocatedInr,
      reasoningChain,
    };

    planResult.itinerary.version = currentItinerary.version + 1;
    planResult.itinerary.revisionHistory = [delta, ...(currentItinerary.revisionHistory || [])];

    const replanStep: AgentThoughtStep = {
      step: planResult.thoughtSteps.length + 1,
      phase: 'REPLANNING',
      title: 'Adaptive Re-planning Complete',
      detail: summaryDesc,
      status: 'success',
      data: { delta },
      timestamp: new Date().toLocaleTimeString(),
    };

    planResult.thoughtSteps.push(replanStep);

    return {
      ...planResult,
      delta,
    };
  }
}
