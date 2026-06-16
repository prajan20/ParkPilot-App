const BasePage = require('./base.page');
const logger = require('../utils/logger');

class AdminDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);

    // APP BAR
    this.logoutButton = { accessibilityId: 'Logout', native: '//android.widget.Button[@content-desc="Logout"]' };

    // STATS LABELS
    this.totalSlotsLabel = { text: 'Total Slots' };
    this.occupiedSlotsLabel = { text: 'Occupied Slots' };
    this.freeSlotsLabel = { text: 'Free Slots' };

    // NAVIGATION ACTIONS
    this.manageSlotsCard = { text: 'Manage Slots' };
    this.parkingAnalyticsCard = { text: 'Parking Analytics' };
    this.userManagementCard = { text: 'User Management' };
    this.activityLogsCard = { text: 'Activity Logs' };
  }

  // NAVIGATION
  async clickManageSlots() {
    logger.info('Navigating to Manage Slots Screen');
    await this.click(this.manageSlotsCard);
  }

  async clickParkingAnalytics() {
    logger.info('Navigating to Parking Analytics Screen');
    await this.click(this.parkingAnalyticsCard);
  }

  async clickUserManagement() {
    logger.info('Navigating to User Management Screen');
    await this.click(this.userManagementCard);
  }

  async clickActivityLogs() {
    logger.info('Navigating to Activity Logs Screen');
    await this.click(this.activityLogsCard);
  }

  async logout() {
    logger.info('Logging out from Admin Portal');
    await this.click(this.logoutButton);
  }

  // VALIDATIONS
  async getStatValue(statName) {
    // Selects the text layout card sibling
    const xpath = `//*[@text="${statName}"]/preceding-sibling::android.widget.TextView[1] | //android.widget.TextView[@text="${statName}"]/parent::*[1]/android.widget.TextView[1]`;
    const valEl = await this.getElement({ native: xpath });
    return await valEl.getText();
  }
}

module.exports = AdminDashboardPage;
