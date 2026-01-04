/**
 * BenchmarkJS - Core Engine
 * Browser-native performance research tool
 * Measures, diagnoses, visualizes JavaScript execution performance
 */

class BenchmarkJS {
  constructor() {
    this.config = {
      autoRejectGCPollutedRuns: true,
      autoDiscardOutliers: true,
      gcSensitivityMultiplier: 1.5
    };
    
    this.plugins = [];
    this.regressions = new Map();
  }

  /**
   * Configuration API
   */
  setConfig(options) {
    Object.assign(this.config, options);
    return this;
  }

  /**
   * 3.4.1 Naive Benchmark - Uses Date.now() for educational comparison
   */
  naiveBenchmark(fn) {
    const start = Date.now();
    fn();
    const end = Date.now();
    return end - start;
  }

  /**
   * 3.4.2 High-Resolution Timing - Uses performance.now() for single execution
   */
  timeOnce(fn) {
    const start = performance.now();
    fn();
    const end = performance.now();
    return end - start;
  }

  /**
   * 3.4.3 Event Loop Delay Probe
   * Measures scheduling delay by scheduling setTimeout(0)
   */
  async measureEventLoopDelay(samples = 20) {
    const delays = [];
    
    for (let i = 0; i < samples; i++) {
      const start = performance.now();
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const end = performance.now();
      delays.push(end - start);
    }
    
    return delays;
  }

  /**
   * 3.4.4 Synchronous Benchmark
   * Core measurement function with warmup, iterations, and runs
   */
  async benchmark(fn, options = {}) {
    const {
      warmup = 10,
      iterations = 100,
      runs = 5
    } = options;

    // Warmup phase
    for (let i = 0; i < warmup; i++) {
      fn();
    }

    // Measurement phase
    const rawSamples = [];
    
    for (let run = 0; run < runs; run++) {
      const runStart = performance.now();
      
      for (let iter = 0; iter < iterations; iter++) {
        fn();
      }
      
      const runEnd = performance.now();
      rawSamples.push((runEnd - runStart) / iterations);
    }

    // Get event loop delays for GC correlation
    const eventLoopDelays = await this.measureEventLoopDelay();

    // Perform diagnostics
    const jitter = this._analyzeJitter(rawSamples);
    const gc = this._analyzeGCPauses(rawSamples, eventLoopDelays);

    // Filter samples based on configuration
    let samples = [...rawSamples];
    
    if (this.config.autoRejectGCPollutedRuns && gc.detected) {
      samples = this._rejectGCPollutedSamples(samples, gc);
    }
    
    if (this.config.autoDiscardOutliers) {
      samples = this._removeOutliers(samples);
    }

    // Calculate statistics
    const stats = this._calculateStats(samples);

    const result = {
      rawSamples,
      samples,
      ...stats,
      jitter,
      gc
    };

    return result;
  }

  /**
   * 3.4.5 Async Benchmark
   */
  async benchmarkAsync(fn, runs = 5) {
    const rawSamples = [];
    
    // Warmup
    for (let i = 0; i < 2; i++) {
      await fn();
    }

    // Measurement
    for (let run = 0; run < runs; run++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      rawSamples.push(end - start);
    }

    // Diagnostics
    const jitter = this._analyzeJitter(rawSamples);
    const gc = this._analyzeGCPauses(rawSamples, []);

    let samples = [...rawSamples];
    if (this.config.autoRejectGCPollutedRuns && gc.detected) {
      samples = this._rejectGCPollutedSamples(samples, gc);
    }
    if (this.config.autoDiscardOutliers) {
      samples = this._removeOutliers(samples);
    }

    const stats = this._calculateStats(samples);

    return {
      rawSamples,
      samples,
      ...stats,
      jitter,
      gc
    };
  }

  /**
   * 3.5.1 Jitter Analysis
   * Detects event loop jitter using coefficient of variation and MAD
   */
  _analyzeJitter(samples) {
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const std = Math.sqrt(
      samples.reduce((sum, x) => sum + Math.pow(x - avg, 2), 0) / samples.length
    );
    const coefficientOfVariation = (std / avg) * 100;

    // Detect outliers using MAD (Median Absolute Deviation)
    const sorted = [...samples].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const deviations = samples.map(x => Math.abs(x - median)).sort((a, b) => a - b);
    const mad = deviations[Math.floor(deviations.length / 2)];
    const madZscore = 0.6745; // For normal distribution

    const outliers = samples
      .map((value, index) => ({
        index,
        value,
        madScore: Math.abs(value - median) / (mad || 1)
      }))
      .filter(item => item.madScore > 3);

    let classification = 'low';
    if (coefficientOfVariation > 5) classification = 'moderate';
    if (coefficientOfVariation > 15) classification = 'high';

    return {
      jitterScore: coefficientOfVariation,
      classification,
      coefficientOfVariation,
      outliers: outliers.slice(0, 5) // Top 5 outliers
    };
  }

  /**
   * 3.5.2 GC Pause Analysis
   * Heuristically detects garbage collection pauses
   */
  _analyzeGCPauses(samples, eventLoopDelays) {
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const threshold = avg * this.config.gcSensitivityMultiplier;

    const pauses = samples
      .map((value, index) => ({
        index,
        duration: value,
        correlatedEventLoopDelay: eventLoopDelays[index] || null
      }))
      .filter(item => item.duration > threshold)
      .map(item => ({
        ...item,
        confidence: Math.min(
          (item.duration / avg) * 0.5,
          1.0
        )
      }));

    return {
      detected: pauses.length > 0,
      pauses
    };
  }

  /**
   * Remove samples that appear to be GC-polluted
   */
  _rejectGCPollutedSamples(samples, gcAnalysis) {
    const gcIndices = new Set(gcAnalysis.pauses.map(p => p.index));
    return samples.filter((_, index) => !gcIndices.has(index));
  }

  /**
   * Remove outliers using MAD (Median Absolute Deviation)
   */
  _removeOutliers(samples) {
    if (samples.length < 3) return samples;

    const sorted = [...samples].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const deviations = samples.map(x => Math.abs(x - median)).sort((a, b) => a - b);
    const mad = deviations[Math.floor(deviations.length / 2)] || 0;

    return samples.filter(value => {
      if (mad === 0) return true;
      const zscore = Math.abs(value - median) / mad;
      return zscore <= 3;
    });
  }

  /**
   * Calculate statistics from samples
   */
  _calculateStats(samples) {
    if (samples.length === 0) {
      return { avg: 0, min: 0, max: 0, std: 0 };
    }

    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    const std = Math.sqrt(
      samples.reduce((sum, x) => sum + Math.pow(x - avg, 2), 0) / samples.length
    );

    return { avg, min, max, std };
  }

  /**
   * Plugin System - 4.1 Registration
   */
  use(plugin) {
    if (!plugin || typeof plugin.init !== 'function') {
      throw new Error('Plugin must have an init() method');
    }
    this.plugins.push(plugin);
    plugin.init(this);
    return this;
  }

  /**
   * Regression tracking (exposed for regression module)
   */
  recordRegression(key, report) {
    if (!this.regressions.has(key)) {
      this.regressions.set(key, []);
    }
    this.regressions.get(key).push({
      report,
      timestamp: Date.now()
    });
  }

  checkRegression(key, windowSize = 5) {
    const history = this.regressions.get(key) || [];
    if (history.length < 2) return null;

    const recent = history.slice(-windowSize);
    const [baseline, ...current] = recent;
    const baselineAvg = baseline.report.avg;
    const currentAvg = current.reduce((sum, item) => sum + item.report.avg, 0) / current.length;

    return {
      regression: currentAvg > baselineAvg * 1.1,
      delta: ((currentAvg - baselineAvg) / baselineAvg) * 100,
      reason: `Performance ${currentAvg > baselineAvg ? 'degraded' : 'improved'} by ${Math.abs(((currentAvg - baselineAvg) / baselineAvg) * 100).toFixed(2)}%`
    };
  }
}

// Export global instance
window.BenchmarkJS = new BenchmarkJS();
