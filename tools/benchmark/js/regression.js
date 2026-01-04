/**
 * Regression Module
 * Detects performance regressions across runs
 */

class RegressionTracker {
  constructor(benchmark) {
    this.benchmark = benchmark;
  }

  /**
   * Record a benchmark result for regression tracking
   * @param {string} key - Unique identifier for this benchmark
   * @param {BenchmarkResult} report - Result from benchmark
   */
  record(key, report) {
    this.benchmark.recordRegression(key, report);
  }

  /**
   * Check if there's a regression in performance
   * @param {string} key - Benchmark identifier
   * @param {number} windowSize - Number of recent runs to compare
   */
  check(key, windowSize = 5) {
    const result = this.benchmark.checkRegression(key, windowSize);
    
    if (!result) {
      return {
        regression: false,
        delta: 0,
        reason: 'Insufficient history to determine regression',
        confidence: 0
      };
    }

    return {
      ...result,
      confidence: Math.abs(result.delta) < 5 ? 0.5 : 0.9
    };
  }

  /**
   * Get all recorded regressions
   */
  getHistory(key, limit = 10) {
    const history = this.benchmark.regressions.get(key) || [];
    return history.slice(-limit).map((item, index) => ({
      run: index,
      avg: item.report.avg,
      timestamp: item.timestamp,
      jitterClass: item.report.jitter?.classification,
      gcDetected: item.report.gc?.detected
    }));
  }

  /**
   * Check all recorded benchmarks for regressions
   */
  checkAll(windowSize = 5) {
    const regressions = [];
    
    for (const [key, history] of this.benchmark.regressions) {
      if (history.length >= 2) {
        const check = this.check(key, windowSize);
        if (check.regression) {
          regressions.push({
            key,
            ...check,
            history: this.getHistory(key, windowSize)
          });
        }
      }
    }

    return regressions;
  }

  /**
   * Clear history for a specific key
   */
  clearHistory(key) {
    this.benchmark.regressions.delete(key);
  }

  /**
   * Clear all history
   */
  clearAllHistory() {
    this.benchmark.regressions.clear();
  }

  /**
   * Generate regression report
   */
  generateReport() {
    const allRegressions = this.checkAll();
    const allHistory = Array.from(this.benchmark.regressions.keys());

    return {
      timestamp: new Date().toISOString(),
      totalTracked: allHistory.length,
      totalRegressions: allRegressions.length,
      regressions: allRegressions,
      summary: allRegressions.length > 0
        ? `${allRegressions.length} regression(s) detected`
        : 'No regressions detected'
    };
  }
}

// Add regression API to BenchmarkJS
window.BenchmarkJS.regression = new RegressionTracker(window.BenchmarkJS);

// Export class
window.RegressionTracker = RegressionTracker;
