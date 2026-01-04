/**
 * Timeline UI Module
 * Interactive per-run inspection with slider-based navigation
 */

class TimelineUI {
  constructor() {
    this.currentMeasurement = null;
    this.currentRunIndex = 0;
    this.container = null;
  }

  /**
   * Mount timeline UI to a container
   * @param {BenchmarkResult} measurement - Benchmark result
   * @param {HTMLElement} container - DOM container
   */
  mount(measurement, container) {
    if (!container) {
      console.error('Timeline UI requires a container element');
      return;
    }

    if (!measurement || !measurement.rawSamples) {
      console.error('Timeline UI requires a valid benchmark measurement');
      return;
    }

    this.currentMeasurement = measurement;
    this.container = container;
    this.currentRunIndex = 0;

    // Validate DOM readiness
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._render());
    } else {
      this._render();
    }
  }

  /**
   * Render the timeline UI
   */
  _render() {
    this.container.innerHTML = '';

    const { rawSamples, avg, gc } = this.currentMeasurement;
    const gcIndices = new Set(gc?.pauses?.map(p => p.index) || []);

    // Header
    const header = document.createElement('div');
    header.className = 'timeline-header';
    header.innerHTML = `
      <h3 class="timeline-title">Performance Timeline</h3>
      <div class="timeline-stats">
        <span class="stat">Avg: <strong>${avg.toFixed(3)}ms</strong></span>
        <span class="stat">Runs: <strong>${rawSamples.length}</strong></span>
        <span class="stat">GC: <strong>${gcIndices.size}</strong></span>
      </div>
    `;
    this.container.appendChild(header);

    // Slider
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'timeline-slider-container';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'timeline-slider';
    slider.min = '0';
    slider.max = String(rawSamples.length - 1);
    slider.value = String(this.currentRunIndex);
    slider.addEventListener('input', (e) => {
      this.currentRunIndex = parseInt(e.target.value, 10);
      this._updateRunDisplay();
    });

    sliderContainer.appendChild(slider);

    // Create meter marks for visual guidance
    const meterMarks = document.createElement('div');
    meterMarks.className = 'timeline-meter-marks';
    
    // Calculate marks - show approximately 10 marks or one per run if fewer
    const markCount = Math.min(10, Math.max(2, Math.ceil(rawSamples.length / 5)));
    const markInterval = (rawSamples.length - 1) / (markCount - 1);
    
    for (let i = 0; i < markCount; i++) {
      const markValue = Math.round(i * markInterval);
      const percentage = (markValue / (rawSamples.length - 1)) * 100;
      
      const mark = document.createElement('div');
      mark.className = 'timeline-meter-mark';
      mark.style.left = percentage + '%';
      mark.title = `Run #${markValue + 1}`;
      
      // Add label at certain intervals
      if (i === 0 || i === markCount - 1 || i % 2 === 0) {
        const label = document.createElement('div');
        label.className = 'timeline-meter-label';
        label.textContent = markValue + 1;
        mark.appendChild(label);
      }
      
      meterMarks.appendChild(mark);
    }
    
    sliderContainer.appendChild(meterMarks);
    this.container.appendChild(sliderContainer);

    // Run display
    const runDisplay = document.createElement('div');
    runDisplay.className = 'timeline-run-display';
    this.container.appendChild(runDisplay);

    // Run list
    const listContainer = document.createElement('div');
    listContainer.className = 'timeline-list-container';

    const list = document.createElement('div');
    list.className = 'timeline-list';

    rawSamples.forEach((sample, index) => {
      const item = document.createElement('div');
      item.className = 'timeline-list-item';
      if (gcIndices.has(index)) {
        item.classList.add('gc-affected');
      }

      const percentage = (sample / Math.max(...rawSamples)) * 100;
      item.innerHTML = `
        <span class="timeline-list-index">#${index + 1}</span>
        <div class="timeline-list-bar" style="width: ${percentage}%"></div>
        <span class="timeline-list-time">${sample.toFixed(3)}ms</span>
      `;

      item.addEventListener('click', () => {
        this.currentRunIndex = index;
        slider.value = String(index);
        this._updateRunDisplay();
      });

      list.appendChild(item);
    });

    listContainer.appendChild(list);
    this.container.appendChild(listContainer);

    this._updateRunDisplay();
  }

  /**
   * Update the run display
   */
  _updateRunDisplay() {
    const { rawSamples, avg, gc } = this.currentMeasurement;
    const sample = rawSamples[this.currentRunIndex];
    const gcIndices = new Set(gc?.pauses?.map(p => p.index) || []);
    const isGCaffected = gcIndices.has(this.currentRunIndex);

    let displayHTML = `
      <div class="run-info">
        <h4>Run #${this.currentRunIndex + 1}</h4>
        <div class="run-timing">
          <div class="run-metric">
            <span class="label">Execution Time:</span>
            <span class="value">${sample.toFixed(3)}ms</span>
          </div>
          <div class="run-metric">
            <span class="label">vs Average:</span>
            <span class="value ${sample > avg ? 'slower' : 'faster'}">
              ${sample > avg ? '+' : ''}${((sample - avg) / avg * 100).toFixed(2)}%
            </span>
          </div>
        </div>
    `;

    if (isGCaffected) {
      displayHTML += `
        <div class="gc-warning">
          <span class="warning-icon">⚠️</span>
          <span class="warning-text">This run was affected by garbage collection</span>
        </div>
      `;
    }

    displayHTML += '</div>';

    const displayElement = this.container.querySelector('.timeline-run-display');
    if (displayElement) {
      displayElement.innerHTML = displayHTML;
    }

    // Update list selection
    const items = this.container.querySelectorAll('.timeline-list-item');
    items.forEach((item, index) => {
      if (index === this.currentRunIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Export timeline data as JSON
   */
  exportData() {
    if (!this.currentMeasurement) {
      return null;
    }

    return {
      timestamp: new Date().toISOString(),
      measurement: this.currentMeasurement
    };
  }
}

// Add timeline to BenchmarkJS
window.BenchmarkJS.timeline = new TimelineUI();

// Export class
window.TimelineUI = TimelineUI;
