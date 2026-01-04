# BenchmarkJS Component - Complete Index

## 📦 Component Overview

BenchmarkJS is a comprehensive browser-native performance research and diagnostics platform. It measures, diagnoses, visualizes, and reasons about JavaScript execution performance under real browser conditions.

**Key Philosophy:** *Measurement ≠ Understanding. Raw timings are meaningless without diagnostics.*

## 📂 File Structure

```
components/benchmark/
├── Core Engine
│   ├── benchmark.js          # Core measurement engine (~6KB)
│   ├── runtime-health.js     # Generic diagnostics framework (~2KB)
│   └── research.js           # Scientific experiment framework (~3KB)
│
├── Additional Modules
│   ├── regression.js         # Performance regression detection (~2KB)
│   └── visualizer.js         # Console-level visualizations (~4KB)
│
├── UI Components
│   ├── timeline-ui.js        # Interactive timeline viewer (~3KB)
│   ├── lab.js                # Full performance lab (~4KB)
│   ├── lab.html              # Lab UI template
│   └── lab.css               # Lab styling (~8KB)
│
├── Example/Demo
│   ├── example.html          # Interactive playground (~8KB)
│   ├── example.js            # Demo logic & samples (~12KB)
│   ├── example.css           # Playground styling (~8KB)
│   └── EXAMPLE-GUIDE.md      # Detailed usage guide
│
└── Documentation
    ├── README.md             # Component overview & API docs
    ├── EXAMPLE-GUIDE.md      # Example page walkthrough
    └── specs.md              # Complete product specification
```

## 🎯 Quick Start

### 1. Basic Benchmarking

```html
<!-- Load BenchmarkJS -->
<script src="benchmark.js"></script>
<script src="visualizer.js"></script>

<script>
  // Simple benchmark
  const result = await BenchmarkJS.benchmark(() => {
    let sum = 0;
    for (let i = 0; i < 1000; i++) sum += i;
  });

  // Visualize
  BenchmarkJS.visualize.summary(result);
  BenchmarkJS.visualize.distribution(result);
</script>
```

### 2. Use the Interactive Example

```html
<!-- Open example.html in browser -->
<!-- Click "Load Sample" → Select function → Click "Run Benchmark" -->
```

### 3. Scientific Experiments

```javascript
// Define experiment
window.currentExperiment = {
  name: 'Array Methods Comparison',
  variables: {
    method: ['map', 'filter', 'forEach'],
    size: [100, 1000, 10000]
  },
  setup(vars) {
    const arr = Array(vars.size).fill(0);
    if (vars.method === 'map') {
      return () => arr.map(x => x * 2);
    }
    // ... other methods
  }
};

// Run
const report = await BenchmarkJS.experiment(window.currentExperiment);
```

## 📚 Module Documentation

### Core Engine (`benchmark.js`)

**Global Object:** `window.BenchmarkJS`

**Key Methods:**
- `naiveBenchmark(fn)` - Basic timing with Date.now()
- `timeOnce(fn)` - High-resolution single execution
- `benchmark(fn, options)` - Full statistical measurement
- `benchmarkAsync(fn, runs)` - Async function benchmarking
- `measureEventLoopDelay(samples)` - Measure scheduler jitter
- `setConfig(options)` - Configure behavior

**Configuration:**
```javascript
BenchmarkJS.setConfig({
  autoRejectGCPollutedRuns: true,
  autoDiscardOutliers: true,
  gcSensitivityMultiplier: 1.5
});
```

**Result Object:**
```javascript
{
  rawSamples: number[],              // All measurements
  samples: number[],                 // Filtered measurements
  avg: number,                       // Average execution time
  min: number,                       // Minimum
  max: number,                       // Maximum
  std: number,                       // Standard deviation
  jitter: {                         // Jitter analysis
    jitterScore: number,
    classification: 'low|moderate|high',
    coefficientOfVariation: number,
    outliers: Array
  },
  gc: {                             // GC pause analysis
    detected: boolean,
    pauses: Array<{
      index: number,
      duration: number,
      confidence: number
    }>
  }
}
```

### Runtime Health (`runtime-health.js`)

Generic diagnostics utility for any project.

```javascript
const health = new RuntimeHealth({ strict: false });

health
  .addCheck('DOM Ready', () => document.readyState !== 'loading')
  .addCheck('API Available', () => fetch !== undefined, { fatal: true })
  .addCheck('Async Check', async () => {
    const resp = await fetch('/ping');
    return resp.ok;
  });

await health.run();
console.log(health.summary());
```

### Research Module (`research.js`)

Scientific experiment framework.

```javascript
const report = await BenchmarkJS.experiment({
  name: 'Algorithm Study',
  variables: {
    size: [100, 1000, 10000],
    algorithm: ['bubble', 'merge', 'quick']
  },
  setup(vars) {
    // Return a function that implements the algorithm
    return () => { /* algorithm */ };
  },
  benchmark: {
    warmup: 10,
    iterations: 100,
    runs: 5
  }
});

// Results include confidence scoring
console.log(report.results[0].confidence); // 0-1 score
```

### Regression Module (`regression.js`)

Track performance over time.

```javascript
// Record baseline
const baseline = await BenchmarkJS.benchmark(testFn);
BenchmarkJS.regression.record('array-sort', baseline);

// Later, check for regressions
const check = BenchmarkJS.regression.check('array-sort');
if (check.regression) {
  console.warn(`Regression: ${check.reason}`);
}

// View history
const history = BenchmarkJS.regression.getHistory('array-sort', 10);
console.log(history); // Last 10 runs
```

### Visualizer (`visualizer.js`)

Console visualizations.

```javascript
// Distribution histogram
BenchmarkJS.visualize.distribution(result);

// Execution timeline
BenchmarkJS.visualize.timeline(result);

// Comparison chart
BenchmarkJS.visualize.comparison([result1, result2], 
  ['Method A', 'Method B']);

// Jitter analysis
BenchmarkJS.visualize.jitter(result.jitter);

// GC analysis
BenchmarkJS.visualize.gc(result.gc);

// Summary card
BenchmarkJS.visualize.summary(result);
```

### Timeline UI (`timeline-ui.js`)

Interactive per-run inspection.

```javascript
const result = await BenchmarkJS.benchmark(testFn, { runs: 10 });
const container = document.getElementById('timeline');

// Mount interactive timeline
BenchmarkJS.timeline.mount(result, container);

// Features:
// - Slider to navigate through runs
// - Per-run metrics display
// - GC detection visualization
// - Click to select specific run
```

### Lab UI (`lab.js`, `lab.html`, `lab.css`)

Full browser-based performance lab.

```javascript
// Load template
const template = document.getElementById('lab-template');
const clone = template.content.cloneNode(true);
const container = document.getElementById('lab-container');
container.appendChild(clone);

// Mount lab
BenchmarkJS.lab.mount(container);

// Define experiment
window.currentExperiment = { /* ... */ };

// Click "Run Experiment" button in UI
```

## 🎮 Example Page Features

### Pre-populated Functions (20+)
- Array operations (map, filter, sort, reduce, some)
- String operations (split, replace, match)
- Object operations (keys, values, entries, assign)
- Math operations (loops, sqrt, fibonacci)
- Advanced (JSON parse/stringify, regex)

### Three Test Modes
1. **Basic Benchmark** - Single function measurement
2. **Experiment** - Multi-variable scientific testing
3. **Regression** - Performance tracking over time

### Interactive Results
- Summary metrics grid
- Interactive timeline with slider
- Jitter analysis
- GC detection
- Console output
- Tab-based navigation

### User-Friendly Controls
- Dropdown to select pre-populated samples
- Custom function input with validation
- Configurable benchmark options
- Variable definition for experiments
- Real-time validation messages

## 📊 Key Diagnostics

### Jitter Detection
Measures event loop jitter using:
- Coefficient of Variation (%)
- Classification (low/moderate/high)
- MAD-based outlier detection

```
Low:      < 5%       ✓ Clean measurement
Moderate: 5-15%      ~ Some noise
High:     > 15%      ⚠️ Noisy environment
```

### GC Pause Detection
Heuristically detects garbage collection:
- Identifies outlier execution times
- Correlates with event loop delays
- Provides confidence scores (0-1)
- Automatic filtering optional

### Confidence Scoring
Reduced by:
- High jitter (coefficient of variation)
- GC pause detection
- Low sample count
- Result: 0-1 confidence value

## 🔄 Typical Workflows

### Workflow 1: Quick Benchmark
```
1. example.html → Select sample
2. Click "Load Sample"
3. Click "Run Benchmark"
4. View results → Timeline → Diagnostics
```

### Workflow 2: Algorithm Comparison
```
1. Switch to "Experiment" mode
2. Define variable: algorithm = [algo1, algo2, algo3]
3. Define variable: size = [100, 1000, 10000]
4. Run experiment
5. Review comparison table and confidence scores
```

### Workflow 3: Regression Monitoring
```
1. Switch to "Regression Tracking" mode
2. Set key: "myfunction-v1"
3. Run benchmark (establishes baseline)
4. Later: Modify function
5. Run benchmark again (detects >10% regression)
```

## 🎨 Customization

### Styling
- `lab.css` - Lab UI styles
- `example.css` - Playground styles
- Both use CSS variables for easy theming

### Configuration
```javascript
// In benchmark.js or via setConfig()
BenchmarkJS.setConfig({
  autoRejectGCPollutedRuns: true,
  autoDiscardOutliers: true,
  gcSensitivityMultiplier: 1.5
});
```

### Adding Custom Functions
Edit `SAMPLE_FUNCTIONS` object in `example.js`:
```javascript
const SAMPLE_FUNCTIONS = {
  'my-custom': {
    name: 'My Custom Test',
    category: 'Custom',
    code: 'let sum = 0; for (let i = 0; i < 10000; i++) sum += i;',
    description: 'Custom benchmark'
  },
  // ... add more
};
```

## 📈 Performance Metrics Explained

| Metric | Description | Good Value |
|--------|-------------|-----------|
| **Average** | Mean execution time | Baseline for comparison |
| **Min** | Fastest execution | Best-case scenario |
| **Max** | Slowest execution | Worst-case scenario |
| **Std Dev** | Standard deviation | Low = consistent |
| **Jitter** | Coefficient of variation % | < 5% = clean |
| **Samples** | Number of measurements | Higher = more confident |
| **Confidence** | Quality score (0-1) | > 0.8 = reliable |
| **GC** | Garbage collection | None detected = clean |

## 🚀 Browser Support

Requires:
- ES6 features (arrow functions, template literals, classes)
- `performance.now()` API
- `Promise` support
- DOM APIs (for UI modules)
- Modern browser (Chrome 51+, Firefox 55+, Safari 10.1+, Edge 15+)

## 📝 File Sizes (Unminified)

| File | Size | Purpose |
|------|------|---------|
| benchmark.js | ~6KB | Core engine |
| runtime-health.js | ~2KB | Health checks |
| research.js | ~3KB | Experiments |
| regression.js | ~2KB | Regression tracking |
| visualizer.js | ~4KB | Visualizations |
| timeline-ui.js | ~3KB | Timeline viewer |
| lab.js | ~4KB | Lab interface |
| lab.css | ~8KB | Lab styles |
| example.html | ~8KB | Playground HTML |
| example.js | ~12KB | Demo functions |
| example.css | ~8KB | Playground styles |
| **Total** | **~60KB** | Complete component |

## 🔗 Related Documentation

- `specs.md` - Complete product specification with architecture
- `README.md` - API reference and module overview
- `EXAMPLE-GUIDE.md` - Detailed example page guide

## 🎓 Learning Path

1. **Beginners:** Open `example.html` → Try samples → Run benchmarks
2. **Intermediate:** Read `README.md` → Use in your project → Create experiments
3. **Advanced:** Read `specs.md` → Extend with plugins → Custom diagnostics

## 📞 Common Questions

**Q: Why is my benchmark jitter high?**
A: Close other applications, disable browser extensions, reduce iterations, or check system CPU usage.

**Q: How do I reduce variance?**
A: Increase warmup runs, increase iterations, or run on a less busy system.

**Q: Can I use this in production?**
A: Use RuntimeHealth for health checks; avoid benchmarking in production.

**Q: How accurate are measurements?**
A: Affected by GC, scheduling, CPU frequency scaling. Treat as relative, not absolute.

**Q: Can I export results?**
A: Yes! Access `window.BenchmarkJS.regression.regressions` or `currentResult` object.

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Complete implementation ✓
