/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getClimateInsights(summary: any) {
  const prompt = `
    As a Senior Climate Scientist, analyze the following climate trend data from a 50-year dataset and provide 3 key professional insights.
    
    Data Summary:
    - Temperature Delta: ${summary.tempDelta}°C
    - CO2 Change: ${summary.co2Delta} ppm
    - Total Anomalies Detected: ${summary.totalAnomalies}
    - Confidence: ${summary.confidence}
    
    Structure your response as 3 concise bullet points with industry-standard terminology.
    Keep it professional, data-centric, and impactful for a research report.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to retrieve AI insights. Please check your data or API connection.";
  }
}
