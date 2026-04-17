# Climate Nexus Model Whitepaper
## Stochastic Forcing Model (SFM v2.1)

### 1. Abstract
This project utilizes a Stochastic Forcing Model (SFM) to simulate and analyze climate variability. The model combines linear anthropogenic trends with stochastic noise and periodic seasonal signals to provide a realistic approximation of climate time-series data.

### 2. Mathematical Framework

The primary temperature model follows the equation:
`T(t) = T_base + W_trend * t + S_cycle(t) + ε`

Where:
- `T(t)`: Global mean surface temperature at time `t`.
- `W_trend`: Anthroprogenic warming rate (~0.018°C/year).
- `S_cycle`: Seasonal sine-wave variation.
- `ε`: Stochastic noise representing natural variability (El Niño, volcanic events, etc.).

CO2 levels are modeled using an exponential accumulation function:
`C(t) = C_base + G_rate * t + σ`

### 3. Anomaly Detection
Weather anomalies are detected using a 2.5σ (Sigma) threshold. Events exceeding this variance are flagged as "Critical Anomalies" within the dataset.

### 4. Implementation Details
The model is implemented in TypeScript within `/src/lib/dataEngine.ts` and parameterized via `/models/climateModelConstants.ts`.
