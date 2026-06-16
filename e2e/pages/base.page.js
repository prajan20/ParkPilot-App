const flutterFinder = require('appium-flutter-finder');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class BasePage {
  constructor(driver) {
    if (!driver) {
      throw new Error('Webdriver instance is required in page object constructor.');
    }
    this.driver = driver;
    this.isFlutter = false;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    try {
      const caps = await this.driver.getCapabilities();
      const autoName = caps.automationName || caps['appium:automationName'] || '';
      this.isFlutter = autoName.toLowerCase() === 'flutter';
      logger.info(`BasePage POM initialized. Mode: ${this.isFlutter ? 'Flutter Driver' : 'UiAutomator2'}`);
      this.initialized = true;
    } catch (err) {
      logger.warn(`Could not read capabilities, defaulting to UiAutomator2 mode: ${err.message}`);
      this.isFlutter = false;
      this.initialized = true;
    }
  }

  /**
   * Resolves a locator based on driver type.
   * locatorObject shape: { key, text, semantics, accessibilityId, native }
   */
  async getElement(locator) {
    await this.init();

    if (this.isFlutter) {
      if (locator.key) {
        return this.driver.$(flutterFinder.byValueKey(locator.key));
      }
      if (locator.text) {
        return this.driver.$(flutterFinder.byText(locator.text));
      }
      if (locator.semantics) {
        return this.driver.$(flutterFinder.bySemanticsLabel(locator.semantics));
      }
      if (locator.native) {
        return this.driver.$(locator.native);
      }
      return this.driver.$(locator);
    } else {
      // UiAutomator2 Mode
      if (locator.accessibilityId) {
        return this.driver.$(`~${locator.accessibilityId}`);
      }
      if (locator.native) {
        return this.driver.$(locator.native);
      }
      if (locator.text) {
        // Native search matching text or description
        return this.driver.$(`//*[@text="${locator.text}" or contains(@content-desc, "${locator.text}") or @hint="${locator.text}"]`);
      }
      if (locator.key) {
        // Map Flutter keys to native resource-id or accessibility description matching
        return this.driver.$(`//*[@resource-id="${locator.key}" or @content-desc="${locator.key}" or contains(@resource-id, "${locator.key}")]`);
      }
      return this.driver.$(locator);
    }
  }

  async click(locator) {
    const el = await this.getElement(locator);
    logger.info(`Clicking element: ${JSON.stringify(locator)}`);
    await el.waitForDisplayed({ timeout: 15000 });
    await el.click();
  }

  async type(locator, text) {
    const el = await this.getElement(locator);
    logger.info(`Typing text "${text}" into: ${JSON.stringify(locator)}`);
    await el.waitForDisplayed({ timeout: 15000 });
    // In Flutter driver we can use setValue, or key inputs.
    // setValue works natively for both.
    await el.setValue(text);
  }

  async clearText(locator) {
    const el = await this.getElement(locator);
    logger.info(`Clearing field: ${JSON.stringify(locator)}`);
    await el.waitForDisplayed({ timeout: 15000 });
    await el.clearValue();
  }

  async getText(locator) {
    const el = await this.getElement(locator);
    await el.waitForDisplayed({ timeout: 15000 });
    const text = await el.getText();
    logger.info(`Retrieved text "${text}" from: ${JSON.stringify(locator)}`);
    return text;
  }

  async isDisplayed(locator) {
    try {
      const el = await this.getElement(locator);
      const displayed = await el.isDisplayed();
      logger.info(`Element displayed state [${displayed}]: ${JSON.stringify(locator)}`);
      return displayed;
    } catch (err) {
      return false;
    }
  }

  async waitForDisplayed(locator, timeout = 15000) {
    const el = await this.getElement(locator);
    logger.info(`Waiting for element to be displayed: ${JSON.stringify(locator)}`);
    await el.waitForDisplayed({ timeout });
  }

  /**
   * Action methods for failure reporting
   */
  async captureScreenshot(testName) {
    const safeName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const failuresDir = path.join(process.cwd(), 'reports', 'failures');
    if (!fs.existsSync(failuresDir)) {
      fs.mkdirSync(failuresDir, { recursive: true });
    }
    const screenshotPath = path.join(failuresDir, `${safeName}_screenshot.png`);
    try {
      await this.driver.saveScreenshot(screenshotPath);
      logger.info(`Failure screenshot captured: ${screenshotPath}`);
      return screenshotPath;
    } catch (err) {
      logger.error(`Failed to capture screenshot: ${err.message}`);
      return null;
    }
  }

  async captureLogs(testName) {
    const safeName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const failuresDir = path.join(process.cwd(), 'reports', 'failures');
    const logPath = path.join(failuresDir, `${safeName}_device.log`);
    try {
      // Pull Android logcat logs
      const logTypes = await this.driver.getLogTypes();
      if (logTypes.includes('logcat')) {
        const logs = await this.driver.getLogs('logcat');
        const formattedLogs = logs.map(l => `${new Date(l.timestamp).toISOString()} [${l.level}] ${l.message}`).join('\n');
        fs.writeFileSync(logPath, formattedLogs, 'utf8');
        logger.info(`Device logcat captured: ${logPath}`);
        return logPath;
      }
    } catch (err) {
      logger.warn(`Could not capture device logs: ${err.message}`);
    }
    return null;
  }

  async dumpWidgetTree(testName) {
    const safeName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const failuresDir = path.join(process.cwd(), 'reports', 'failures');
    const treePath = path.join(failuresDir, `${safeName}_widget_tree.xml`);
    try {
      const source = await this.driver.getPageSource();
      fs.writeFileSync(treePath, source, 'utf8');
      logger.info(`Page source widget tree dumped: ${treePath}`);
      return treePath;
    } catch (err) {
      logger.error(`Failed to dump widget tree: ${err.message}`);
      return null;
    }
  }
}

module.exports = BasePage;
