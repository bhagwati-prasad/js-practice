/**
 * BenchmarkJS Example Page
 * Pre-populated functions and interactive demonstration
 */

// ============================================================================
// SAMPLE FUNCTIONS
// ============================================================================

const SAMPLE_FUNCTIONS = {
  // Array Operations
  'array-map': {
    name: 'Array.map() - 1000 items',
    category: 'Array Operations',
    code: `
      const arr = Array(1000).fill(0).map((_, i) => i);
      arr.map(x => x * 2);
    `,
    description: 'Maps over 1000 elements, doubling each value'
  },

  'array-filter': {
    name: 'Array.filter() - 1000 items',
    category: 'Array Operations',
    code: `
      const arr = Array(1000).fill(0).map((_, i) => i);
      arr.filter(x => x % 2 === 0);
    `,
    description: 'Filters 1000 elements to get even numbers'
  },

  'array-sort': {
    name: 'Array.sort() - 100 items',
    category: 'Array Operations',
    code: `
      const arr = Array(100).fill(0).map(() => Math.random());
      arr.sort((a, b) => a - b);
    `,
    description: 'Sorts 100 random numbers'
  },

  'array-reduce': {
    name: 'Array.reduce() - 1000 items',
    category: 'Array Operations',
    code: `
      const arr = Array(1000).fill(0).map((_, i) => i);
      arr.reduce((sum, x) => sum + x, 0);
    `,
    description: 'Sums up 1000 elements using reduce'
  },

  'array-some': {
    name: 'Array.some() - 1000 items',
    category: 'Array Operations',
    code: `
      const arr = Array(1000).fill(0).map((_, i) => i);
      arr.some(x => x > 500);
    `,
    description: 'Checks if any element is greater than 500'
  },

  // String Operations
  'string-split': {
    name: 'String.split() - 10KB string',
    category: 'String Operations',
    code: `
      const str = Array(2000).fill('word').join(' ');
      str.split(' ');
    `,
    description: 'Splits a large string into words'
  },

  'string-replace': {
    name: 'String.replace() - Regex replace',
    category: 'String Operations',
    code: `
      const str = 'hello world hello universe hello friends';
      str.replace(/hello/g, 'hi');
    `,
    description: 'Replaces all occurrences of "hello" with "hi"'
  },

  'string-match': {
    name: 'String.match() - Regex matching',
    category: 'String Operations',
    code: `
      const str = 'The year is 2024, 2025, and beyond';
      str.match(/\\d{4}/g);
    `,
    description: 'Finds all 4-digit numbers in a string'
  },

  'string-substring': {
    name: 'String operations - substring',
    category: 'String Operations',
    code: `
      const str = 'The quick brown fox jumps over the lazy dog';
      str.substring(4, 9).toUpperCase();
    `,
    description: 'Extracts and uppercases a substring'
  },

  // Object Operations
  'object-keys': {
    name: 'Object.keys() - 1000 props',
    category: 'Object Operations',
    code: `
      const obj = {};
      for (let i = 0; i < 1000; i++) obj['key' + i] = i;
      Object.keys(obj);
    `,
    description: 'Gets all keys from an object with 1000 properties'
  },

  'object-values': {
    name: 'Object.values() - 1000 props',
    category: 'Object Operations',
    code: `
      const obj = {};
      for (let i = 0; i < 1000; i++) obj['key' + i] = i;
      Object.values(obj);
    `,
    description: 'Gets all values from an object with 1000 properties'
  },

  'object-entries': {
    name: 'Object.entries() - 1000 props',
    category: 'Object Operations',
    code: `
      const obj = {};
      for (let i = 0; i < 1000; i++) obj['key' + i] = i;
      Object.entries(obj);
    `,
    description: 'Gets all entries from an object with 1000 properties'
  },

  'object-assign': {
    name: 'Object.assign() - Shallow copy',
    category: 'Object Operations',
    code: `
      const source = { a: 1, b: 2, c: 3, d: 4, e: 5 };
      const target = { x: 10, y: 20 };
      Object.assign(target, source);
    `,
    description: 'Shallow copies properties from source to target'
  },

  // Math Operations
  'math-loop': {
    name: 'Math loop - 10000 iterations',
    category: 'Math Operations',
    code: `
      let sum = 0;
      for (let i = 0; i < 10000; i++) {
        sum += Math.sin(i) * Math.cos(i);
      }
      return sum;
    `,
    description: 'Performs 10000 trigonometric calculations'
  },

  'math-sqrt': {
    name: 'Math.sqrt() - 1000 calls',
    category: 'Math Operations',
    code: `
      let sum = 0;
      for (let i = 1; i <= 1000; i++) {
        sum += Math.sqrt(i);
      }
      return sum;
    `,
    description: 'Calculates square root 1000 times'
  },

  'math-fibonacci': {
    name: 'Fibonacci - 30 iterations',
    category: 'Math Operations',
    code: `
      function fib(n) {
        return n <= 1 ? n : fib(n - 1) + fib(n - 2);
      }
      fib(30);
    `,
    description: 'Recursively calculates the 30th Fibonacci number'
  },

  // Advanced
  'json-parse': {
    name: 'JSON.parse() - 1000 operations',
    category: 'Advanced',
    code: `
      const jsonStr = JSON.stringify({ a: 1, b: 2, c: [1, 2, 3] });
      for (let i = 0; i < 1000; i++) {
        JSON.parse(jsonStr);
      }
    `,
    description: 'Parses JSON 1000 times'
  },

  'json-stringify': {
    name: 'JSON.stringify() - Deep object',
    category: 'Advanced',
    code: `
      const obj = {
        level1: {
          level2: {
            level3: {
              data: [1, 2, 3, 4, 5],
              nested: { a: 1, b: 2, c: 3 }
            }
          }
        }
      };
      JSON.stringify(obj);
    `,
    description: 'Stringifies a deeply nested object'
  },

  'regex-test': {
    name: 'RegExp.test() - Complex pattern',
    category: 'Advanced',
    code: `
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      const emails = ['test@example.com', 'invalid-email', 'user@domain.org'];
      emails.map(email => emailRegex.test(email));
    `,
    description: 'Tests email validation regex on multiple strings'
  }
};

// ============================================================================
// PAGE STATE
// ============================================================================

let currentFunction = null;
let currentResult = null;
let consoleOutput = [];

// ============================================================================
// CONSOLE OVERRIDE
// ============================================================================

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error
};

function setupConsoleCapture() {
  console.log = function(...args) {
    consoleOutput.push(args.map(a => JSON.stringify(a)).join(' '));
    originalConsole.log(...args);
  };

  console.warn = function(...args) {
    consoleOutput.push('[WARN] ' + args.map(a => JSON.stringify(a)).join(' '));
    originalConsole.warn(...args);
  };

  console.error = function(...args) {
    consoleOutput.push('[ERROR] ' + args.map(a => JSON.stringify(a)).join(' '));
    originalConsole.error(...args);
  };
}

function restoreConsole() {
  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Ensure all scripts are loaded before initializing
function initializeWhenReady() {
  if (typeof window.BenchmarkJS === 'undefined' || !window.BenchmarkJS.setConfig) {
    // Scripts not loaded yet, retry
    setTimeout(initializeWhenReady, 50);
    return;
  }
  
  setupConsoleCapture();
  initializeEventListeners();
}

document.addEventListener('DOMContentLoaded', initializeWhenReady);

function initializeEventListeners() {
  // Sample selection
  document.getElementById('sample-select').addEventListener('change', (e) => {
    if (e.target.value) {
      const sample = SAMPLE_FUNCTIONS[e.target.value];
      if (sample) {
        document.getElementById('custom-function').value = sample.code.trim();
        currentFunction = sample;
      }
    }
  });

  document.getElementById('load-sample-btn').addEventListener('click', loadSample);

  // Custom function validation
  document.getElementById('validate-function-btn').addEventListener('click', validateFunction);

  // Test mode change
  document.querySelectorAll('input[name="test-mode"]').forEach(radio => {
    radio.addEventListener('change', updateTestMode);
  });

  // Variable management
  document.getElementById('add-variable-btn').addEventListener('click', addVariable);
  document.getElementById('variables-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove-var')) {
      e.target.closest('.variable-input').remove();
    }
  });

  // Action buttons
  document.getElementById('run-benchmark-btn').addEventListener('click', runBenchmark);
  document.getElementById('reset-all-btn').addEventListener('click', resetAll);
  document.getElementById('clear-history-btn').addEventListener('click', clearRegressionHistory);

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', switchTab);
  });
}

// ============================================================================
// FUNCTION MANAGEMENT
// ============================================================================

function loadSample() {
  const select = document.getElementById('sample-select');
  const value = select.value;

  if (!value) {
    showValidationMessage('Please select a sample function', 'error');
    return;
  }

  const sample = SAMPLE_FUNCTIONS[value];
  document.getElementById('custom-function').value = sample.code.trim();
  currentFunction = sample;
  showValidationMessage(`Loaded: ${sample.name}`, 'success');
}

function validateFunction() {
  const code = document.getElementById('custom-function').value.trim();

  if (!code) {
    showValidationMessage('Function code cannot be empty', 'error');
    return;
  }

  try {
    // Test if code can be wrapped in a function
    const testFn = new Function(code);
    testFn(); // Try to execute
    currentFunction = {
      name: 'Custom Function',
      code: code,
      description: 'User-defined function'
    };
    showValidationMessage('✓ Function is valid and ready to test', 'success');
  } catch (error) {
    showValidationMessage(`✗ Invalid function: ${error.message}`, 'error');
    currentFunction = null;
  }
}

function showValidationMessage(message, type) {
  const msgEl = document.getElementById('validation-message');
  msgEl.textContent = message;
  msgEl.className = `validation-message ${type}`;
  msgEl.style.display = 'block';

  if (type === 'success') {
    setTimeout(() => {
      msgEl.style.display = 'none';
    }, 3000);
  }
}

// ============================================================================
// TEST MODE MANAGEMENT
// ============================================================================

function updateTestMode(e) {
  const mode = e.target.value;

  // Toggle visibility of option sections
  document.getElementById('basic-options').style.display = 
    mode === 'basic' ? 'block' : 'none';
  document.getElementById('experiment-options').style.display = 
    mode === 'experiment' ? 'block' : 'none';
  document.getElementById('regression-options').style.display = 
    mode === 'regression' ? 'block' : 'none';
}

function addVariable() {
  const container = document.getElementById('variables-container');
  const varInput = document.createElement('div');
  varInput.className = 'variable-input';
  varInput.innerHTML = `
    <input type="text" class="var-name" placeholder="Variable name" value="newVar">
    <input type="text" class="var-values" placeholder="Values (comma separated)" value="1,2,3">
    <button class="btn-remove-var" type="button">✕</button>
  `;
  container.appendChild(varInput);
}

// ============================================================================
// BENCHMARK EXECUTION
// ============================================================================

async function runBenchmark() {
  // Validation
  if (!currentFunction) {
    showValidationMessage('Please load or validate a function first', 'error');
    return;
  }

  const testMode = document.querySelector('input[name="test-mode"]:checked').value;

  // Show status
  showStatus(`🏃 Running ${testMode} benchmark...`);
  document.getElementById('run-benchmark-btn').disabled = true;
  consoleOutput = [];

  try {
    if (testMode === 'basic') {
      await runBasicBenchmark();
    } else if (testMode === 'experiment') {
      await runExperiment();
    } else if (testMode === 'regression') {
      await runRegressionTest();
    }

    showStatus('✓ Benchmark completed successfully!');
  } catch (error) {
    showStatus(`✗ Benchmark failed: ${error.message}`);
    console.error(error);
  } finally {
    document.getElementById('run-benchmark-btn').disabled = false;
  }
}

async function runBasicBenchmark() {
  // Get options
  const warmup = parseInt(document.getElementById('warmup-input').value);
  const iterations = parseInt(document.getElementById('iterations-input').value);
  const runs = parseInt(document.getElementById('runs-input').value);
  const autoRejectGC = document.getElementById('auto-reject-gc').checked;
  const autoDiscardOutliers = document.getElementById('auto-discard-outliers').checked;

  // Ensure BenchmarkJS is loaded
  if (!window.BenchmarkJS || !window.BenchmarkJS.setConfig) {
    showStatus('✗ Error: BenchmarkJS not properly loaded. Please reload the page.');
    document.getElementById('run-benchmark-btn').disabled = false;
    return;
  }

  // Configure
  window.BenchmarkJS.setConfig({
    autoRejectGCPollutedRuns: autoRejectGC,
    autoDiscardOutliers: autoDiscardOutliers
  });

  // Create function
  const testFn = new Function(currentFunction.code);

  // Run benchmark
  const result = await window.BenchmarkJS.benchmark(testFn, {
    warmup,
    iterations,
    runs
  });

  currentResult = result;
  displayBasicResults(result);
}

async function runExperiment() {
  // Get options
  const name = document.getElementById('experiment-name').value;
  const variables = parseVariables();

  if (Object.keys(variables).length === 0) {
    throw new Error('Please define at least one variable for the experiment');
  }

  // Define experiment
  window.currentExperiment = {
    name,
    variables,
    setup: () => {
      return new Function(currentFunction.code);
    }
  };

  // Run experiment
  const report = await window.BenchmarkJS.experiment(window.currentExperiment);
  displayExperimentResults(report);
}

async function runRegressionTest() {
  // Get options
  const key = document.getElementById('regression-key').value;
  const warmup = parseInt(document.getElementById('warmup-input').value);
  const iterations = parseInt(document.getElementById('iterations-input').value);
  const runs = parseInt(document.getElementById('runs-input').value);

  // Run benchmark
  const testFn = new Function(currentFunction.code);
  const result = await window.BenchmarkJS.benchmark(testFn, {
    warmup,
    iterations,
    runs
  });

  // Record result
  window.BenchmarkJS.regression.record(key, result);

  // Check for regression
  const check = window.BenchmarkJS.regression.check(key);
  const history = window.BenchmarkJS.regression.getHistory(key);

  currentResult = result;
  displayRegressionResults(result, check, history);
}

// ============================================================================
// RESULTS DISPLAY
// ============================================================================

function displayBasicResults(result) {
  const html = `
    <div class="result-summary">
      <h2>Benchmark Results</h2>
      <div class="result-metrics">
        <div class="metric">
          <span class="label">Average</span>
          <span class="value">${result.avg.toFixed(3)}ms</span>
        </div>
        <div class="metric">
          <span class="label">Min</span>
          <span class="value">${result.min.toFixed(3)}ms</span>
        </div>
        <div class="metric">
          <span class="label">Max</span>
          <span class="value">${result.max.toFixed(3)}ms</span>
        </div>
        <div class="metric">
          <span class="label">Std Dev</span>
          <span class="value">${result.std.toFixed(3)}ms</span>
        </div>
        <div class="metric">
          <span class="label">Samples</span>
          <span class="value">${result.samples.length}</span>
        </div>
        <div class="metric">
          <span class="label">Jitter</span>
          <span class="value ${result.jitter.classification}">${result.jitter.classification.toUpperCase()}</span>
        </div>
        <div class="metric">
          <span class="label">GC Detected</span>
          <span class="value">${result.gc.detected ? '⚠️ Yes' : '✓ No'}</span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('results-content').innerHTML = html;
  document.getElementById('results-tabs').style.display = 'flex';

  // Mount timeline
  document.getElementById('timeline-container').innerHTML = '';
  window.BenchmarkJS.timeline.mount(result, document.getElementById('timeline-container'));

  // Display diagnostics
  displayDiagnostics(result.jitter, result.gc);

  // Display console output
  updateConsoleOutput();

  // Log to console
  console.log('=== Benchmark Results ===');
  console.log(`Average: ${result.avg.toFixed(3)}ms`);
  console.log(`Min: ${result.min.toFixed(3)}ms`);
  console.log(`Max: ${result.max.toFixed(3)}ms`);
  window.BenchmarkJS.visualize.summary(result);
}

function displayExperimentResults(report) {
  const { meta, results, conclusion, summary } = report;

  const html = `
    <div class="experiment-results">
      <h2>${meta.name}</h2>
      <div class="experiment-summary">
        <div class="metric">
          <span class="label">Total Combinations</span>
          <span class="value">${results.length}</span>
        </div>
        <div class="metric">
          <span class="label">Average Confidence</span>
          <span class="value">${(summary.averageConfidence * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div class="conclusion">
        <h3>Conclusion</h3>
        <pre>${conclusion}</pre>
      </div>

      <div class="results-table-wrapper">
        <table class="results-table">
          <thead>
            <tr>
              <th>Variables</th>
              <th>Average (ms)</th>
              <th>Min (ms)</th>
              <th>Max (ms)</th>
              <th>Jitter</th>
              <th>GC</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${results.map(r => `
              <tr>
                <td>${Object.entries(r.variables).map(([k, v]) => k + '=' + v).join(', ')}</td>
                <td>${r.measurement ? r.measurement.avg.toFixed(3) : 'N/A'}</td>
                <td>${r.measurement ? r.measurement.min.toFixed(3) : 'N/A'}</td>
                <td>${r.measurement ? r.measurement.max.toFixed(3) : 'N/A'}</td>
                <td>${r.measurement ? r.measurement.jitter.classification : 'N/A'}</td>
                <td>${r.measurement ? (r.measurement.gc.detected ? '⚠️' : '✓') : 'N/A'}</td>
                <td>${(r.confidence * 100).toFixed(0)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('results-content').innerHTML = html;
  document.getElementById('results-tabs').style.display = 'flex';
  updateConsoleOutput();

  console.log('=== Experiment Report ===');
  console.log(`Name: ${meta.name}`);
  console.log(conclusion);
}

function displayRegressionResults(result, check, history) {
  const status = check.regression ? '⚠️ REGRESSION DETECTED' : '✓ No Regression';
  const statusColor = check.regression ? '#d32f2f' : '#388e3c';

  const html = `
    <div class="regression-results">
      <h2>Regression Analysis</h2>
      
      <div class="regression-status" style="border-left-color: ${statusColor}">
        <h3>${status}</h3>
        <p>${check.reason}</p>
        ${check.delta !== 0 ? `<p>Delta: <strong>${check.delta > 0 ? '+' : ''}${check.delta.toFixed(2)}%</strong></p>` : ''}
      </div>

      <div class="current-benchmark">
        <h3>Current Benchmark</h3>
        <div class="result-metrics">
          <div class="metric">
            <span class="label">Average</span>
            <span class="value">${result.avg.toFixed(3)}ms</span>
          </div>
          <div class="metric">
            <span class="label">Samples</span>
            <span class="value">${result.samples.length}</span>
          </div>
          <div class="metric">
            <span class="label">Jitter</span>
            <span class="value">${result.jitter.classification.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div class="history-chart">
        <h3>History (Last ${history.length} runs)</h3>
        <table class="results-table">
          <thead>
            <tr>
              <th>Run</th>
              <th>Average (ms)</th>
              <th>Jitter</th>
              <th>GC</th>
            </tr>
          </thead>
          <tbody>
            ${history.map((h, i) => `
              <tr>
                <td>#${i + 1}</td>
                <td>${h.avg.toFixed(3)}</td>
                <td>${h.jitterClass}</td>
                <td>${h.gcDetected ? '⚠️' : '✓'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('results-content').innerHTML = html;
  document.getElementById('results-tabs').style.display = 'flex';
  updateConsoleOutput();

  console.log('=== Regression Report ===');
  console.log(check.reason);
}

function displayDiagnostics(jitter, gc) {
  let html = '';

  // Jitter diagnostics
  html += `
    <div id="diagnostics-jitter" class="diagnostics-panel">
      <h4>🔄 Jitter Analysis</h4>
      <p><strong>Score:</strong> ${jitter.jitterScore.toFixed(2)}%</p>
      <p><strong>Classification:</strong> ${jitter.classification.toUpperCase()}</p>
      <p><strong>Outliers:</strong> ${jitter.outliers.length} detected</p>
      ${jitter.outliers.length > 0 ? `
        <p><strong>Top outliers:</strong></p>
        <ul>
          ${jitter.outliers.slice(0, 3).map(o => `<li>Run #${o.index + 1}: ${o.value.toFixed(3)}ms</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;

  // GC diagnostics
  html += `
    <div id="diagnostics-gc" class="diagnostics-panel">
      <h4>🗑️ Garbage Collection</h4>
      <p><strong>Detected:</strong> ${gc.detected ? 'YES' : 'NO'}</p>
      <p><strong>Pauses:</strong> ${gc.pauses.length}</p>
      ${gc.pauses.length > 0 ? `
        <p><strong>GC pause details:</strong></p>
        <ul>
          ${gc.pauses.slice(0, 3).map(p => `<li>Run #${p.index + 1}: ${p.duration.toFixed(3)}ms (${(p.confidence * 100).toFixed(0)}% confidence)</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `;

  document.getElementById('diagnostics-content').innerHTML = html;
}

function updateConsoleOutput() {
  const output = document.getElementById('console-output');
  output.textContent = consoleOutput.length > 0 
    ? consoleOutput.join('\n')
    : '[No console output]';
}

// ============================================================================
// HELPERS
// ============================================================================

function parseVariables() {
  const variables = {};
  document.querySelectorAll('.variable-input').forEach(input => {
    const name = input.querySelector('.var-name').value.trim();
    const values = input.querySelector('.var-values').value.trim();

    if (name && values) {
      variables[name] = values.split(',').map(v => {
        v = v.trim();
        // Try to parse as number
        const num = parseFloat(v);
        return isNaN(num) ? v : num;
      });
    }
  });

  return variables;
}

function showStatus(message) {
  const statusPanel = document.getElementById('status-panel');
  const statusMessage = document.getElementById('status-message');
  statusMessage.textContent = message;
  statusPanel.style.display = 'block';

  setTimeout(() => {
    statusPanel.style.display = 'none';
  }, 4000);
}

function switchTab(e) {
  const tab = e.target.dataset.tab;

  // Hide all tabs
  document.querySelectorAll('.results-tab-content').forEach(el => {
    el.style.display = 'none';
  });

  // Deactivate all tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  if (tab === 'results') {
    document.getElementById('results-content').style.display = 'block';
  } else if (tab === 'timeline') {
    document.getElementById('timeline-content').style.display = 'block';
  } else if (tab === 'diagnostics') {
    document.getElementById('diagnostics-content').style.display = 'block';
  } else if (tab === 'console') {
    document.getElementById('console-content').style.display = 'block';
  }

  // Activate button
  e.target.classList.add('active');
}

function clearRegressionHistory() {
  const key = document.getElementById('regression-key').value;
  if (!key) {
    alert('Please enter a benchmark key');
    return;
  }

  window.BenchmarkJS.regression.clearHistory(key);
  alert(`Cleared history for: ${key}`);
}

function resetAll() {
  // Reset form
  document.getElementById('sample-select').value = '';
  document.getElementById('custom-function').value = '';
  document.getElementById('experiment-name').value = 'Function Performance Test';
  document.getElementById('regression-key').value = 'custom-benchmark';
  
  // Reset variables
  const varContainer = document.getElementById('variables-container');
  varContainer.innerHTML = `
    <div class="variable-input">
      <input type="text" class="var-name" placeholder="Variable name" value="size">
      <input type="text" class="var-values" placeholder="Values (comma separated)" value="100,1000,10000">
      <button class="btn-remove-var" type="button">✕</button>
    </div>
  `;

  // Reset results
  document.getElementById('results-container').innerHTML = `
    <div class="placeholder-empty">
      <p>👈 Select a function and click "Run Benchmark" to start testing</p>
      <p class="subtitle">Choose from pre-populated samples or enter your own custom function</p>
    </div>
  `;

  document.getElementById('results-tabs').style.display = 'none';
  document.getElementById('validation-message').style.display = 'none';

  // Reset state
  currentFunction = null;
  currentResult = null;
  consoleOutput = [];
}

// Add styles for results display
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .result-summary {
    animation: fadeIn 0.3s ease;
  }

  .result-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin-top: 20px;
  }

  .metric {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    border-left: 3px solid #0066cc;
  }

  .metric .label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .metric .value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #0066cc;
  }

  .metric .value.low {
    color: #388e3c;
  }

  .metric .value.moderate {
    color: #ff9800;
  }

  .metric .value.high {
    color: #d32f2f;
  }

  .conclusion {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 4px;
    margin: 20px 0;
  }

  .conclusion pre {
    margin: 0;
    font-family: monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .results-table-wrapper {
    overflow-x: auto;
    margin-top: 20px;
  }

  .results-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .results-table thead {
    background: #f0f0f0;
  }

  .results-table th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #ddd;
  }

  .results-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  .results-table tbody tr:hover {
    background: #fafafa;
  }

  .regression-status {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    border-left: 4px solid;
    margin-bottom: 20px;
  }

  .regression-status h3 {
    margin: 0 0 10px 0;
  }

  .regression-status p {
    margin: 5px 0;
  }

  .current-benchmark,
  .history-chart {
    margin-top: 20px;
  }

  .current-benchmark h3,
  .history-chart h3 {
    margin-bottom: 15px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

document.head.appendChild(additionalStyles);
