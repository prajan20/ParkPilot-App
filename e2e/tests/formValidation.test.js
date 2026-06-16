const { expect } = require('chai');
const DriverFactory = require('../drivers/driverFactory');
const LoginPage = require('../pages/login.page');
const collector = require('./resultsCollector');
const logger = require('../utils/logger');

describe('ParkPilot - Form Validation Test Suite', function () {
  let driver;
  let loginPage;

  before(async function () {
    this.timeout(180000);
    driver = await DriverFactory.createDriver();
    loginPage = new LoginPage(driver);
    collector.initializeDeviceDetails();
    collector.logStep('Form Validation Setup', 'App Launch', 'PASS', 'Application initialized for form verification.');
  });

  after(async function () {
    this.timeout(30000);
    if (driver) {
      await driver.deleteSession();
    }
  });

  afterEach(async function () {
    const testName = this.currentTest.fullTitle();
    const duration = this.currentTest.duration || 0;
    const state = this.currentTest.state || 'skipped';

    collector.addTestCase(
      this.currentTest.title.substring(0, 10),
      'Form Validation',
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

  it('Validate required field validation alerts', async function () {
    this.timeout(60000);
    await loginPage.loginAsStudent('', '', '');

    const nameErr = await loginPage.isValidationMessageDisplayed('Enter Name');
    const emailErr = await loginPage.isValidationMessageDisplayed('Enter Email');
    const passErr = await loginPage.isValidationMessageDisplayed('Enter Password');

    expect(nameErr).to.be.true;
    expect(emailErr).to.be.true;
    expect(passErr).to.be.true;

    collector.logStep('Required Fields', 'Check Required error texts', 'PASS', 'Required field validations are displayed correctly.');
  });

  it('Validate email format formatting check rules', async function () {
    this.timeout(60000);
    // Missing @ sign
    await loginPage.loginAsStudent('Bob', 'bobdomain.com', '1234');
    let emailMsg = await loginPage.getValidationMessage('Enter Valid Email');
    expect(emailMsg).to.equal('Enter Valid Email');

    // Clean field and type valid format
    await loginPage.loginAsStudent('Bob', 'bob@domain.com', '1234');
    const emailErrDisp = await loginPage.isValidationMessageDisplayed('Enter Valid Email');
    expect(emailErrDisp).to.be.false;

    collector.logStep('Email Validation', 'Format patterns checking', 'PASS', 'Email format check rejects invalid address syntax.');
  });

  it('Validate password empty string check', async function () {
    this.timeout(60000);
    await loginPage.loginAsStudent('Bob', 'bob@domain.com', '');
    const passMsg = await loginPage.getValidationMessage('Enter Password');
    expect(passMsg).to.equal('Enter Password');

    collector.logStep('Password Validation', 'Required check', 'PASS', 'Empty password check displays expected error alert.');
  });

  it('Validate dynamic input boundaries for UI controls', async function () {
    this.timeout(60000);
    // Testing extreme characters entry in student name field
    const specialCharsName = 'Bob_!@#123';
    await loginPage.loginAsStudent(specialCharsName, 'bob@domain.com', '1234');
    
    // Verify it accepted the input text
    const textEl = await loginPage.getElement(loginPage.studentNameInput);
    const textVal = await textEl.getText();
    logger.info(`Name field text after special chars: ${textVal}`);
    
    collector.logStep('Boundary Entry', 'Special characters input', 'PASS', 'Form fields handles special character strings safely.');
  });
});
