const BasePage = require('./base.page');
const logger = require('../utils/logger');

class ParkingHistoryPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.screenHeader = { text: 'Parking History' };
    this.noHistoryText = { text: 'No Parking History' };
  }

  // VALIDATIONS
  async isHistoryEmpty() {
    return await this.isDisplayed(this.noHistoryText);
  }

  async verifyHistoryRecord(slotId, vehicleNo, time, status) {
    logger.info(`Verifying history record contains Slot: ${slotId}, Vehicle: ${vehicleNo}, Time: ${time}, Status: ${status}`);
    
    // Find slot text
    const slotSelector = { text: `Slot: ${slotId}` };
    const vehicleSelector = { text: `Vehicle: ${vehicleNo}` };
    const timingSelector = { text: `Timing: ${time}` };
    const statusSelector = { text: status.toUpperCase() }; // ACTIVE or CANCELLED

    await this.waitForDisplayed(slotSelector);
    
    const slotOk = await this.isDisplayed(slotSelector);
    const vehicleOk = await this.isDisplayed(vehicleSelector);
    const timingOk = await this.isDisplayed(timingSelector);
    const statusOk = await this.isDisplayed(statusSelector);

    logger.info(`History record check values: Slot=${slotOk}, Vehicle=${vehicleOk}, Timing=${timingOk}, Status=${statusOk}`);
    return slotOk && vehicleOk && timingOk && statusOk;
  }
}

module.exports = ParkingHistoryPage;
