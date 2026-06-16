const { expect } = require('chai');
const DriverFactory = require('../drivers/driverFactory');
const LoginPage = require('../pages/login.page');
const StudentDashboardPage = require('../pages/studentDashboard.page');
const AdminDashboardPage = require('../pages/adminDashboard.page');
const BookingPage = require('../pages/booking.page');
const collector = require('./resultsCollector');
const logger = require('../utils/logger');

describe('ParkPilot - Authentication Test Suite', function () {
  let driver;
  let loginPage;
  let studentDashboard;
  let adminDashboard;
  let bookingPage;

  before(async function () {
    this.timeout(180000);
    driver = await DriverFactory.createDriver();
    
    loginPage = new LoginPage(driver);
    studentDashboard = new StudentDashboardPage(driver);
    adminDashboard = new AdminDashboardPage(driver);
    bookingPage = new BookingPage(driver);

    collector.initializeDeviceDetails();
    collector.logStep('Authentication Setup', 'App Launch', 'PASS', 'ParkPilot application launched successfully.');
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
      'Authentication',
      this.currentTest.title,
      state === 'passed' ? 'Passed' : state === 'failed' ? 'Failed' : 'Skipped',
      duration
    );

    if (state === 'failed') {
      logger.error(`Test failed: ${testName}`);
      const screenshot = await loginPage.captureScreenshot(testName);
      await loginPage.captureLogs(testName);
      await loginPage.dumpWidgetTree(testName);
      
      const reason = this.currentTest.err ? this.currentTest.err.stack : 'Unknown error';
      collector.addFailure(testName, reason, screenshot);
      collector.logStep(testName, 'Test Failure', 'FAIL', reason);
    }
  });

  it('Verify login form validations for empty inputs', async function () {
    this.timeout(60000);
    // Student Login Empty Validation
    await loginPage.loginAsStudent('', '', '');
    
    const nameVal = await loginPage.getValidationMessage('Enter Name');
    const emailVal = await loginPage.getValidationMessage('Enter Email');
    const passVal = await loginPage.getValidationMessage('Enter Password');

    expect(nameVal).to.equal('Enter Name');
    expect(emailVal).to.equal('Enter Email');
    expect(passVal).to.equal('Enter Password');

    collector.logStep('Verify Empty Inputs', 'Validation Messages', 'PASS', 'Validation text triggers are correct for empty logins.');
  });

  it('Verify student login fails with wrong password', async function () {
    this.timeout(60000);
    await loginPage.loginAsStudent('Alice', 'alice@university.edu', '9999'); // wrong pass
    
    // Check snackbar
    const toastDisplayed = await loginPage.isSnackbarDisplayed('Wrong Password');
    expect(toastDisplayed).to.be.true;
    
    collector.logStep('Verify Wrong Password', 'Snackbar Alert', 'PASS', 'Wrong Password snackbar displayed.');
  });

  it('Verify successful Student login and Logout', async function () {
    this.timeout(60000);
    await loginPage.loginAsStudent('Bob', 'bob@university.edu', '1234'); // correct pass
    
    const welcomeText = await studentDashboard.getWelcomeMessage('Bob');
    expect(welcomeText).to.contain('Bob');
    collector.logStep('Verify Student Login', 'Dashboard Welcome', 'PASS', 'Student dashboard loaded successfully.');

    // Logout
    await studentDashboard.logout();
    const nameInputVisible = await loginPage.isDisplayed(loginPage.studentNameInput);
    expect(nameInputVisible).to.be.true;
    
    collector.logStep('Verify Student Logout', 'Return to Login', 'PASS', 'Logged out and returned to student portal.');
  });

  it('Verify session persistence across user sessions', async function () {
    this.timeout(120000);
    // 1. Log in
    await loginPage.loginAsStudent('Charlie', 'charlie@university.edu', '1234');
    
    // 2. Book a slot
    await studentDashboard.clickBook();
    await bookingPage.executeFullBookingFlow('A-1', '8:00 AM', 'CH-99');
    
    // 3. Logout
    await studentDashboard.clickHome();
    await studentDashboard.logout();
    
    // 4. Log back in
    await loginPage.loginAsStudent('Charlie', 'charlie@university.edu', '1234');
    
    // 5. Verify booked slot details persist
    const slotText = await studentDashboard.getActiveBookingValue();
    expect(slotText).to.contain('Slot A-1');
    
    // Clean up: cancel booking
    await studentDashboard.clickBook();
    await bookingPage.cancelActiveBooking();
    await studentDashboard.clickHome();
    await studentDashboard.logout();

    collector.logStep('Verify Session Persistence', 'Restore Booking Status', 'PASS', 'Booking state successfully restored upon re-login.');
  });

  it('Verify successful Admin login and Logout', async function () {
    this.timeout(60000);
    await loginPage.switchToAdmin();
    
    // Empty credentials validation
    await loginPage.loginAsAdmin('', '');
    const idVal = await loginPage.getValidationMessage('Enter Admin ID');
    expect(idVal).to.equal('Enter Admin ID');

    // Wrong credentials validation
    await loginPage.loginAsAdmin('admin', '9999');
    const toastDisplayed = await loginPage.isSnackbarDisplayed('Invalid Admin Credentials');
    expect(toastDisplayed).to.be.true;

    // Correct login
    await loginPage.loginAsAdmin('admin', '1234');
    const isDashboardHeaderVisible = await adminDashboard.isDisplayed({ text: 'Admin Dashboard' });
    expect(isDashboardHeaderVisible).to.be.true;
    
    collector.logStep('Verify Admin Login', 'Dashboard Header', 'PASS', 'Admin dashboard loaded successfully.');

    // Logout
    await adminDashboard.logout();
    await loginPage.switchToStudent();
    collector.logStep('Verify Admin Logout', 'Return to Student Login', 'PASS', 'Logged out from Admin portal successfully.');
  });
});
