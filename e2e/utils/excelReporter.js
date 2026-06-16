const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

class ExcelReporter {
  static async generateReport(results) {
    logger.info('Generating Excel execution report...');
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const filePath = path.join(reportDir, 'Flutter_E2E_Report.xlsx');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Antigravity QA Automation';
    workbook.created = new Date();

    // ----------------------------------------------------
    // SHEET 1: Summary
    // ----------------------------------------------------
    const summarySheet = workbook.addWorksheet('Summary', { views: [{ showGridLines: true }] });
    
    // Add header title banner
    summarySheet.mergeCells('A1:B1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = 'PARKPILOT E2E EXECUTION SUMMARY';
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F2D59' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    summarySheet.getRow(1).height = 40;

    const summaryData = [
      ['Execution Date', results.executionDate || new Date().toISOString().split('T')[0]],
      ['Device Name', results.deviceName || 'Android Emulator'],
      ['Android Version', results.androidVersion || '11.0'],
      ['Total Tests', results.totalTests || 0],
      ['Passed', results.passed || 0],
      ['Failed', results.failed || 0],
      ['Skipped', results.skipped || 0],
      ['Pass Percentage', `${results.passPercentage || 0}%`],
      ['Duration', results.duration || '0s']
    ];

    summarySheet.addRows(summaryData);
    
    // Style rows in Summary sheet
    summarySheet.getColumn('A').width = 25;
    summarySheet.getColumn('B').width = 30;

    for (let r = 2; r <= 10; r++) {
      const row = summarySheet.getRow(r);
      row.getCell('A').font = { name: 'Segoe UI', size: 11, bold: true };
      row.getCell('A').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6EDF5' } };
      row.getCell('A').border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };

      row.getCell('B').font = { name: 'Segoe UI', size: 11 };
      row.getCell('B').border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };

      if (r === 9) { // Pass rate highlighting
        const passVal = parseFloat(results.passPercentage || 0);
        row.getCell('B').font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: passVal === 100 ? 'FF008000' : 'FFD04A02' } };
      }
      row.height = 25;
    }

    // ----------------------------------------------------
    // SHEET 2: Test Cases
    // ----------------------------------------------------
    const tcSheet = workbook.addWorksheet('Test Cases', { views: [{ showGridLines: true }] });
    tcSheet.getRow(1).values = ['Test ID', 'Module', 'Scenario', 'Status', 'Device', 'Duration'];
    tcSheet.columns = [
      { key: 'id', width: 15 },
      { key: 'module', width: 20 },
      { key: 'scenario', width: 35 },
      { key: 'status', width: 15 },
      { key: 'device', width: 25 },
      { key: 'duration', width: 15 }
    ];

    results.testCases.forEach((tc) => {
      tcSheet.addRow({
        id: tc.id,
        module: tc.module,
        scenario: tc.scenario,
        status: tc.status,
        device: tc.device,
        duration: tc.duration
      });
    });

    this.styleHeaderRow(tcSheet.getRow(1));

    for (let r = 2; r <= tcSheet.rowCount; r++) {
      const row = tcSheet.getRow(r);
      const statusCell = row.getCell('status');
      const status = statusCell.value || '';
      
      row.eachCell((cell) => {
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = this.getThinBorders();
        cell.alignment = { vertical: 'middle' };
      });

      if (status.toLowerCase() === 'passed') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
        statusCell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF375623' }, bold: true };
      } else if (status.toLowerCase() === 'failed') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4D6' } };
        statusCell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FFC65911' }, bold: true };
      } else {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } };
        statusCell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF806000' }, bold: true };
      }
      row.height = 22;
    }

    // ----------------------------------------------------
    // SHEET 3: Failed Tests
    // ----------------------------------------------------
    const failSheet = workbook.addWorksheet('Failed Tests', { views: [{ showGridLines: true }] });
    failSheet.getRow(1).values = ['Test Name', 'Failure Reason', 'Screenshot Path', 'Device', 'Android Version'];
    failSheet.columns = [
      { key: 'name', width: 30 },
      { key: 'reason', width: 45 },
      { key: 'screenshot', width: 40 },
      { key: 'device', width: 20 },
      { key: 'version', width: 15 }
    ];

    results.failedTests.forEach((f) => {
      failSheet.addRow({
        name: f.name,
        reason: f.reason,
        screenshot: f.screenshotPath || 'N/A',
        device: f.device,
        version: f.androidVersion
      });
    });

    this.styleHeaderRow(failSheet.getRow(1), 'FFC00000'); // red banner for failed sheet

    for (let r = 2; r <= failSheet.rowCount; r++) {
      const row = failSheet.getRow(r);
      row.eachCell((cell) => {
        cell.font = { name: 'Segoe UI', size: 10 };
        cell.border = this.getThinBorders();
        cell.alignment = { vertical: 'middle' };
      });
      // screenshot hyperlink format
      const ssCell = row.getCell('screenshot');
      if (ssCell.value !== 'N/A') {
        ssCell.font = { name: 'Segoe UI', size: 10, color: { argb: 'FF0563C1' }, underline: true };
      }
      row.height = 24;
    }

    // ----------------------------------------------------
    // SHEET 4: Execution Logs
    // ----------------------------------------------------
    const logSheet = workbook.addWorksheet('Execution Logs', { views: [{ showGridLines: true }] });
    logSheet.getRow(1).values = ['Timestamp', 'Test Name', 'Step', 'Result', 'Remarks'];
    logSheet.columns = [
      { key: 'timestamp', width: 22 },
      { key: 'testName', width: 30 },
      { key: 'step', width: 45 },
      { key: 'result', width: 15 },
      { key: 'remarks', width: 35 }
    ];

    results.executionLogs.forEach((log) => {
      logSheet.addRow({
        timestamp: log.timestamp,
        testName: log.testName,
        step: log.step,
        result: log.result,
        remarks: log.remarks || ''
      });
    });

    this.styleHeaderRow(logSheet.getRow(1));

    for (let r = 2; r <= logSheet.rowCount; r++) {
      const row = logSheet.getRow(r);
      row.eachCell((cell) => {
        cell.font = { name: 'Segoe UI', size: 9 };
        cell.border = this.getThinBorders();
        cell.alignment = { vertical: 'middle' };
      });
      row.height = 20;
    }

    // Write file
    await workbook.xlsx.writeFile(filePath);
    logger.info(`Excel report successfully saved: ${filePath}`);
    return filePath;
  }

  static styleHeaderRow(row, headerColor = 'FF1F497D') {
    row.height = 28;
    row.eachCell((cell) => {
      cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColor } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF000000' } },
        bottom: { style: 'medium', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };
    });
  }

  static getThinBorders() {
    return {
      top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
      right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
    };
  }
}

module.exports = ExcelReporter;
