/**
 * Lab UI Module
 * Full browser-based performance lab for running experiments
 */

class LabUI {
  constructor() {
    this.container = null;
    this.currentExperiment = null;
    this.isRunning = false;
  }

  /**
   * Mount lab UI to a container
   * @param {HTMLElement} container - DOM container
   */
  mount(container) {
    if (!container) {
      throw new Error('Lab UI requires a container element');
    }

    this.container = container;

    // Validate DOM readiness
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._initialize());
    } else {
      this._initialize();
    }
  }

  /**
   * Initialize the lab UI
   */
  _initialize() {
    // Run health check
    this._runHealthCheck();

    // Render UI
    this._render();
  }

  /**
   * Run health check
   */
  async _runHealthCheck() {
    const health = new RuntimeHealth({ strict: false });
    
    health.addCheck('DOM Ready', () => document.readyState !== 'loading');
    health.addCheck('BenchmarkJS Loaded', () => window.BenchmarkJS !== undefined);
    health.addCheck('Performance API', () => window.performance !== undefined);
    health.addCheck('Experiment Defined', () => window.currentExperiment !== undefined, { fatal: false });

    const results = await health.run();
    return results;
  }

  /**
   * Render the lab UI
   */
  _render() {
    this.container.innerHTML = '';
    this.container.className = 'lab-container';

    // Create main sections
    const header = this._createHeader();
    const controls = this._createControls();
    const output = this._createOutput();

    this.container.appendChild(header);
    this.container.appendChild(controls);
    this.container.appendChild(output);
  }

  /**
   * Create header section
   */
  _createHeader() {
    const header = document.createElement('div');
    header.className = 'lab-header';
    header.innerHTML = `
      <h1 class="lab-title">🧪 Performance Lab</h1>
      <p class="lab-subtitle">Browser-native performance research & diagnostics</p>
    `;
    return header;
  }

  /**
   * Create controls section
   */
  _createControls() {
    const controls = document.createElement('div');
    controls.className = 'lab-controls';

    const runButton = document.createElement('button');
    runButton.className = 'lab-btn lab-btn-primary';
    runButton.textContent = 'Run Experiment';
    runButton.addEventListener('click', () => this._runExperiment());

    const resetButton = document.createElement('button');
    resetButton.className = 'lab-btn lab-btn-secondary';
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => this._reset());

    controls.appendChild(runButton);
    controls.appendChild(resetButton);

    return controls;
  }

  /**
   * Create output section
   */
  _createOutput() {
    const output = document.createElement('div');
    output.className = 'lab-output';
    output.id = 'lab-output';
    output.innerHTML = '<p class="placeholder">Ready to run experiments...</p>';
    return output;
  }

  /**
   * Run the experiment
   */
  async _runExperiment() {
    const output = this.container.querySelector('#lab-output');
    
    if (!window.currentExperiment) {
      output.innerHTML = `
        <div class="error-message">
          ❌ No experiment defined. Set <code>window.currentExperiment</code>
        </div>
      `;
      return;
    }

    this.isRunning = true;
    output.innerHTML = '<p class="loading">⏳ Running experiment...</p>';

    try {
      const report = await window.BenchmarkJS.experiment(window.currentExperiment);
      this.currentExperiment = report;
      this._displayResults(report);
    } catch (error) {
      output.innerHTML = `
        <div class="error-message">
          ❌ Error: ${error.message}
        </div>
      `;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Display results
   */
  _displayResults(report) {
    const output = this.container.querySelector('#lab-output');
    const { meta, results, conclusion, summary } = report;

    let html = `
      <div class="results-container">
        <div class="results-header">
          <h2>${meta.name}</h2>
          <p class="timestamp">${new Date(meta.timestamp).toLocaleString()}</p>
        </div>

        <div class="results-summary">
          <h3>Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Total Runs:</span>
              <span class="value">${results.length}</span>
            </div>
            <div class="summary-item">
              <span class="label">Average Confidence:</span>
              <span class="value">${(summary.averageConfidence * 100).toFixed(1)}%</span>
            </div>
    `;

    if (summary.bestPerformer) {
      html += `
        <div class="summary-item">
          <span class="label">Best:</span>
          <span class="value">${summary.bestPerformer.measurement.avg.toFixed(3)}ms</span>
        </div>
      `;
    }

    if (summary.worstPerformer) {
      html += `
        <div class="summary-item">
          <span class="label">Worst:</span>
          <span class="value">${summary.worstPerformer.measurement.avg.toFixed(3)}ms</span>
        </div>
      `;
    }

    html += `
          </div>
        </div>

        <div class="results-conclusion">
          <h3>Conclusion</h3>
          <pre>${conclusion}</pre>
        </div>

        <div class="results-detailed">
          <h3>Detailed Results</h3>
          <table class="results-table">
            <thead>
              <tr>
                <th>Variables</th>
                <th>Avg (ms)</th>
                <th>Min (ms)</th>
                <th>Max (ms)</th>
                <th>Jitter</th>
                <th>GC</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
    `;

    results.forEach(result => {
      if (result.error) {
        html += `
          <tr class="error-row">
            <td>${JSON.stringify(result.variables)}</td>
            <td colspan="6" class="error-text">Error: ${result.error}</td>
          </tr>
        `;
      } else {
        const vars = Object.entries(result.variables)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ');
        const jitterClass = result.measurement.jitter?.classification || 'N/A';
        const gcDetected = result.measurement.gc?.detected ? '⚠️' : '✓';
        const confidence = (result.confidence * 100).toFixed(0);

        html += `
          <tr>
            <td class="variables">${vars}</td>
            <td>${result.measurement.avg.toFixed(3)}</td>
            <td>${result.measurement.min.toFixed(3)}</td>
            <td>${result.measurement.max.toFixed(3)}</td>
            <td>${jitterClass}</td>
            <td>${gcDetected}</td>
            <td>${confidence}%</td>
          </tr>
        `;
      }
    });

    html += `
            </tbody>
          </table>
        </div>

        <div class="results-actions">
          <button class="lab-btn lab-btn-secondary" onclick="this.parentElement.nextElementSibling.style.display='block'">
            View Raw Data
          </button>
        </div>

        <div class="results-raw" style="display: none;">
          <pre>${JSON.stringify(report, null, 2)}</pre>
        </div>
      </div>
    `;

    output.innerHTML = html;
  }

  /**
   * Reset the lab
   */
  _reset() {
    this.currentExperiment = null;
    this.isRunning = false;
    const output = this.container.querySelector('#lab-output');
    output.innerHTML = '<p class="placeholder">Ready to run experiments...</p>';
  }

  /**
   * Export current results
   */
  exportResults() {
    if (!this.currentExperiment) {
      return null;
    }

    return {
      timestamp: new Date().toISOString(),
      report: this.currentExperiment
    };
  }
}

// Add lab to BenchmarkJS
window.BenchmarkJS.lab = new LabUI();

// Export class
window.LabUI = LabUI;
