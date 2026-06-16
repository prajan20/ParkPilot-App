const BasePage = require('./base.page');
const logger = require('../utils/logger');

class StudentDashboardPage extends BasePage {
  constructor(driver) {
    super(driver);

    // APP BAR & LOGOUT
    this.logoutButton = { accessibilityId: 'Logout', native: '//android.widget.Button[@content-desc="Logout"]' };

    // TABS
    this.homeTab = { text: 'Home', native: '//*[@text="Home" or @content-desc="Home"]' };
    this.bookTab = { text: 'Book', native: '//*[@text="Book" or @content-desc="Book"]' };
    this.passTab = { text: 'Pass', native: '//*[@text="Pass" or @content-desc="Pass"]' };
    this.historyTab = { text: 'History', native: '//*[@text="History" or @content-desc="History"]' };

    // ACTIVE BOOKING
    this.activeBookingHeader = { text: 'Active Booking' };
    this.noActiveBookingText = { text: 'No Active Booking' };
    
    // STATS LABELS (Values are displayed above/below these titles)
    this.totalSlotsLabel = { text: 'Total Slots' };
    this.occupiedLabel = { text: 'Occupied' };
    this.freeSlotsLabel = { text: 'Free Slots' };
    this.historyLabel = { text: 'History' };
  }

  // NAVIGATION
  async clickHome() {
    logger.info('Navigating to Home tab');
    await this.click(this.homeTab);
  }

  async clickBook() {
    logger.info('Navigating to Book tab');
    await this.click(this.bookTab);
  }

  async clickPass() {
    logger.info('Navigating to Pass tab');
    await this.click(this.passTab);
  }

  async clickHistory() {
    logger.info('Navigating to History tab');
    await this.click(this.historyTab);
  }

  async logout() {
    logger.info('Logging out from Student Portal');
    await this.click(this.logoutButton);
  }

  // VALIDATIONS
  async getWelcomeMessage(studentName) {
    const welcomeText = `Welcome back, ${studentName}!`;
    await this.waitForDisplayed({ text: welcomeText });
    return welcomeText;
  }

  async getActiveBookingValue() {
    // Read the text card content
    if (await this.isDisplayed(this.noActiveBookingText)) {
      return 'No Active Booking';
    }
    // Search for text pattern Slot A-X
    const slotElement = await this.getElement({ native: '//*[contains(@text, "Slot A-")]' });
    return await slotElement.getText();
  }

  async getStatValue(statName) {
    // In mini stats cards, the layout is: Icon, Value, Title
    // In UiAutomator, we can look for siblings or locate by coordinates/indexing.
    // A robust way to fetch is getting the element with text statName and looking at its layout hierarchy.
    // Since it's a simple dashboard, we can query by xpath:
    const xpath = `//*[@text="${statName}"]/preceding-sibling::android.widget.TextView[1] | //android.widget.TextView[@text="${statName}"]/parent::*[1]/android.widget.TextView[1]`;
    const valEl = await this.getElement({ native: xpath });
    return await valEl.getText();
  }
}

module.exports = StudentDashboardPage;
