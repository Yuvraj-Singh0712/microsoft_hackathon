export type TravelPace = 'relaxed' | 'moderate' | 'fast-paced';

export type TravelTheme = 'nature' | 'food' | 'adventure' | 'heritage' | 'wellness' | 'nightlife' | 'culture' | 'relaxation';

export type DietaryPreference = 'any' | 'vegetarian' | 'vegan' | 'halal' | 'jain';

export interface TripRequest {
  id: string;
  origin: string;
  destination?: string;
  travelers: number;
  budgetInr: number;
  durationDays: number;
  themes: TravelTheme[];
  pace: TravelPace;
  dietary?: DietaryPreference;
  notes?: string;
  startDate?: string;
}

export interface ActivitySlot {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  timeRange: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  category: 'nature' | 'food' | 'culture' | 'transit' | 'relaxation' | 'adventure' | 'wellness';
  costInr: number;
  durationHours: number;
  weatherSuitability: 'all' | 'dry-only' | 'indoor-preferred';
  tags: string[];
  bookingTip?: string;
  sourceAttribution: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  themeFocus: string;
  dateStr?: string;
  weatherSummary: {
    tempC: number;
    condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Mist/Fog' | 'Pleasant';
    icon: string;
    rainProbability: number;
    alert?: string;
  };
  transitSummary: {
    mode: string;
    distanceKm: number;
    durationHours: number;
    estimatedCostInr: number;
    routeDescription: string;
  };
  accommodation: {
    name: string;
    type: 'Boutique Homestay' | 'Riverside Resort' | 'Heritage Haveli' | 'Eco Lodge' | 'Cozy Hotel';
    costPerNightInr: number;
    rating: number;
    natureHighlight: string;
    address: string;
  };
  activities: ActivitySlot[];
  culinaryHighlights: {
    meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Tea & Snacks';
    restaurantName: string;
    specialtyDish: string;
    isVegFriendly: boolean;
    costForTwoInr: number;
    sourceCitation: string;
  }[];
  dayBudgetSpentInr: number;
  paceNotes: string;
}

export interface BudgetBreakdown {
  totalBudgetInr: number;
  allocatedInr: number;
  remainingInr: number;
  categories: {
    accommodationInr: number;
    transitInr: number;
    activitiesInr: number;
    foodInr: number;
    contingencyInr: number;
  };
  isWithinBudget: boolean;
  costPerPersonInr: number;
  savingsTips: string[];
}

export interface ReplanningDelta {
  changeTrigger: string;
  timestamp: string;
  changesSummary: string;
  swappedActivities: {
    original: string;
    replacement: string;
    reason: string;
  }[];
  costDifferenceInr: number;
  newBudgetTotalInr: number;
  reasoningChain: string[];
}

export interface Itinerary {
  id: string;
  tripTitle: string;
  origin: string;
  destination: string;
  durationDays: number;
  travelers: number;
  pace: TravelPace;
  themes: TravelTheme[];
  days: DayPlan[];
  budget: BudgetBreakdown;
  packingList: string[];
  localTips: string[];
  emergencyContacts: { service: string; number: string }[];
  version: number;
  revisionHistory: ReplanningDelta[];
  createdAt: string;
  securityVerified: boolean;
  groundingVerified: boolean;
}

export interface AgentThoughtStep {
  step: number;
  phase: 'INTENT_PARSING' | 'SECURITY_AUDIT' | 'TOOL_DISPATCH' | 'FEASIBILITY_CHECK' | 'BUDGET_VERIFY' | 'PLAN_SYNTHESIS' | 'REPLANNING';
  title: string;
  detail: string;
  status: 'pending' | 'success' | 'warning' | 'blocked';
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface SecurityAuditResult {
  isSafe: boolean;
  threatLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedPatterns: string[];
  attackType?: 'PROMPT_INJECTION' | 'JAILBREAK' | 'SYSTEM_PROMPT_LEAK' | 'BUDGET_TAMPERING' | 'XSS_SQLI' | 'UNSAFE_INSTRUCTION';
  sanitizedInput: string;
  defenseExplanation: string;
}

export interface EvalBenchmarkResult {
  testId: string;
  name: string;
  category: 'BUDGET_ADHERENCE' | 'SECURITY_DEFENSE' | 'GROUNDING' | 'FEASIBILITY' | 'REPLANNING';
  passed: boolean;
  score: number; // 0 to 100
  latencyMs: number;
  details: string;
  inputScenario: string;
}
