const { expect } = require('chai');
const DriverFactory = require('../drivers/driverFactory');
const LoginPage = require('../pages/login.page');
const StudentDashboardPage = require('../pages/studentDashboard.page');
const BookingPage = require('../pages/booking.page');
const QrPassPage = require('../pages/qrPass.page');
const ParkingHistoryPage = require('../pages/parkingHistory.page');
const AdminDashboardPage = require('../pages/adminDashboard.page');
const AdminActionsPage = require('../pages/adminActions.page');
const collector = require('./resultsCollector');
const logger = require('../utils/logger');

describe('ParkPilot - End-to-End Business Scenarios', function () {
  let driver;
  let loginPage;
  let studentDashboard;
  let bookingPage;
  let qrPassPage;
  let parkingHistoryPage;
  let adminDashboard;
  let adminActions;

  before(async function () {
    this.timeout(180000);
    driver = await DriverFactory.createDriver();
    
    loginPage = new LoginPage(driver);
    studentDashboard = new StudentDashboardPage(driver);
    bookingPage = new BookingPage(driver);
    qrPassPage = new QrPassPage(driver);
    parkingHistoryPage = new ParkingHistoryPage(driver);
    adminDashboard = new AdminDashboardPage(driver);
    adminActions = new AdminActionsPage(driver);

    collector.initializeDeviceDetails();
    collector.logStep('E2E Setup', 'App Launch', 'PASS', 'ParkPilot application launched for E2E scenarios.');
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
      'E2E Scenarios',
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

  it('Perform student slot reservation business flow', async function () {
    this.timeout(120000);
    
    // 1. Student Login
    await loginPage.loginAsStudent('Bob', 'bob@university.edu', '1234');
    collector.logStep('Student Flow', 'Authenticate Bob', 'PASS', 'Bob authenticated successfully.');

    // 2. Validate Dashboard empty booking status
    const initialBooking = await studentDashboard.getActiveBookingValue();
    expect(initialBooking).to.equal('No Active Booking');

    // 3. Go to Book tab and reserve slot A-2
    await studentDashboard.clickBook();
    await bookingPage.executeFullBookingFlow('A-2', '9:00 AM', 'TN09AB1234');
    collector.logStep('Student Flow', 'Book Slot A-2', 'PASS', 'Successfully selected and booked A-2 at 9:00 AM.');

    // 4. Verify Dashboard displays active booking card
    await studentDashboard.clickHome();
    const bookingDetails = await studentDashboard.getActiveBookingValue();
    expect(bookingDetails).to.contain('Slot A-2');
    
    // Verify mini-stat fields
    const occupiedVal = await studentDashboard.getStatValue('Occupied');
    expect(parseInt(occupiedVal, 10)).to.be.at.least(1);

    // 5. Navigate to QR Pass and verify details
    await studentDashboard.clickPass();
    const isPassValid = await qrPassPage.verifyActivePassDetails('A-2', '9:00 AM', 'TN09AB1234', 'Bob');
    expect(isPassValid).to.be.true;
    collector.logStep('Student Flow', 'Verify QR Pass', 'PASS', 'QR pass layout matching active reservation details.');

    // 6. Navigate to History and verify list item
    await studentDashboard.clickHistory();
    const hasHistory = await parkingHistoryPage.verifyHistoryRecord('A-2', 'TN09AB1234', '9:00 AM', 'Active');
    expect(hasHistory).to.be.true;
    collector.logStep('Student Flow', 'Verify History List', 'PASS', 'Active reservation item listed in History screen.');

    // 7. Logout
    await studentDashboard.clickHome();
    await studentDashboard.logout();
  });

  it('Perform admin portal overview, slot status check, and cancellation flow', async function () {
    this.timeout(120000);
    
    // 1. Admin Login
    await loginPage.switchToAdmin();
    await loginPage.loginAsAdmin('admin', '1234');
    collector.logStep('Admin Flow', 'Authenticate Admin', 'PASS', 'Admin logged in.');

    // 2. Verify Stats
    const occupiedStats = await adminDashboard.getStatValue('Occupied Slots');
    expect(parseInt(occupiedStats, 10)).to.be.at.least(1);
    collector.logStep('Admin Flow', 'Verify Stats', 'PASS', 'Admin overview correctly reflects occupied slots count.');

    // 3. Navigate to Manage Slots and verify slot color state
    await adminDashboard.clickManageSlots();
    await adminActions.waitForDisplayed(adminActions.manageSlotsHeader);
    // Since we know A-2 at 9:00 AM is occupied, verify we can toggle it back or verify view
    // Let's toggle A-2 back to unbooked to verify it cancels
    await adminActions.toggleSlotTiming('A-2', '9:00 AM');
    
    const isToastDisplayed = await loginPage.isSnackbarDisplayed('A-2 - 9:00 AM updated');
    expect(isToastDisplayed).to.be.true;
    
    await adminActions.goBack();
    collector.logStep('Admin Flow', 'Toggle Slot State', 'PASS', 'Toggled slot state to unbooked successfully.');

    // 4. Navigate to User Management
    await adminDashboard.clickUserManagement();
    await adminActions.waitForDisplayed(adminActions.userManagementHeader);
    
    // Since we toggled slot above, check listing. Let's return back and check logs.
    await adminActions.goBack();

    // 5. Navigate to Activity Logs and audit entries
    await adminDashboard.clickActivityLogs();
    await adminActions.waitForDisplayed(adminActions.activityLogsHeader);
    // Check if the log for Bob is present
    const hasBobLog = await adminActions.verifyActivityLogItem('Bob', 'A-2', 'TN09AB1234', '9:00 AM', 'Cancelled');
    expect(hasBobLog).to.be.true;
    
    await adminActions.goBack();
    collector.logStep('Admin Flow', 'Audit Activity Logs', 'PASS', 'Audit logs shows Bob reservation state change correctly.');

    // 6. Navigate to Parking Analytics
    await adminDashboard.clickParkingAnalytics();
    const isAnalyticsLoaded = await adminActions.verifyAnalyticsScreenLoaded();
    expect(isAnalyticsLoaded).to.be.true;
    
    await adminActions.goBack();
    collector.logStep('Admin Flow', 'Verify Analytics Screen', 'PASS', 'Analytics chart components loaded.');

    // 7. Logout
    await adminDashboard.logout();
    await loginPage.switchToStudent();
  });

  it('Verify student active booking reflects administrative cancellations', async function () {
    this.timeout(60000);
    // 1. Log in as Student again
    await loginPage.loginAsStudent('Bob', 'bob@university.edu', '1234');
    
    // 2. Dashboard should display no active booking
    const bookingStatus = await studentDashboard.getActiveBookingValue();
    expect(bookingStatus).to.equal('No Active Booking');
    
    // 3. Logout
    await studentDashboard.logout();
    collector.logStep('State Sync Flow', 'Verify cancelled state syncs', 'PASS', 'Student dashboard active booking panel successfully cleared.');
  });
});
