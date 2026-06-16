const { expect } = require('chai');
const DriverFactory = require('../drivers/driverFactory');
const LoginPage = require('../pages/login.page');
const SmartTester = require('../ai/smartTester');
const collector = require('./resultsCollector');

describe('ParkPilot - Smart AI Testing Exploration Suite', function () {
  let driver;
  let loginPage;
  let smartTester;

  before(async function () {
    this.timeout(180000);
    driver = await DriverFactory.createDriver();
    loginPage = new LoginPage(driver);
    smartTester = new SmartTester(driver);
    
    collector.initializeDeviceDetails();
    collector.logStep('Smart AI Setup', 'App Launch', 'PASS', 'Application launched for AI analysis.');
  });

  after(async function () {
    this.timeout(30000);
    if (driver) {
      await driver.deleteSession();
    }
    await collector.compileAndSave();
  });

  afterEach(async function () {
    const testName = this.currentTest.fullTitle();
    const duration = this.currentTest.duration || 0;
    const state = this.currentTest.state || 'skipped';

    collector.addTestCase(
      this.currentTest.title.substring(0, 10),
      'Smart AI Testing',
      this.currentTest.title,
      state === 'passed' ? 'Passed' : state === 'failed' ? 'Failed' : 'Skipped',
      duration
    );

    if (state === 'failed') {
      const screenshot = await loginPage.captureScreenshot(testName);
      await loginPage.captureLogs(testName);
      await loginPage.dumpWidgetTree(testName);
      const reason = this.currentTest.err ? this.currentTest.err.stack : 'Unknown error';
      collector.addFailure(testName, reason, screenshot);
      collector.logStep(testName, 'Test Failure', 'FAIL', reason);
    }
  });

  it('Perform automated screen layout analysis and dynamic validation injections', async function () {
    this.timeout(120000);
    
    // Analyze Login Screen
    const widgets = await smartTester.analyzeScreen();
    expect(widgets).to.be.an('array');
    expect(widgets.length).to.be.greaterThan(0);

    const inputs = widgets.filter(w => w.type.includes('Input'));
    expect(inputs.length).to.be.greaterThan(0);

    // Run automated boundary checks
    const stepLogger = (data) => collector.logStep('AI Validation', data.step, data.result, data.remarks);
    await smartTester.runValidationTests(stepLogger);
    
    collector.logStep('AI Exploration', 'Field Verification', 'PASS', 'Automatically verified boundary validations.');
  });

  it('Perform self-guided navigation crawler explorer checks', async function () {
    this.timeout(120000);
    
    // Log in as student to access main navigation
    await loginPage.loginAsStudent('Bob', 'bob@university.edu', '1234');
    
    // Wait for screen to load and run analysis
    await driver.pause(3000);
    await smartTester.analyzeScreen();
    
    // Crawl navigation tabs
    const stepLogger = (data) => collector.logStep('AI Crawler', data.step, data.result, data.remarks);
    await smartTester.exploreNavigationPaths(stepLogger);
    
    collector.logStep('AI Exploration', 'Crawl Completes', 'PASS', 'AI Crawler completed navigation crawls.');
  });
});
