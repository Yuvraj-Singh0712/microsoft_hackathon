export interface WeatherForecast {
  dayIndex: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Mist/Fog' | 'Pleasant';
  tempC: number;
  rainProbability: number;
  icon: string;
  isDisruptive: boolean;
  advisory?: string;
}

export class WeatherTool {
  public static readonly toolName = 'weather_forecast_checker';
  public static readonly description = 'Checks localized micro-climate forecasts to preemptively identify rain, extreme cold, or optimal hiking conditions.';

  public static execute(destinationKey: string, dayIndex: number, forceRain: boolean = false): WeatherForecast {
    if (forceRain || dayIndex === 2 && destinationKey.includes('rain-sim')) {
      return {
        dayIndex,
        condition: 'Rainy',
        tempC: 19,
        rainProbability: 88,
        icon: '🌧️',
        isDisruptive: true,
        advisory: 'Heavy monsoon showers expected. Outdoor mountain trails closed; shifting to indoor cultural workshops & heritage cafes.',
      };
    }

    // Default pleasant weather sequence
    const conditions: Array<WeatherForecast['condition']> = ['Sunny', 'Pleasant', 'Partly Cloudy', 'Mist/Fog', 'Sunny'];
    const chosenCondition = conditions[dayIndex % conditions.length];
    const temps = [24, 22, 21, 18, 23];
    const rainProbs = [10, 15, 20, 25, 5];

    return {
      dayIndex,
      condition: chosenCondition,
      tempC: temps[dayIndex % temps.length],
      rainProbability: rainProbs[dayIndex % rainProbs.length],
      icon: chosenCondition === 'Sunny' ? '☀️' : chosenCondition === 'Pleasant' ? '🌤️' : chosenCondition === 'Mist/Fog' ? '🌫️' : '⛅',
      isDisruptive: false,
      advisory: chosenCondition === 'Mist/Fog' ? 'Crisp misty morning; carry a warm fleece for early mountain walks.' : undefined,
    };
  }
}
