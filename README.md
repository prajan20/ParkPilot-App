# ParkPilot - Smart Parking Management System & E2E Testing Framework

ParkPilot is a Flutter Android application designed for campus or facility parking management. It includes a Student Portal for parking slot booking and QR pass generation, alongside an Admin Portal for slot blocking, dashboard analytics audit, and administrative cancellations.

This repository integrates a production-ready **Appium 2.x End-to-End Automation Framework** built using JavaScript, Mocha, Chai, ExcelJS, Winston, and custom HTML reports.

---

## 📋 Framework Features
1. **Dynamic Driver Engine**: Factory support for both `appium-flutter-driver` (using debug WebSocket finder hooks) and `appium-uiautomator2-driver` (native Accessibility / Semantics trees mapping).
2. **Auto Device Detection**: Auto-detects connected Android physical devices or running emulators via local `adb` commands.
3. **W3C Actions Gestures**: Native helper support for complex swipes, double-taps, drags/drops, and zoom gestures.
4. **Autonomous AI Crawler**: An automated smart tester module that queries screen structures dynamically, parses elements, runs validation boundary testing, and expands coverage paths.
5. **Stylized Reports**: Generates multi-sheet Excel reports (`Flutter_E2E_Report.xlsx`) and dark-theme HTML dashboards (`index.html`) with embedded screenshots.
6. **Failure Capture System**: Stores logs, screenshot snapshots, and full page source XML dumps in `reports/failures/` upon test suite failures.
7. **CI/CD Integration**: Integrated GitHub Actions script (`.github/workflows/flutter-appium.yml`) that spins up headless Android emulators and runs Appium verification pipelines.

---

## 📂 Project Directory Structure

```
parkpilot/
├── .github/workflows/          # GitHub Actions CI pipelines
│   └── flutter-appium.yml      # Appium emulator build workflow
├── app/                        # APK target directory
│   └── app-release.apk         # Compiled Flutter APK
├── e2e/                        # E2E Automation Core folder
│   ├── ai/
│   │   └── smartTester.js      # Autonomous Smart AI tester module
│   ├── drivers/
│   │   └── driverFactory.js    # Session manager and capabilities builder
│   ├── pages/                  # Page Object Models (POM)
│   │   ├── base.page.js        # Locator translation and capture helpers
│   │   ├── login.page.js       # Student & Admin authentication POM
│   │   ├── studentDashboard.page.js
│   │   ├── booking.page.js     # Slot grid and dialog confirmations
│   │   ├── qrPass.page.js
│   │   ├── parkingHistory.page.js
│   │   ├── adminDashboard.page.js
│   │   └── adminActions.page.js# Manage slots grids and logs audit POM
│   ├── tests/                  # Mocha Test Suites
│   │   ├── resultsCollector.js # Test results and logs accumulator
│   │   ├── auth.test.js        # Authentication scenarios
│   │   ├── formValidation.test.js
│   │   ├── e2eScenarios.test.js# Student & Admin transactions scenarios
│   │   └── smartAi.test.js     # AI crawl test trigger
│   ├── utils/                  # Helper modules
│   │   ├── deviceDetector.js   # adb query module
│   │   ├── logger.js           # Winston configurations
│   │   ├── gestures.js         # Touch actions W3C payload generator
│   │   ├── excelReporter.js    # ExcelJS report creator
│   │   └── htmlReporter.js     # Glassmorphic HTML creator
│   └── setup.md                # System setup details
├── lib/                        # Flutter Application Source code
├── package.json                # NPM configuration, dependencies & script triggers
└── README.md                   # This project index
```

---

## 🚀 Quick Start Instructions

1. **Install NPM packages**:
   ```bash
   npm install
   ```
2. **Start Appium server locally**:
   ```bash
   appium
   ```
3. **Execute E2E Test Suite**:
   ```bash
   npm run test
   ```
4. **Execute Smart AI Crawler**:
   ```bash
   npm run test:ai
   ```

*For step-by-step developer system pre-requisites and Android Studio environment setup, see the [E2E Setup Guide](file:///f:/parkpilot/e2e/setup.md).*
