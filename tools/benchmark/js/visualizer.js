/**
 * Visualizer Module
 * Console-level visualizations (framework-agnostic)
 * Creates ASCII art representations of benchmark data
 */

class BenchmarkVisualizer {
  /**
   * Visualize distribution of samples
   * @param {BenchmarkResult} result - Benchmark result object
   */
  static distribution(result) {
    const { samples, avg, min, max, std } = result;

    if (!samples || samples.length === 0) {
      console.log('No samples to visualize');
      return;
    }

    console.log('\n📊 Performance Distribution');
    console.log('=' .repeat(60));

    // Create histogram
    const histogramBins = 10;
    const binSize = (max - min) / histogramBins;
    const histogram = Array(histogramBins).fill(0);

    samples.forEach(sample => {
      const binIndex = Math.min(
        histogramBins - 1,
        Math.floor((sample - min) / (binSize || 1))
      );
      histogram[binIndex]++;
    });

    const maxCount = Math.max(...histogram);
    const barHeight = 20;

    histogram.forEach((count, index) => {
      const binStart = min + index * binSize;
      const binEnd = binStart + binSize;
      const barLength = Math.round((count / maxCount) * barHeight);
      const bar = '█'.repeat(barLength) + '░'.repeat(barHeight - barLength);

      console.log(`${binStart.toFixed(2)} - ${binEnd.toFixed(2)} │ ${bar} ${count}`);
    });

    // Statistics
    console.log('=' .repeat(60));
    console.log(`Average: ${avg.toFixed(3)}ms`);
    console.log(`Min: ${min.toFixed(3)}ms`);
    console.log(`Max: ${max.toFixed(3)}ms`);
    console.log(`Std Dev: ${std.toFixed(3)}ms`);
    console.log(`Samples: ${samples.length}`);
    console.log();
  }

  /**
   * Visualize timeline of execution
   * @param {BenchmarkResult} result - Benchmark result object
   */
  static timeline(result) {
    const { rawSamples, avg, gc } = result;

    if (!rawSamples || rawSamples.length === 0) {
      console.log('No timeline data to visualize');
      return;
    }

    console.log('\n⏱️  Execution Timeline');
    console.log('=' .repeat(60));

    const maxSample = Math.max(...rawSamples);
    const barWidth = 50;
    const gcIndices = new Set(gc?.pauses?.map(p => p.index) || []);

    rawSamples.forEach((sample, index) => {
      const barLength = Math.round((sample / maxSample) * barWidth);
      const bar = '█'.repeat(barLength);
      const gcMarker = gcIndices.has(index) ? ' ⚠️ GC' : '';

      console.log(
        `Run ${String(index + 1).padStart(3)}: ${bar} ${sample.toFixed(3)}ms${gcMarker}`
      );
    });

    console.log('=' .repeat(60));
    console.log(`Average: ${avg.toFixed(3)}ms`);
    console.log(`Total runs: ${rawSamples.length}`);
    console.log(`GC pauses detected: ${gcIndices.size}`);
    console.log();
  }

  /**
   * Visualize comparison between multiple results
   */
  static comparison(results, labels = []) {
    console.log('\n📈 Benchmark Comparison');
    console.log('=' .repeat(60));

    const maxAvg = Math.max(...results.map(r => r.avg));
    const barWidth = 40;

    results.forEach((result, index) => {
      const label = labels[index] || `Benchmark ${index + 1}`;
      const barLength = Math.round((result.avg / maxAvg) * barWidth);
      const bar = '█'.repeat(barLength);
      const percentage = ((result.avg / maxAvg) * 100).toFixed(1);

      console.log(`${label.padEnd(20)} │ ${bar} ${result.avg.toFixed(3)}ms (${percentage}%)`);
    });

    console.log('=' .repeat(60));
    console.log();
  }

  /**
   * Visualize jitter analysis
   */
  static jitter(jitterAnalysis) {
    const { jitterScore, classification, outliers } = jitterAnalysis;

    console.log('\n🔄 Jitter Analysis');
    console.log('=' .repeat(60));
    console.log(`Jitter Score: ${jitterScore.toFixed(2)}%`);
    console.log(`Classification: ${classification.toUpperCase()}`);
    console.log(`Outliers Detected: ${outliers.length}`);

    if (outliers.length > 0) {
      console.log('\nTop Outliers:');
      outliers.slice(0, 5).forEach((outlier, index) => {
        console.log(`  ${index + 1}. Run #${outlier.index + 1}: ${outlier.value.toFixed(3)}ms`);
      });
    }

    console.log('=' .repeat(60));
    console.log();
  }

  /**
   * Visualize GC analysis
   */
  static gc(gcAnalysis) {
    const { detected, pauses } = gcAnalysis;

    console.log('\n🗑️  Garbage Collection Analysis');
    console.log('=' .repeat(60));
    console.log(`GC Detected: ${detected ? 'YES' : 'NO'}`);
    console.log(`Pause Count: ${pauses.length}`);

    if (pauses.length > 0) {
      console.log('\nDetected GC Pauses:');
      pauses.slice(0, 5).forEach((pause, index) => {
        const confidence = (pause.confidence * 100).toFixed(0);
        console.log(
          `  ${index + 1}. Run #${pause.index + 1}: ${pause.duration.toFixed(3)}ms (${confidence}% confidence)`
        );
      });
    }

    console.log('=' .repeat(60));
    console.log();
  }

  /**
   * Create a summary card
   */
  static summary(result) {
    console.log('\n📋 Benchmark Summary');
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log(`║ Average:  ${String(result.avg.toFixed(3) + 'ms').padEnd(47)} ║`);
    console.log(`║ Min:      ${String(result.min.toFixed(3) + 'ms').padEnd(47)} ║`);
    console.log(`║ Max:      ${String(result.max.toFixed(3) + 'ms').padEnd(47)} ║`);
    console.log(`║ Std Dev:  ${String(result.std.toFixed(3) + 'ms').padEnd(47)} ║`);
    console.log(`║ Samples:  ${String(result.samples.length).padEnd(47)} ║`);
    console.log(`║ Jitter:   ${String(result.jitter.classification.toUpperCase()).padEnd(47)} ║`);
    console.log(`║ GC:       ${String(result.gc.detected ? 'DETECTED' : 'CLEAN').padEnd(47)} ║`);
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log();
  }
}

// Add visualizer to BenchmarkJS
window.BenchmarkJS.visualize = BenchmarkVisualizer;

// Export class
window.BenchmarkVisualizer = BenchmarkVisualizer;
