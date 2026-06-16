# Developer Setup Guide - ParkPilot E2E Automation Framework

This guide provides step-by-step instructions to set up the automation framework on a local development machine.

---

## 1. System Requirements
- **Node.js**: version `v16.0.0` or higher (recommended: `v18.x` or `v20.x`).
- **Java Development Kit (JDK)**: version `11` or `17`.
- **Android SDK**: platform tools, build tools, command line tools, and at least one emulator system image.
- **Appium**: Appium `2.x` CLI.

---

## 2. Installation & Setup Steps

### Step A: Install Node.js Dependencies
Navigate to the root workspace and run:
```bash
npm install
```

### Step B: Install Appium 2.x Global Server
Install Appium globally using npm:
```bash
npm install -g appium@next
```

### Step C: Install Appium Driver Extensions
For native Android testing:
```bash
appium driver install uiautomator2
```
For profile/debug Flutter testing:
```bash
appium driver install --source=npm appium-flutter-driver
```
Verify the drivers are active:
```bash
appium driver list --installed
```

### Step D: Setup Environment Variables
Ensure the following are added to your shell profile (`.bashrc`, `.zshrc` or Windows system variables):
- `ANDROID_HOME`: Points to your Android SDK directory (e.g. `C:\Users\<User>\AppData\Local\Android\Sdk`).
- Add platform tools and emulator paths to your `PATH` variable:
  - `%ANDROID_HOME%\platform-tools`
  - `%ANDROID_HOME%\emulator`
- `JAVA_HOME`: Points to your JDK directory.

---

## 3. Preparing the Device / Emulator
1. Open Android Studio -> Device Manager.
2. Spin up an Android Emulator (API 30+ recommended).
3. Check that the device is detected in your terminal:
   ```bash
   adb devices
   ```

---

## 4. Preparing the Flutter APK
Ensure that the APK is compiled and placed in the `./app` directory:
- For **Release Mode** (automated via `uiautomator2` mode):
  ```bash
  flutter build apk --release
  mkdir app
  cp build/app/outputs/flutter-apk/app-release.apk ./app/app-release.apk
  ```
- For **Debug Mode** (enables `flutter-driver` WebSocket bindings):
  ```bash
  flutter build apk --debug
  mkdir app
  cp build/app/outputs/flutter-apk/app-debug.apk ./app/app-release.apk
  ```

---

## 5. Running the Tests

### Step 1: Start Appium Server
Open a terminal tab and run:
```bash
appium
```
*Note: Default address is `http://127.0.0.1:4723/`.*

### Step 2: Execute Mocha Suites
- To execute the **full business scenarios**:
  ```bash
  npm run test
  ```
- To execute the **smart AI testing crawls**:
  ```bash
  npm run test:ai
  ```
- To execute specific modules:
  - Auth: `npm run test:auth`
  - Form validation: `npm run test:form`

---

## 6. Accessing Test Reports
All test logs and reports are compiled under the `reports/` folder:
1. **Excel Summary**: `reports/Flutter_E2E_Report.xlsx`. Open in Excel to check metrics and execution logs.
2. **HTML Dashboard**: `reports/index.html`. Double-click to open in any web browser to view progress charts and interactive screenshot details.
3. **Failure Screen Captures**: Located under `reports/failures/` on any failure.
