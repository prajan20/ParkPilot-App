const BasePage = require('./base.page');
const logger = require('../utils/logger');

class AdminActionsPage extends BasePage {
  constructor(driver) {
    super(driver);

    // GENERAL
    this.backButton = { accessibilityId: 'Back', native: '//android.widget.ImageButton | //android.widget.Button[contains(@content-desc, "Back") or contains(@content-desc, "Navigate up")]' };

    // MANAGE SLOTS
    this.manageSlotsHeader = { text: 'Manage Slots' };

    // USER MANAGEMENT
    this.userManagementHeader = { text: 'User Management' };
    this.noUsersText = { text: 'No Registered Users' };

    // ACTIVITY LOGS
    this.activityLogsHeader = { text: 'Activity Logs' };
    this.noLogsText = { text: 'No Activity Found' };

    // PARKING ANALYTICS
    this.analyticsHeader = { text: 'Parking Analytics' };
  }

  async goBack() {
    logger.info('Clicking AppBar Back button');
    // Using native driver fallback for standard Android back command if button is hard to resolve
    try {
      await this.click(this.backButton);
    } catch (err) {
      logger.warn(`Could not click back button via POM locator, calling native driver.back(): ${err.message}`);
      await this.driver.back();
    }
  }

  // --- MANAGE SLOTS ACTIONS ---
  async toggleSlotTiming(slotId, time) {
    logger.info(`Toggling slot: ${slotId} for timing: ${time}`);
    // Locate the container for slotId, then click the timing cell matching text inside it
    // In UiAutomator:
    const xpath = `//*[@text="${slotId}"]/following-sibling::*//*[@text="${time}"] | //android.widget.TextView[@text="${slotId}"]/parent::*[1]//*[contains(@text, "${time}")]`;
    const targetCell = { native: xpath };
    await this.click(targetCell);
  }

  // --- USER MANAGEMENT ACTIONS ---
  async cancelUserBooking(studentName) {
    logger.info(`Admin canceling booking for student: ${studentName}`);
    // Trash icon button is located in the row for studentName
    const xpath = `//*[@text="${studentName}"]/ancestor::*[contains(@class, "Container") or contains(@class, "ViewGroup") or @resource-id="user_row"][1]//android.widget.Button | //android.widget.TextView[@text="${studentName}"]/parent::*/parent::*//android.widget.Button | //*[contains(@text, "${studentName}")]/ancestor::*[3]//android.widget.Button`;
    const deleteButton = { native: xpath };
    await this.click(deleteButton);
  }

  async verifyUserRowDetails(studentName, vehicleNo, slotId, status) {
    logger.info(`Verifying user list row for student: ${studentName}, Vehicle: ${vehicleNo}, Slot: ${slotId}, Status: ${status}`);
    const nameSelector = { text: studentName };
    const vehicleSelector = { text: `Vehicle: ${vehicleNo}` };
    const slotSelector = { text: `Booked Slot: ${slotId}` };
    const statusSelector = { text: status.toUpperCase() };

    await this.waitForDisplayed(nameSelector);
    const nOk = await this.isDisplayed(nameSelector);
    const vOk = await this.isDisplayed(vehicleSelector);
    const sOk = await this.isDisplayed(slotSelector);
    const stOk = await this.isDisplayed(statusSelector);

    logger.info(`User row check: Name=${nOk}, Vehicle=${vOk}, Slot=${sOk}, Status=${stOk}`);
    return nOk && vOk && sOk && stOk;
  }

  // --- ACTIVITY LOGS ACTIONS ---
  async verifyActivityLogItem(studentName, slotId, vehicleNo, time, status) {
    logger.info(`Checking Activity Log for student: ${studentName}, Slot: ${slotId}, Vehicle: ${vehicleNo}, Time: ${time}, Status: ${status}`);
    const nameSelector = { text: studentName };
    const slotSelector = { text: `Slot: ${slotId}` };
    const vehicleSelector = { text: `Vehicle: ${vehicleNo}` };
    const timeSelector = { text: `Timing: ${time}` };
    const statusSelector = { text: `Status: ${status}` };

    await this.waitForDisplayed(nameSelector);
    const nOk = await this.isDisplayed(nameSelector);
    const sOk = await this.isDisplayed(slotSelector);
    const vOk = await this.isDisplayed(vehicleSelector);
    const tOk = await this.isDisplayed(timeSelector);
    const stOk = await this.isDisplayed(statusSelector);

    logger.info(`Activity log check: Name=${nOk}, Slot=${sOk}, Vehicle=${vOk}, Timing=${tOk}, Status=${stOk}`);
    return nOk && sOk && vOk && tOk && stOk;
  }

  // --- ANALYTICS ACTIONS ---
  async verifyAnalyticsScreenLoaded() {
    await this.waitForDisplayed(this.analyticsHeader);
    const hasHeader = await this.isDisplayed(this.analyticsHeader);
    const overview = await this.isDisplayed({ text: 'Analytics Overview' });
    const slotOcc = await this.isDisplayed({ text: 'Slot Occupancy' });
    const stats = await this.isDisplayed({ text: 'Parking Statistics' });
    logger.info(`Analytics screens check: Header=${hasHeader}, Overview=${overview}, PieChartLabel=${slotOcc}, BarChartLabel=${stats}`);
    return hasHeader && overview && slotOcc && stats;
  }
}

module.exports = AdminActionsPage;
