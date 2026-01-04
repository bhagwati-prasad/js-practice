# BenchmarkJS Example Page Guide

## Overview

The example page (`example.html`) is a comprehensive interactive playground for testing JavaScript performance using BenchmarkJS. It provides a user-friendly interface for benchmarking functions with pre-populated samples and custom input options.

## Features

### 📋 Pre-populated Sample Functions (20+ examples)

#### Array Operations
- **Array.map()** - Maps over 1000 elements
- **Array.filter()** - Filters to get even numbers
- **Array.sort()** - Sorts 100 random numbers
- **Array.reduce()** - Sums 1000 elements
- **Array.some()** - Searches in array

#### String Operations
- **String.split()** - Splits a 10KB string
- **String.replace()** - Regex replacement
- **String.match()** - Regex matching
- **String operations** - Substring manipulation

#### Object Operations
- **Object.keys()** - Gets keys from 1000-property object
- **Object.values()** - Gets values
- **Object.entries()** - Gets entries
- **Object.assign()** - Shallow copying

#### Math Operations
- **Math loop** - 10000 trigonometric calculations
- **Math.sqrt()** - 1000 square root calls
- **Fibonacci** - Recursive calculation (fib(30))

#### Advanced
- **JSON.parse()** - Parse 1000 times
- **JSON.stringify()** - Stringify deep objects
- **RegExp.test()** - Email validation regex

### 🎮 Three Test Modes

#### 1. **Basic Benchmark**
Single function performance measurement with configurable:
- Warmup runs (default: 10)
- Iterations per run (default: 100)
- Number of runs (default: 5)
- Auto-reject GC polluted runs
- Auto-discard outliers

**Output:**
- Summary statistics (avg, min, max, std dev)
- Jitter analysis
- GC detection
- Interactive timeline with slider navigation

#### 2. **Experiment Mode**
Scientific testing with multiple variables and combinations:
- Define variable names and values
- Tests all combinations (Cartesian product)
- Confidence scoring (affected by jitter, GC, samples)
- Comparison table
- Best/worst performer identification

**Example:**
```
Variables:
  method: [map, filter, sort]
  size: [100, 1000, 10000]

Results: 9 combinations tested
```

#### 3. **Regression Tracking**
Monitor performance over time:
- Record benchmark results
- Detect regressions (>10% threshold)
- View historical data
- Window-based comparison (default: last 5 runs)

## Interface Layout

```
┌─────────────────────────────────────────────────────────────┐
│           BenchmarkJS Performance Playground               │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────────────┐
│                  │                                         │
│  CONTROL PANEL   │         RESULTS & VISUALIZATION        │
│  (Sidebar)       │                                         │
│                  │  • Summary metrics                     │
│  1. Select Func  │  • Tabs: Results, Timeline,            │
│  2. Custom Func  │    Diagnostics, Console                │
│  3. Test Mode    │  • Interactive timeline               │
│  4. Options      │  • GC/Jitter analysis                 │
│  [Run]           │  • Export results                      │
│                  │                                         │
└──────────────────┴─────────────────────────────────────────┘
```

## How to Use

### Quick Start

1. **Load a Sample:**
   - Click "Pre-populated Functions" dropdown
   - Select any sample
   - Click "Load Sample" button

2. **Run Benchmark:**
   - Click "▶ Run Benchmark" button
   - Wait for results

3. **View Results:**
   - Check "Results" tab for summary
   - Switch to "Timeline" for per-run visualization
   - Check "Diagnostics" for jitter/GC analysis
   - View "Console" for detailed output

### Custom Function

```javascript
// Enter function body (no wrapping needed)
let sum = 0;
for (let i = 0; i < 1000; i++) {
  sum += i;
}
return sum;
```

Then click "Validate Function" before running.

### Running Experiments

1. Switch to "Experiment (Variables)" mode
2. Define variables in the form:
   ```
   arraySize: 100, 1000, 10000
   method: map, filter, sort
   ```
3. Click "+ Add Variable" for more
4. Click "▶ Run Benchmark"

### Regression Tracking

1. Switch to "Regression Tracking" mode
2. Enter a unique benchmark key (e.g., "array-sort-v1")
3. Run benchmark multiple times
4. System automatically detects regressions >10%

## Result Tabs

### Results Tab
- Summary statistics
- Confidence levels
- Jitter classification
- GC detection status

### Timeline Tab
- Interactive slider to inspect each run
- Per-run execution time
- Comparison to average
- GC detection per run

### Diagnostics Tab
- **Jitter Analysis:**
  - Jitter score (coefficient of variation %)
  - Classification (low/moderate/high)
  - Top outliers

- **GC Analysis:**
  - Number of pauses detected
  - Duration of each pause
  - Confidence levels

### Console Tab
- Real-time console output
- Visualization summaries
- Debug information

## Configuration Options

### Benchmark Options
- **Warmup Runs:** Number of execution before measurement (eliminates JIT warmup)
- **Iterations:** How many times the function runs per measurement
- **Runs:** Number of independent measurements
- **Auto-reject GC:** Remove samples affected by garbage collection
- **Auto-discard Outliers:** Remove statistical outliers (MAD-based)

### Experiment Options
- **Experiment Name:** Label for the experiment
- **Variables:** Comma-separated value lists for each variable

### Regression Options
- **Benchmark Key:** Unique identifier for tracking
- **Comparison Window:** Number of recent runs to compare

## Tips & Tricks

### 1. Warmup Runs
Higher warmup = better JIT optimization representation
- Small functions: 5-10 warmup
- Complex functions: 20+ warmup

### 2. Sample Size
- More runs = more statistical confidence
- Runs × Iterations × warmup = total execution time
- Balance accuracy with execution time

### 3. Jitter Classification
- **Low** (<5%): Clean measurement, high confidence
- **Moderate** (5-15%): Some system noise, medium confidence
- **High** (>15%): Noisy environment, lower confidence

### 4. GC Detection
- Yellow ⚠️ marker indicates GC-affected run
- System can auto-filter or keep these samples
- Multiple GC pauses suggest:
  - Large allocations in function
  - System under memory pressure
  - Allocation-heavy algorithm

### 5. Regression Threshold
Default is 10% - can be customized in regression.js

## Keyboard Shortcuts

- **Enter** in most inputs: Validate/Load
- **Escape** to clear messages

## Data Export

Results are stored in:
- `currentResult` - Latest benchmark result
- `window.currentExperiment` - Experiment definition
- Console output in "Console" tab

Use browser DevTools to export results as JSON.

## Example Workflows

### Workflow 1: Quick Comparison
```
1. Select Array.map sample
2. Run basic benchmark
3. Select Array.filter sample
4. Run basic benchmark
5. Compare results in console
```

### Workflow 2: Algorithm Optimization
```
1. Enter your algorithm
2. Validate function
3. Run basic benchmark (baseline)
4. Modify algorithm
5. Validate again
6. Switch to regression mode with same key
7. Run benchmark
8. System shows improvement/regression %
```

### Workflow 3: Comprehensive Study
```
1. Define multi-variable experiment
2. Run experiment mode
3. Review results table
4. Check confidence scores
5. Identify best performer
6. Export results for report
```

## Browser Requirements

- Modern browser with ES6 support
- `performance.now()` API
- `Promise` support
- At least 512MB RAM (for large experiments)

## Troubleshooting

### Function Won't Validate
- Check syntax (missing semicolons, brackets)
- Use simple return values
- Avoid global variable dependencies

### High Jitter (>15%)
- Close other applications
- Disable browser extensions
- Reduce iterations if taking too long
- Check system CPU usage

### GC Detected on Simple Functions
- May be system GC, not function issue
- Run more times to average it out
- Check memory pressure on system

### Regression Not Detecting
- Need at least 2 runs for history
- Delta must be >10%
- Check regression key matches previous runs

## See Also

- `specs.md` - Complete product specification
- `README.md` - BenchmarkJS documentation
- `benchmark.js` - Core engine implementation
- `research.js` - Experiment framework
- `regression.js` - Regression tracking

---

**Happy Benchmarking! 🚀**
