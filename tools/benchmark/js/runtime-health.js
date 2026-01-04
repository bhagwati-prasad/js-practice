/**
 * RuntimeHealth Module
 * Generic runtime diagnostics utility for any project
 * 
 * Allows defining health checks and running them with reporting
 */

class RuntimeHealth {
  constructor(options = {}) {
    this.strict = options.strict || false;
    this.reporter = options.reporter || console;
    this.checks = [];
    this.results = [];
  }

  /**
   * Register a health check
   * @param {string} name - Check name
   * @param {Function} fn - Check function returning boolean or Promise<boolean>
   * @param {Object} options - Check options
   * @param {boolean} options.fatal - Whether this check is critical
   */
  addCheck(name, fn, options = {}) {
    if (typeof name !== 'string') {
      throw new Error('Check name must be a string');
    }
    if (typeof fn !== 'function') {
      throw new Error('Check function must be a function');
    }

    this.checks.push({
      name,
      fn,
      fatal: options.fatal || false
    });

    return this;
  }

  /**
   * Run all registered checks
   */
  async run() {
    this.results = [];
    const allPassed = [];

    for (const check of this.checks) {
      try {
        const result = await Promise.resolve(check.fn());
        const ok = Boolean(result);

        const checkResult = {
          name: check.name,
          ok,
          error: ok ? undefined : 'Check failed'
        };

        this.results.push(checkResult);
        allPassed.push(ok || !check.fatal);

        this._logResult(checkResult);
      } catch (error) {
        const checkResult = {
          name: check.name,
          ok: false,
          error: error.message
        };

        this.results.push(checkResult);
        allPassed.push(!check.fatal);

        this._logResult(checkResult);
      }
    }

    if (this.strict && allPassed.some(p => !p)) {
      throw new Error('Runtime health check failed in strict mode');
    }

    return this.results;
  }

  /**
   * Get summary of health check results
   */
  summary() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.ok).length;
    const failed = total - passed;

    return {
      total,
      passed,
      failed,
      healthy: failed === 0
    };
  }

  /**
   * Reset results
   */
  reset() {
    this.results = [];
    return this;
  }

  /**
   * Clear all checks
   */
  clearChecks() {
    this.checks = [];
    this.results = [];
    return this;
  }

  /**
   * Private helper to log results
   */
  _logResult(result) {
    const prefix = result.ok ? '✓' : '✗';
    const message = result.error 
      ? `${prefix} ${result.name}: ${result.error}`
      : `${prefix} ${result.name}`;

    if (result.ok) {
      this.reporter.log(message);
    } else {
      this.reporter.warn(message);
    }
  }

  /**
   * Generate a detailed report
   */
  getReport() {
    return {
      timestamp: new Date().toISOString(),
      results: this.results,
      summary: this.summary()
    };
  }
}

// Export for use in projects
window.RuntimeHealth = RuntimeHealth;
