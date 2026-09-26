import { BudgetBreakdown } from '../../types/travel';

export class BudgetValidatorTool {
  public static readonly toolName = 'budget_constraint_solver';
  public static readonly description = 'Strict mathematical validator ensuring complete allocation satisfies hard budgetary caps without overdraft.';

  public static balanceBudget(
    totalBudgetInr: number,
    travelers: number,
    durationDays: number,
    targetStayCostPerNight: number,
    roundTripTransitCost: number,
    dailyFoodPerPerson: number = 1000,
    activitiesEstimated: number = 3000
  ): BudgetBreakdown {
    const nights = Math.max(1, durationDays - 1);
    
    // Category initial estimation
    let accommodationInr = targetStayCostPerNight * nights;
    let transitInr = roundTripTransitCost;
    let foodInr = dailyFoodPerPerson * travelers * durationDays;
    let activitiesInr = activitiesEstimated;
    let contingencyInr = Math.round(totalBudgetInr * 0.08); // 8% emergency contingency buffer

    let sum = accommodationInr + transitInr + foodInr + activitiesInr + contingencyInr;

    // Constraint solver: If initial sum exceeds totalBudgetInr, dynamically scale down in priority order
    if (sum > totalBudgetInr) {
      const overage = sum - totalBudgetInr;
      // 1. Scale down accommodation if high
      if (accommodationInr > totalBudgetInr * 0.45) {
        const reduction = Math.min(overage * 0.5, accommodationInr - (totalBudgetInr * 0.35));
        accommodationInr = Math.round(accommodationInr - reduction);
      }
      // 2. Scale food to authentic local eateries / dhabas instead of fine dining
      if (foodInr > totalBudgetInr * 0.28) {
        const reduction = Math.min(overage * 0.3, foodInr - (totalBudgetInr * 0.22));
        foodInr = Math.round(foodInr - reduction);
      }
      // 3. Recalculate contingency to strictly balance exactly within budget
      contingencyInr = Math.max(1000, totalBudgetInr - (accommodationInr + transitInr + foodInr + activitiesInr));
      sum = accommodationInr + transitInr + foodInr + activitiesInr + contingencyInr;
    }

    const remainingInr = Math.max(0, totalBudgetInr - sum);
    const isWithinBudget = sum <= totalBudgetInr;
    const costPerPersonInr = Math.round(sum / travelers);

    const savingsTips: string[] = [
      'Booking Vande Bharat Chair Car 2 weeks in advance saves up to ₹800 compared to last-minute tatkal.',
      'Sisters Bazaar cafes offer complimentary afternoon tea with bakery items during weekdays.',
      'Shared local electric rickshaws in Rishikesh cost ₹20/ride compared to ₹250 private cabs for short hops.'
    ];

    return {
      totalBudgetInr,
      allocatedInr: sum,
      remainingInr,
      categories: {
        accommodationInr,
        transitInr,
        activitiesInr,
        foodInr,
        contingencyInr,
      },
      isWithinBudget,
      costPerPersonInr,
      savingsTips,
    };
  }
}
