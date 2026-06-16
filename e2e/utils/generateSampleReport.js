const ExcelReporter = require('./excelReporter');
const HtmlReporter = require('./htmlReporter');
const logger = require('./logger');

const sampleResults = {
  executionDate: new Date().toISOString().split('T')[0],
  deviceName: 'Pixel 7 Pro Emulator',
  androidVersion: '13.0',
  totalTests: 12,
  passed: 10,
  failed: 2,
  skipped: 0,
  passPercentage: 83,
  duration: '2m 14s',
  testCases: [
    { id: 'AUTH-01', module: 'Authentication', scenario: 'Verify login form validations for empty inputs', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '5.20s' },
    { id: 'AUTH-02', module: 'Authentication', scenario: 'Verify student login fails with wrong password', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '4.80s' },
    { id: 'AUTH-03', module: 'Authentication', scenario: 'Verify successful Student login and Logout', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '8.40s' },
    { id: 'AUTH-04', module: 'Authentication', scenario: 'Verify session persistence across user sessions', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '22.10s' },
    { id: 'AUTH-05', module: 'Authentication', scenario: 'Verify successful Admin login and Logout', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '9.30s' },
    { id: 'VAL-01', module: 'Form Validation', scenario: 'Validate required field validation alerts', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '3.10s' },
    { id: 'VAL-02', module: 'Form Validation', scenario: 'Validate email format formatting check rules', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '5.60s' },
    { id: 'VAL-03', module: 'Form Validation', scenario: 'Validate password empty string check', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '2.90s' },
    { id: 'VAL-04', module: 'Form Validation', scenario: 'Validate dynamic input boundaries for UI controls', status: 'Failed', device: 'Pixel 7 Pro Emulator', duration: '6.40s' },
    { id: 'E2E-01', module: 'E2E Scenarios', scenario: 'Perform student slot reservation business flow', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '31.20s' },
    { id: 'E2E-02', module: 'E2E Scenarios', scenario: 'Perform admin portal overview, slot status check, and cancellation flow', status: 'Passed', device: 'Pixel 7 Pro Emulator', duration: '28.50s' },
    { id: 'E2E-03', module: 'E2E Scenarios', scenario: 'Verify student active booking reflects administrative cancellations', status: 'Failed', device: 'Pixel 7 Pro Emulator', duration: '6.50s' }
  ],
  failedTests: [
    {
      name: 'Validate dynamic input boundaries for UI controls',
      reason: 'AssertionError: expected \'Bob_!@#123\' to equal \'Bob\'\n    at Context.<anonymous> (e2e/tests/formValidation.test.js:68:32)\n    at processImmediate (node:internal/timers:476:21)',
      screenshotPath: './reports/failures/validate_dynamic_input_boundaries_for_ui_controls_screenshot.png',
      device: 'Pixel 7 Pro Emulator',
      androidVersion: '13.0'
    },
    {
      name: 'Verify student active booking reflects administrative cancellations',
      reason: 'TypeError: Cannot read properties of undefined (reading \'isDisplayed\')\n    at StudentDashboardPage.getActiveBookingValue (e2e/pages/studentDashboard.page.js:51:24)\n    at Context.<anonymous> (e2e/tests/e2eScenarios.test.js:140:42)',
      screenshotPath: './reports/failures/verify_student_active_booking_reflects_administrative_cancellations_screenshot.png',
      device: 'Pixel 7 Pro Emulator',
      androidVersion: '13.0'
    }
  ],
  executionLogs: [
    { timestamp: '2026-06-13 10:45:01', testName: 'Verify login form validations for empty inputs', step: 'App Launch', result: 'Pass', remarks: 'Application started successfully.' },
    { timestamp: '2026-06-13 10:45:03', testName: 'Verify login form validations for empty inputs', step: 'Check validators', result: 'Pass', remarks: 'Name, Email, and Password error tags displayed.' },
    { timestamp: '2026-06-13 10:45:07', testName: 'Verify student login fails with wrong password', step: 'Enter values', result: 'Pass', remarks: 'Wrong Password snackbar toast displayed successfully.' },
    { timestamp: '2026-06-13 10:45:15', testName: 'Verify successful Student login and Logout', step: 'Enter credentials', result: 'Pass', remarks: 'Logged in as Bob and welcomed.' },
    { timestamp: '2026-06-13 10:45:22', testName: 'Verify session persistence across user sessions', step: 'Reservation', result: 'Pass', remarks: 'Successfully booked slot A-1.' },
    { timestamp: '2026-06-13 10:45:34', testName: 'Verify session persistence across user sessions', step: 'Re-login', result: 'Pass', remarks: 'Booking details for A-1 restored.' },
    { timestamp: '2026-06-13 10:45:44', testName: 'Validate required field validation alerts', step: 'Check validators', result: 'Pass', remarks: 'Correct labels display.' },
    { timestamp: '2026-06-13 10:45:51', testName: 'Validate email format formatting check rules', step: 'Verify emails check', result: 'Pass', remarks: 'Invalid format yields message.' },
    { timestamp: '2026-06-13 10:45:58', testName: 'Validate dynamic input boundaries for UI controls', step: 'Verify text limits', result: 'Fail', remarks: 'UI accepted invalid character input in validation test.' },
    { timestamp: '2026-06-13 10:46:12', testName: 'Perform student slot reservation business flow', step: 'Tab navigate', result: 'Pass', remarks: 'QR pass validated successfully.' }
  ]
};

async function run() {
  logger.info('Starting manual sample generation...');
  try {
    const xlPath = await ExcelReporter.generateReport(sampleResults);
    const htmlPath = await HtmlReporter.generateReport(sampleResults);
    console.log(`\nSuccess! Created reports:`);
    console.log(`- Excel: ${xlPath}`);
    console.log(`- HTML: ${htmlPath}`);
  } catch (err) {
    console.error('Failed to generate sample reports:', err);
  }
}

run();
