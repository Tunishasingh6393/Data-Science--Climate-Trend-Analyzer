/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClimateDataPoint {
  date: string;
  year: number;
  month: number;
  temperature: number;      // Celsius
  co2: number;              // ppm
  rainfall: number;         // mm
  isAnomaly: boolean;
  anomalyScore?: number;
}

export interface MetricSummary {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  description: string;
}

export interface ChartData {
  results: ClimateDataPoint[];
  summary: MetricSummary[];
}
