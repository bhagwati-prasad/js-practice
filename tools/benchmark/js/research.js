/**
 * Research Module
 * Adds scientific experiment structure to BenchmarkJS
 * Enables variable-based performance research with confidence scoring
 */

class ExperimentResearch {
  /**
   * Create and run a scientific experiment
   * @param {Object} definition - Experiment definition
   */
  async runExperiment(definition) {
    const {
      name = 'Unnamed Experiment',
      variables = {},
      setup,
      benchmark: benchmarkOptions = {}
    } = definition;

    if (typeof setup !== 'function') {
      throw new Error('Experiment must have a setup() function');
    }

    // Generate variable combinations
    const variableKeys = Object.keys(variables);
    const variableValues = variableKeys.map(key => variables[key]);
    const combinations = this._generateCombinations(variableValues);

    const results = [];
    const environment = {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      platform: navigator.platform
    };

    // Run benchmark for each variable combination
    for (const combo of combinations) {
      const variableMap = {};
      variableKeys.forEach((key, index) => {
        variableMap[key] = combo[index];
      });

      try {
        // Get setup function for this combination
        const testFn = setup(variableMap);
        
        if (typeof testFn !== 'function') {
          throw new Error('setup() must return a function');
        }

        // Run benchmark
        const measurement = await window.BenchmarkJS.benchmark(
          testFn,
          benchmarkOptions
        );

        // Calculate confidence score
        const confidence = this._calculateConfidence(measurement);

        results.push({
          variables: variableMap,
          measurement,
          confidence
        });
      } catch (error) {
        results.push({
          variables: variableMap,
          error: error.message,
          confidence: 0
        });
      }
    }

    // Generate conclusions
    const conclusion = this._generateConclusion(results, variableKeys);

    const report = {
      meta: {
        name,
        timestamp: environment.timestamp,
        environment,
        totalCombinations: combinations.length
      },
      results,
      conclusion,
      summary: {
        bestPerformer: this._findBestPerformer(results),
        worstPerformer: this._findWorstPerformer(results),
        averageConfidence: results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length
      }
    };

    return report;
  }

  /**
   * Calculate confidence score based on measurement quality
   */
  _calculateConfidence(measurement) {
    let confidence = 1.0;

    // Reduce confidence for high jitter
    if (measurement.jitter?.classification === 'high') {
      confidence *= 0.6;
    } else if (measurement.jitter?.classification === 'moderate') {
      confidence *= 0.8;
    }

    // Reduce confidence for detected GC
    if (measurement.gc?.detected) {
      confidence *= 0.85;
    }

    // Reduce confidence for low sample count
    if (measurement.samples?.length < 5) {
      confidence *= 0.7;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate variable combinations (Cartesian product)
   */
  _generateCombinations(arrays) {
    if (arrays.length === 0) return [[]];

    const [first, ...rest] = arrays;
    const restCombinations = this._generateCombinations(rest);

    return first.flatMap(item =>
      restCombinations.map(combo => [item, ...combo])
    );
  }

  /**
   * Find best performer in results
   */
  _findBestPerformer(results) {
    const validResults = results.filter(r => r.measurement && !r.error);
    if (validResults.length === 0) return null;

    return validResults.reduce((best, current) =>
      current.measurement.avg < best.measurement.avg ? current : best
    );
  }

  /**
   * Find worst performer in results
   */
  _findWorstPerformer(results) {
    const validResults = results.filter(r => r.measurement && !r.error);
    if (validResults.length === 0) return null;

    return validResults.reduce((worst, current) =>
      current.measurement.avg > worst.measurement.avg ? current : worst
    );
  }

  /**
   * Generate human-readable conclusion
   */
  _generateConclusion(results, variableKeys) {
    const validResults = results.filter(r => r.measurement && !r.error);
    if (validResults.length === 0) {
      return 'All experiments failed to complete.';
    }

    const best = this._findBestPerformer(results);
    const worst = this._findWorstPerformer(results);

    if (!best || !worst) {
      return 'Insufficient data to draw conclusions.';
    }

    const improvement = ((worst.measurement.avg - best.measurement.avg) / worst.measurement.avg) * 100;
    const bestVars = Object.entries(best.variables).map(([k, v]) => `${k}=${v}`).join(', ');
    const worstVars = Object.entries(worst.variables).map(([k, v]) => `${k}=${v}`).join(', ');

    return `
      Best performer (${best.confidence.toFixed(2)} confidence):
        Variables: ${bestVars}
        Average time: ${best.measurement.avg.toFixed(3)}ms
      
      Worst performer:
        Variables: ${worstVars}
        Average time: ${worst.measurement.avg.toFixed(3)}ms
      
      Performance gap: ${improvement.toFixed(2)}%
    `.trim();
  }
}

// Add experiment method to BenchmarkJS
window.BenchmarkJS.experiment = async function(definition) {
  const research = new ExperimentResearch();
  return research.runExperiment(definition);
};

// Export class
window.ExperimentResearch = ExperimentResearch;
