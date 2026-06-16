const { execSync } = require('child_process');
const logger = require('./logger');

class DeviceDetector {
  static detectDevices() {
    logger.info('Scanning for connected Android devices via adb...');
    try {
      const output = execSync('adb devices -l', { encoding: 'utf8' });
      const lines = output.trim().split('\n');
      const devices = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Pattern for adb devices: <udid> <status> product:<product> model:<model> device:<device> ...
        const parts = line.split(/\s+/);
        if (parts.length >= 2 && parts[1] === 'device') {
          const udid = parts[0];
          let model = 'Android Device';
          
          for (const part of parts) {
            if (part.startsWith('model:')) {
              model = part.split(':')[1].replace(/_/g, ' ');
            }
          }

          // Fetch OS Version
          let osVersion = '11.0'; // fallback default
          try {
            const versionOutput = execSync(`adb -s ${udid} shell getprop ro.build.version.release`, { encoding: 'utf8' });
            osVersion = versionOutput.trim() || osVersion;
          } catch (err) {
            logger.warn(`Could not retrieve Android version for device ${udid}, defaulting to ${osVersion}`);
          }

          const isEmulator = udid.includes('emulator') || udid.includes('127.0.0.1') || model.toLowerCase().includes('emulator');

          devices.push({
            udid,
            name: model,
            osVersion,
            isEmulator
          });
        }
      }

      logger.info(`Detected ${devices.length} active device(s).`);
      return devices;
    } catch (error) {
      logger.error(`Error executing adb devices: ${error.message}`);
      return [];
    }
  }

  static getPrimaryDevice() {
    const devices = this.detectDevices();
    if (devices.length > 0) {
      const device = devices[0];
      logger.info(`Using primary device: ${device.name} (UDID: ${device.udid}, Android ${device.osVersion})`);
      return device;
    }

    // Fallback default capabilities for emulator
    logger.warn('No active Android devices detected. Falling back to default emulator settings.');
    return {
      udid: 'emulator-5554',
      name: 'Android Emulator',
      osVersion: '11.0',
      isEmulator: true
    };
  }
}

module.exports = DeviceDetector;
