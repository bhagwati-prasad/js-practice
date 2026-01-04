Below is a **Product Specification Document (PSD)** for **Benchmark Module**.


---

# 📘 BenchmarkJS

## Browser Performance Research & Diagnostics Platform

**Product Specification Document (PSD)**

---

## 1. Product Overview

### 1.1 Purpose

BenchmarkJS is a **browser-native performance research tool** designed to measure, diagnose, visualize, and reason about JavaScript execution performance under real browser conditions.

Unlike traditional benchmarking tools, BenchmarkJS:

* Treats **noise as first-class data**
* Explicitly detects **event loop jitter**
* Heuristically detects **garbage collection (GC) pauses**
* Rejects **polluted runs**
* Provides **confidence-aware conclusions**
* Offers a **visual performance lab UI**

---

### 1.2 Design Philosophy

| Principle                   | Description                                     |
| --------------------------- | ----------------------------------------------- |
| Measurement ≠ Understanding | Raw timings are meaningless without diagnostics |
| Noise-aware                 | Jitter, GC, scheduling delays are expected      |
| Browser-first               | No Node.js, no build step required              |
| Deterministic core          | Core engine must not depend on UI               |
| Modular extensibility       | All features are opt-in plugins                 |
| Fail loudly                 | Runtime errors must be descriptive              |

---

## 2. High-Level Architecture

```
┌────────────────────────────┐
│ RuntimeHealth (generic)    │
├────────────────────────────┤
│ Core Benchmark Engine      │
├────────────────────────────┤
│ Plugin System              │
├────────────────────────────┤
│ Research Module            │
├────────────────────────────┤
│ Regression Module          │
├────────────────────────────┤
│ Visualization Module       │
├────────────────────────────┤
│ Timeline UI Module         │
├────────────────────────────┤
│ Lab UI Module              │
└────────────────────────────┘
```

Each layer **depends only on lower layers**.

---

## 3. Core Engine (`benchmark.js`)

### 3.1 Responsibilities

The Core Engine is responsible for:

* Time measurement
* Warmup execution
* Iteration batching
* Statistical aggregation
* Jitter detection
* GC pause heuristics
* Polluted run rejection

It **must not**:

* Touch the DOM
* Perform rendering
* Depend on UI modules

---

### 3.2 Global Object

```js
window.BenchmarkJS
```

All APIs are exposed via this object.

---

### 3.3 Configuration API

```js
BenchmarkJS.config = {
  autoRejectGCPollutedRuns: boolean,
  autoDiscardOutliers: boolean,
  gcSensitivityMultiplier: number
}
```

| Field                    | Description                  |
| ------------------------ | ---------------------------- |
| autoRejectGCPollutedRuns | Remove GC-affected samples   |
| autoDiscardOutliers      | Remove MAD-detected outliers |
| gcSensitivityMultiplier  | GC detection aggressiveness  |

---

### 3.4 Core APIs

#### 3.4.1 Naive Benchmark

```js
BenchmarkJS.naiveBenchmark(fn: Function): number
```

* Uses `Date.now()`
* Executes function once
* Exists for educational comparison only

---

#### 3.4.2 High-Resolution Timing

```js
BenchmarkJS.timeOnce(fn: Function): number
```

* Uses `performance.now()`
* Single execution
* No diagnostics

---

#### 3.4.3 Event Loop Delay Probe

```js
BenchmarkJS.measureEventLoopDelay(samples?: number): Promise<number[]>
```

* Schedules `setTimeout(0)`
* Measures scheduling delay
* Used for jitter & GC correlation

---

#### 3.4.4 Synchronous Benchmark

```js
BenchmarkJS.benchmark(
  fn: Function,
  options?: {
    warmup?: number,
    iterations?: number,
    runs?: number
  }
): Promise<BenchmarkResult>
```

##### BenchmarkResult

```ts
{
  rawSamples: number[],
  samples: number[],
  avg: number,
  min: number,
  max: number,
  std: number,
  jitter: JitterAnalysis,
  gc: GCPauseAnalysis
}
```

---

#### 3.4.5 Async Benchmark

```js
BenchmarkJS.benchmarkAsync(
  fn: () => Promise<any>,
  runs?: number
): Promise<BenchmarkResult>
```

---

### 3.5 Diagnostics

#### 3.5.1 Jitter Analysis

```ts
JitterAnalysis = {
  jitterScore: number,
  classification: "low" | "moderate" | "high",
  coefficientOfVariation: number,
  outliers: Array<{ index, value }>
}
```

---

#### 3.5.2 GC Pause Analysis

```ts
GCPauseAnalysis = {
  detected: boolean,
  pauses: Array<{
    index: number,
    duration: number,
    correlatedEventLoopDelay: number | null,
    confidence: number
  }>
}
```

---

## 4. Plugin System

### 4.1 Registration

```js
BenchmarkJS.use(plugin)
```

Plugin must implement:

```js
plugin.init(core: BenchmarkJS)
```

Plugins may:

* Add APIs
* Read benchmark results
* Add UI

Plugins must **not**:

* Modify core logic
* Mutate raw samples

---

## 5. Runtime Health Module (`runtime-health.js`)

### 5.1 Purpose

Generic runtime diagnostics utility usable in **any project**.

---

### 5.2 API

```js
class RuntimeHealth {
  constructor(options?: {
    strict?: boolean,
    reporter?: Console
  })

  addCheck(
    name: string,
    fn: () => boolean | Promise<boolean>,
    options?: { fatal?: boolean }
  ): this

  run(): Promise<HealthResult[]>

  summary(): {
    total: number,
    passed: number,
    failed: number
  }
}
```

---

### 5.3 HealthResult

```ts
{
  name: string,
  ok: boolean,
  error?: string
}
```

---

## 6. Research Module (`research.js`)

### 6.1 Purpose

Adds **scientific experiment structure**.

---

### 6.2 API

```js
BenchmarkJS.experiment(definition): Promise<ExperimentReport>
```

---

### 6.3 Experiment Definition

```ts
{
  name: string,
  variables: Record<string, any[]>,
  setup(vars): () => void,
  benchmark: BenchmarkOptions
}
```

---

### 6.4 Experiment Report

```ts
{
  meta: {
    name,
    timestamp,
    environment
  },
  results: Array<{
    variables,
    measurement: BenchmarkResult,
    confidence: number
  }>,
  conclusion
}
```

---

### 6.5 Confidence Scoring

Confidence is reduced by:

* High jitter
* GC detection
* Low sample count

---

## 7. Regression Module (`regression.js`)

### 7.1 Purpose

Detects **performance regressions across runs**.

---

### 7.2 API

```js
BenchmarkJS.regression.record(key, report)
BenchmarkJS.regression.check(key, windowSize?)
```

---

### 7.3 Output

```ts
{
  regression: boolean,
  delta: number,
  reason: string
}
```

---

## 8. Visualization Module (`visualizer.js`)

### 8.1 Purpose

Console-level visualizations (framework-agnostic).

---

### 8.2 API

```js
BenchmarkJS.visualize.distribution(result)
BenchmarkJS.visualize.timeline(result)
```

---

## 9. Timeline UI Module (`timeline-ui.js`)

### 9.1 Purpose

Interactive per-run inspection.

---

### 9.2 API

```js
BenchmarkJS.timeline.mount(
  measurement: BenchmarkResult,
  container: HTMLElement
)
```

---

### 9.3 Features

* Slider-based navigation
* Displays execution time per run
* Indicates GC-affected runs
* Runtime health-checked

---

## 10. Lab UI Module (`lab.js`)

### 10.1 Purpose

Full browser-based performance lab.

---

### 10.2 API

```js
BenchmarkJS.lab.mount(container: HTMLElement)
```

---

### 10.3 Behavior

* Validates DOM readiness
* Requires `window.currentExperiment`
* Executes experiments
* Displays conclusions

---

## 11. Modern UI (Optional Product Layer)

### Views:

* Experiment Lab
* Timeline Scrubber
* Regression Viewer
* Health Report

---

## 12. Failure Modes & Guarantees

| Condition          | Behavior           |
| ------------------ | ------------------ |
| DOM not ready      | Fatal health error |
| Missing experiment | Soft warning       |
| GC detected        | Marked, not hidden |
| High jitter        | Confidence reduced |

---

## 13. Non-Goals

BenchmarkJS is **not**:

* A profiler replacement
* A production telemetry system
* A deterministic timing oracle

---

## 14. Rebuild Checklist (AI or Human)

To recreate BenchmarkJS exactly:

1. Implement RuntimeHealth
2. Implement Core Engine
3. Add plugin system
4. Implement Research Module
5. Implement Regression Module
6. Implement Timeline UI
7. Implement Lab UI
8. Add Modern UI shell
9. Bundle all modules
10. Validate via quick-demo.html

---

## 15. Final Statement

> **BenchmarkJS is a reasoning system for performance, not a stopwatch.**

---
