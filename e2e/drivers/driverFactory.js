const { remote } = require('webdriverio');
const DeviceDetector = require('../utils/deviceDetector');
const logger = require('../utils/logger');

class DriverFactory {
  static async createDriver(options = {}) {
    const driverType = process.env.DRIVER_TYPE || options.driverType || 'uiautomator2'; // fallback to uiautomator2 for release APK
    const apkPath = process.env.APK_PATH || options.apkPath || './app/app-release.apk';
    const appPackage = process.env.APP_PACKAGE || options.appPackage || 'com.company.app';
    const appActivity = process.env.APP_ACTIVITY || options.appActivity || 'com.company.app.MainActivity';

    const device = DeviceDetector.getPrimaryDevice();
    
    logger.info(`Initializing Appium session using mode: ${driverType.toUpperCase()}`);
    
    const capabilities = {
      platformName: 'Android',
      'appium:deviceName': device.name,
      'appium:udid': device.udid,
      'appium:platformVersion': device.osVersion,
      'appium:app': apkPath,
      'appium:appPackage': appPackage,
      'appium:appActivity': appActivity,
      'appium:noReset': true, // Keep state to allow session persistence testing
      'appium:fullReset': false,
      'appium:newCommandTimeout': 300000,
      'appium:adbExecTimeout': 120000,
      'appium:androidInstallTimeout': 120000,
    };

    if (driverType.toLowerCase() === 'flutter') {
      capabilities['appium:automationName'] = 'Flutter';
    } else {
      capabilities['appium:automationName'] = 'UiAutomator2';
    }

    const wdOpts = {
      protocol: 'http',
      hostname: process.env.APPIUM_HOST || '127.0.0.1',
      port: parseInt(process.env.APPIUM_PORT || '4723', 10),
      path: '/',
      capabilities: capabilities,
      logLevel: 'warn'
    };

    try {
      logger.info('Connecting to Appium Server...');
      const driver = await remote(wdOpts);
      logger.info('Appium session successfully established.');
      return driver;
    } catch (error) {
      logger.error(`Failed to start Appium session: ${error.message}`);
      throw error;
    }
  }
}

module.exports = DriverFactory;
