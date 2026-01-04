# BenchmarkJS - Performance Research Platform

A comprehensive browser-native performance research and diagnostics tool following the specifications in `specs.md`.

## Module Structure

### Core Modules

- **`benchmark.js`** - Core measurement engine with timing APIs, jitter/GC detection
  - `BenchmarkJS.naiveBenchmark(fn)` - Basic timing with `Date.now()`
  - `BenchmarkJS.timeOnce(fn)` - High-resolution single execution
  - `BenchmarkJS.benchmark(fn, options)` - Full statistical measurement
  - `BenchmarkJS.benchmarkAsync(fn, runs)` - Async function benchmarking

- **`runtime-health.js`** - Generic runtime diagnostics (reusable)
  - `RuntimeHealth` class for defining and running health checks
  - Integration with lab UI for pre-execution validation

- **`research.js`** - Scientific experiment framework
  - `BenchmarkJS.experiment(definition)` - Run multi-variable experiments
  - Confidence scoring based on measurement quality
  - Cartesian product variable combinations

- **`regression.js`** - Performance regression detection
  - `BenchmarkJS.regression.record(key, report)` - Track results
  - `BenchmarkJS.regression.check(key)` - Detect regressions
  - Historical tracking and reporting

- **`visualizer.js`** - Console-level visualizations
  - `BenchmarkJS.visualize.distribution(result)` - Histogram display
  - `BenchmarkJS.visualize.timeline(result)` - Execution timeline
  - `BenchmarkJS.visualize.comparison(results)` - Compare benchmarks
  - `BenchmarkJS.visualize.jitter(analysis)` - Jitter analysis
  - `BenchmarkJS.visualize.gc(analysis)` - GC pause analysis

### UI Modules

- **`timeline-ui.js`** - Interactive per-run inspection
  - `BenchmarkJS.timeline.mount(measurement, container)` - Mount UI
  - Slider-based navigation through runs
  - GC detection visualization
  - Per-run performance metrics

- **`lab.js`** + **`lab.html`** + **`lab.css`** - Full performance lab interface
  - `BenchmarkJS.lab.mount(container)` - Initialize lab UI
  - Experiment runner with visual results
  - Tab-based navigation (Results, Timeline, Diagnostics)
  - DOM health checks before execution
  - Export functionality for results

## Usage

### Basic Benchmarking

```javascript
// Load modules
<script src="benchmark.js"></script>
<script src="runtime-health.js"></script>
<script src="visualizer.js"></script>

// Simple benchmark
const result = await BenchmarkJS.benchmark(() => {
  // Code to measure
  let sum = 0;
  for (let i = 0; i < 1000; i++) sum += i;
}, {
  warmup: 10,
  iterations: 100,
  runs: 5
});

// Visualize results
BenchmarkJS.visualize.summary(result);
BenchmarkJS.visualize.distribution(result);
BenchmarkJS.visualize.timeline(result);
```

### Scientific Experiments

```javascript
// Define experiment
window.currentExperiment = {
  name: 'Array Methods Comparison',
  variables: {
    method: ['map', 'forEach', 'for'],
    size: [100, 1000, 10000]
  },
  setup(vars) {
    const arr = Array(vars.size).fill(0).map((_, i) => i);
    
    if (vars.method === 'map') {
      return () => arr.map(x => x * 2);
    } else if (vars.method === 'forEach') {
      return () => arr.forEach(x => x * 2);
    } else {
      return () => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] * 2;
        }
      };
    }
  },
  benchmark: { iterations: 100, runs: 5 }
};

// Run lab UI
const container = document.getElementById('lab');
BenchmarkJS.lab.mount(container);
```

### Performance Regression Tracking

```javascript
// Record baseline
const baseline = await BenchmarkJS.benchmark(testFn);
BenchmarkJS.regression.record('array-sort', baseline);

// Later, check for regressions
const check = BenchmarkJS.regression.check('array-sort');
if (check.regression) {
  console.warn('Performance regression detected:', check.reason);
}
```

### Using Timeline UI

```javascript
const result = await BenchmarkJS.benchmark(testFn, { runs: 10 });
const container = document.getElementById('timeline');
BenchmarkJS.timeline.mount(result, container);
```

## Key Features

### Noise-Aware Measurement
- **Event loop jitter detection** - Measures scheduling delays
- **GC pause heuristics** - Correlates high execution times with garbage collection
- **MAD-based outlier detection** - Removes statistical anomalies
- **Confidence scoring** - Reduces confidence for noisy measurements

### Diagnostics
- Jitter classification (low/moderate/high)
- GC pause detection with confidence levels
- Sample filtering (automated or manual)
- Statistical aggregation

### Visualization
- ASCII histograms and timelines in console
- Interactive timeline UI with slider navigation
- Comparison charts for multiple benchmarks
- Detailed diagnostic displays

### Extensibility
- Plugin system for adding custom functionality
- Modular architecture with clear dependencies
- Health check framework for validation
- Exportable results in JSON format

## Configuration

```javascript
BenchmarkJS.setConfig({
  autoRejectGCPollutedRuns: true,      // Auto-filter GC-affected samples
  autoDiscardOutliers: true,            // Remove statistical outliers
  gcSensitivityMultiplier: 1.5          // GC detection threshold
});
```

## File Sizes

All modules are lightweight and designed for in-browser use:
- Core engine: ~6KB
- Individual modules: ~2-4KB each
- Styling: ~8KB
- Total with UI: ~30KB unminified

## Browser Support

Requires:
- `performance.now()` API
- `Promise` support
- ES6 features (arrow functions, template literals)
- DOM APIs for UI modules

## Related

See `specs.md` for the complete product specification and architecture details.
