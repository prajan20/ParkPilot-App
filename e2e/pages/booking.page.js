const BasePage = require('./base.page');
const logger = require('../utils/logger');

class BookingPage extends BasePage {
  constructor(driver) {
    super(driver);

    // GENERAL
    this.bookingScreenHeader = { text: 'Book a Slot' };
    this.cancelBookingButton = { text: 'Cancel Booking', key: 'cancel_booking_btn' };
    this.alreadyBookedSnackbar = { text: 'You already booked a slot' };

    // DIALOGS & SHEET
    this.bottomSheetHeaderPrefix = 'Select Timing for ';
    this.vehicleDialogTitle = { text: 'Enter Vehicle Number' };
    this.vehicleInputField = { native: '//android.widget.EditText' }; // default single textfield in dialog
    this.dialogCancelButton = { text: 'Cancel' };
    this.dialogBookButton = { text: 'Book' };

    // SUCCESS DIALOG
    this.successDialogTitle = { text: 'Booking Successful' };
    this.successOkButton = { text: 'OK' };
  }

  // ACTIONS
  async selectSlot(slotId) {
    logger.info(`Selecting slot: ${slotId}`);
    // Scroll if needed or locate slot directly
    const slotSelector = { text: slotId };
    await this.click(slotSelector);
  }

  async selectTiming(time) {
    logger.info(`Selecting timing option: ${time}`);
    const timeSelector = { text: time };
    await this.click(timeSelector);
  }

  async fillVehicleNumberAndBook(vehicleNo) {
    logger.info(`Entering vehicle plate: ${vehicleNo} and confirming book`);
    await this.waitForDisplayed(this.vehicleDialogTitle);
    await this.type(this.vehicleInputField, vehicleNo);
    await this.click(this.dialogBookButton);
  }

  async confirmSuccess() {
    logger.info('Confirming successful booking popup');
    await this.waitForDisplayed(this.successDialogTitle);
    await this.click(this.successOkButton);
  }

  async cancelActiveBooking() {
    logger.info('Canceling current active booking');
    await this.click(this.cancelBookingButton);
  }

  // UTILITY FLOW
  async executeFullBookingFlow(slotId, time, vehicleNo) {
    await this.selectSlot(slotId);
    await this.selectTiming(time);
    await this.fillVehicleNumberAndBook(vehicleNo);
    await this.confirmSuccess();
  }
}

module.exports = BookingPage;
