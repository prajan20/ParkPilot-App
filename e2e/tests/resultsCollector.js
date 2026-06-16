const ExcelReporter = require('../utils/excelReporter');
const HtmlReporter = require('../utils/htmlReporter');
const DeviceDetector = require('../utils/deviceDetector');
const logger = require('../utils/logger');

class ResultsCollector {
  constructor() {
    this.results = {
      executionDate: new Date().toISOString().split('T')[0],
      deviceName: 'Android Emulator',
      androidVersion: '11.0',
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      passPercentage: 0,
      duration: '0s',
      testCases: [],
      failedTests: [],
      executionLogs: []
    };
    this.startTime = Date.now();
  }

  initializeDeviceDetails() {
    const device = DeviceDetector.getPrimaryDevice();
    this.results.deviceName = device.name;
    this.results.androidVersion = device.osVersion;
  }

  logStep(testName, step, result, remarks = '') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.results.executionLogs.push({
      timestamp,
      testName,
      step,
      result,
      remarks
    });
    logger.info(`[Step Log] [${result.toUpperCase()}] ${testName} - ${step} - ${remarks}`);
  }

  addTestCase(id, module, scenario, status, durationMs) {
    const duration = `${(durationMs / 1000).toFixed(2)}s`;
    this.results.testCases.push({
      id,
      module,
      scenario,
      status,
      device: this.results.deviceName,
      duration
    });

    this.results.totalTests++;
    if (status.toLowerCase() === 'passed') this.results.passed++;
    else if (status.toLowerCase() === 'failed') this.results.failed++;
    else this.results.skipped++;
  }

  addFailure(name, reason, screenshotPath) {
    this.results.failedTests.push({
      name,
      reason,
      screenshotPath,
      device: this.results.deviceName,
      androidVersion: this.results.androidVersion
    });
  }

  async compileAndSave() {
    const durationSec = ((Date.now() - this.startTime) / 1000).toFixed(1);
    this.results.duration = `${durationSec}s`;
    
    const passed = this.results.passed;
    const total = this.results.totalTests;
    this.results.passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    logger.info(`Test execution complete. Total: ${total}, Passed: ${passed}, Failed: ${this.results.failed}. Generating reports...`);
    
    await ExcelReporter.generateReport(this.results);
    await HtmlReporter.generateReport(this.results);
  }
}

// Singleton pattern
const collector = new ResultsCollector();
module.exports = collector;
