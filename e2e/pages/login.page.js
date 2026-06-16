const BasePage = require('./base.page');
const logger = require('../utils/logger');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);

    // STUDENT PORTAL LOCATORS
    this.studentNameInput = { text: 'Student Name', key: 'student_name_field' };
    this.studentEmailInput = { text: 'University Email', key: 'student_email_field' };
    this.studentPasswordInput = { text: 'Password', key: 'student_password_field' };
    this.studentLoginButton = { text: 'LOGIN', key: 'student_login_btn' };
    this.switchToAdminButton = { text: 'Are you an Admin? Login here', key: 'switch_to_admin_btn' };

    // ADMIN PORTAL LOCATORS
    this.adminIdInput = { text: 'Admin ID', key: 'admin_id_field' };
    this.adminPasswordInput = { text: 'Password', key: 'admin_password_field' }; // note: overlaps with student password label on some UI structures
    this.adminLoginButton = { text: 'ADMIN LOGIN', key: 'admin_login_btn' };
    this.switchToStudentButton = { text: 'Are you a Student? Login here', key: 'switch_to_student_btn' };
  }

  // ACTIONS
  async switchToAdmin() {
    logger.info('Switching to Admin login screen');
    await this.click(this.switchToAdminButton);
    await this.waitForDisplayed(this.adminIdInput);
  }

  async switchToStudent() {
    logger.info('Switching to Student login screen');
    await this.click(this.switchToStudentButton);
    await this.waitForDisplayed(this.studentNameInput);
  }

  async loginAsStudent(name, email, password) {
    logger.info(`Attempting student login with Name: ${name}, Email: ${email}`);
    if (name !== null) {
      await this.clearText(this.studentNameInput);
      await this.type(this.studentNameInput, name);
    }
    if (email !== null) {
      await this.clearText(this.studentEmailInput);
      await this.type(this.studentEmailInput, email);
    }
    if (password !== null) {
      await this.clearText(this.studentPasswordInput);
      await this.type(this.studentPasswordInput, password);
    }
    await this.click(this.studentLoginButton);
  }

  async loginAsAdmin(adminId, password) {
    logger.info(`Attempting admin login with ID: ${adminId}`);
    if (adminId !== null) {
      // Find the specific Admin ID field. To avoid overlap on password field, do ID first.
      await this.clearText(this.adminIdInput);
      await this.type(this.adminIdInput, adminId);
    }
    if (password !== null) {
      // Find password field. In Admin layout, the first label 'Password' corresponds to password.
      const passLoc = this.isFlutter ? this.adminPasswordInput : { native: '//android.widget.EditText[contains(@text, "Password") or @hint="Password" or @resource-id="admin_password_field"]' };
      await this.type(passLoc, password);
    }
    await this.click(this.adminLoginButton);
  }

  // VALIDATION & TOAST CHECKERS
  async getValidationMessage(msg) {
    const locator = { text: msg };
    await this.waitForDisplayed(locator, 8000);
    return await this.getText(locator);
  }

  async isValidationMessageDisplayed(msg) {
    return await this.isDisplayed({ text: msg });
  }

  async isSnackbarDisplayed(text) {
    // Snackbars have a Text widget displaying message
    return await this.isDisplayed({ text: text });
  }
}

module.exports = LoginPage;
