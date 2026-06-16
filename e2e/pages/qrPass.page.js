const BasePage = require('./base.page');
const logger = require('../utils/logger');

class QrPassPage extends BasePage {
  constructor(driver) {
    super(driver);

    this.screenHeader = { text: 'QR Parking Pass' };
    this.noActiveBookingText = { text: 'No Active Booking' };
    this.passHeader = { text: 'PARKPILOT PASS' };
    this.activeTag = { text: 'ACTIVE' };
    this.scanInstruction = { text: 'Scan this QR at parking entrance' };
  }

  // VALIDATIONS
  async verifyActivePassDetails(slotId, time, vehicleNo, studentName) {
    logger.info(`Verifying QR Pass for Slot: ${slotId}, Time: ${time}, Vehicle: ${vehicleNo}, Student: ${studentName}`);
    
    await this.waitForDisplayed(this.passHeader);
    
    const isPassHeaderVisible = await this.isDisplayed(this.passHeader);
    const isActiveTagVisible = await this.isDisplayed(this.activeTag);
    const isSlotVisible = await this.isDisplayed({ text: slotId });
    const isTimingVisible = await this.isDisplayed({ text: `Timing: ${time}` });
    const isVehicleVisible = await this.isDisplayed({ text: `Vehicle: ${vehicleNo}` });
    const isStudentVisible = await this.isDisplayed({ text: `Student: ${studentName}` });
    const isInstructionVisible = await this.isDisplayed(this.scanInstruction);

    logger.info(`QR Pass checks: Header=${isPassHeaderVisible}, Tag=${isActiveTagVisible}, Slot=${isSlotVisible}, Details=T:${isTimingVisible}/V:${isVehicleVisible}/S:${isStudentVisible}`);

    return isPassHeaderVisible && isActiveTagVisible && isSlotVisible && isTimingVisible && isVehicleVisible && isStudentVisible && isInstructionVisible;
  }

  async hasNoActiveBooking() {
    return await this.isDisplayed(this.noActiveBookingText);
  }
}

module.exports = QrPassPage;
