const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class HtmlReporter {
  static async generateReport(results) {
    logger.info('Generating HTML execution dashboard...');
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const filePath = path.join(reportDir, 'index.html');
    
    // Calculate SVG donut stroke offsets
    const total = results.totalTests || 0;
    const passed = results.passed || 0;
    const failed = results.failed || 0;
    const skipped = results.skipped || 0;
    
    const passedPct = total > 0 ? Math.round((passed / total) * 100) : 0;
    const failedPct = total > 0 ? Math.round((failed / total) * 100) : 0;
    const skippedPct = total > 0 ? Math.round((skipped / total) * 100) : 0;

    // SVG parameters for circle
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const passedStroke = (passedPct / 100) * circumference;
    const failedStroke = (failedPct / 100) * circumference;
    const skippedStroke = (skippedPct / 100) * circumference;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ParkPilot Automation Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-color: #050B18;
      --surface-color: rgba(17, 24, 39, 0.7);
      --border-color: rgba(6, 182, 212, 0.2);
      --primary: #06b6d4;
      --secondary: #3b82f6;
      --success: #10b981;
      --error: #ef4444;
      --warning: #f59e0b;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background: radial-gradient(circle at top, #0f172a 0%, var(--bg-color) 100%);
      color: var(--text-main);
      padding: 2rem;
      min-height: 100vh;
      line-height: 1.5;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1.5rem;
    }

    .title-area h1 {
      font-size: 2.2rem;
      font-weight: 700;
      letter-spacing: 1px;
      background: linear-gradient(to right, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-area p {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }

    .meta-badge {
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid var(--primary);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--primary);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background: var(--surface-color);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: var(--glass-shadow);
    }

    .stat-card-wrapper {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .mini-stat {
      background: rgba(255, 255, 255, 0.03);
      padding: 1rem;
      border-radius: 15px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    .mini-stat.passed h3 { color: var(--success); }
    .mini-stat.failed h3 { color: var(--error); }
    
    .mini-stat p {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
    }

    .mini-stat h3 {
      font-size: 1.8rem;
      font-weight: 700;
    }

    .chart-card {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .chart-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      margin-right: 8px;
    }

    .legend-color.passed { background-color: var(--success); }
    .legend-color.failed { background-color: var(--error); }
    .legend-color.skipped { background-color: var(--warning); }

    .device-card ul {
      list-style: none;
    }

    .device-card li {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.95rem;
    }

    .device-card li:last-child {
      border: none;
    }

    .device-card span.label {
      color: var(--text-muted);
    }

    .device-card span.val {
      font-weight: 600;
      color: var(--text-main);
    }

    .section-title {
      font-size: 1.5rem;
      margin: 2rem 0 1rem 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 24px;
      background: var(--primary);
      border-radius: 2px;
    }

    /* TABLE STYLES */
    .table-container {
      overflow-x: auto;
      margin-bottom: 2rem;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      box-shadow: var(--glass-shadow);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--surface-color);
      text-align: left;
    }

    th {
      background: rgba(6, 182, 212, 0.1);
      padding: 1rem;
      font-weight: 600;
      color: var(--primary);
      font-size: 0.95rem;
      border-bottom: 1px solid var(--border-color);
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.92rem;
    }

    tr:last-child td {
      border: none;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .badge.passed {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .badge.failed {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .badge.skipped {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    /* FAILURES ACCORDION */
    .failures-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .failure-item {
      background: rgba(239, 68, 68, 0.03);
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 15px;
      padding: 1.25rem;
    }

    .failure-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .failure-title {
      font-size: 1.1rem;
      color: #f87171;
      font-weight: 600;
    }

    .failure-content {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .failure-details {
      flex: 2;
      min-width: 300px;
    }

    .failure-reason {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      border-radius: 10px;
      font-family: monospace;
      font-size: 0.85rem;
      color: #fda4af;
      border: 1px solid rgba(239, 68, 68, 0.15);
      white-space: pre-wrap;
      overflow-x: auto;
    }

    .failure-screenshot {
      flex: 1;
      min-width: 200px;
      max-width: 350px;
      text-align: center;
    }

    .failure-screenshot img {
      max-width: 100%;
      border-radius: 10px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .failure-screenshot img:hover {
      transform: scale(1.03);
    }

    .failure-screenshot p {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }

    /* MODAL FOR IMAGE VIEW */
    .modal {
      display: none;
      position: fixed;
      z-index: 999;
      padding-top: 50px;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.9);
    }

    .modal-content {
      margin: auto;
      display: block;
      max-width: 80%;
      max-height: 85vh;
      border-radius: 10px;
    }

    .modal-close {
      position: absolute;
      top: 15px;
      right: 35px;
      color: #f1f1f1;
      font-size: 40px;
      font-weight: bold;
      transition: 0.3s;
      cursor: pointer;
    }

    .modal-close:hover {
      color: #bbb;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="title-area">
        <h1>ParkPilot E2E Test Execution</h1>
        <p>Comprehensive Flutter Application Automation Report</p>
      </div>
      <div class="meta-badge">Mocha & Chai Framework</div>
    </header>

    <div class="dashboard-grid">
      <!-- Statistics Card -->
      <div class="card stat-card-wrapper">
        <div class="mini-stat">
          <p>Total Tests</p>
          <h3>\${total}</h3>
        </div>
        <div class="mini-stat passed">
          <p>Passed</p>
          <h3>\${passed}</h3>
        </div>
        <div class="mini-stat failed">
          <p>Failed</p>
          <h3>\${failed}</h3>
        </div>
        <div class="mini-stat">
          <p>Duration</p>
          <h3 style="font-size: 1.4rem; padding-top: 0.4rem;">\${results.duration || '0s'}</h3>
        </div>
      </div>

      <!-- Charts Card -->
      <div class="card chart-card">
        <svg width="150" height="150" viewBox="0 0 120 120" style="transform: rotate(-90deg);">
          <circle cx="60" cy="60" r="\${radius}" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="12"/>
          
          <circle cx="60" cy="60" r="\${radius}" fill="transparent" stroke="var(--success)" stroke-width="12"
                  stroke-dasharray="\${circumference}" stroke-dashoffset="\${circumference - passedStroke}" />
                  
          <circle cx="60" cy="60" r="\${radius}" fill="transparent" stroke="var(--error)" stroke-width="12"
                  stroke-dasharray="\${circumference}" stroke-dashoffset="\${circumference - passedStroke - failedStroke}" />
        </svg>

        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color passed"></span>
            Passed: \${passedPct}% (\${passed})
          </div>
          <div class="legend-item">
            <span class="legend-color failed"></span>
            Failed: \${failedPct}% (\${failed})
          </div>
          <div class="legend-item">
            <span class="legend-color skipped"></span>
            Skipped: \${skippedPct}% (\${skipped})
          </div>
        </div>
      </div>

      <!-- Device Spec Card -->
      <div class="card device-card">
        <ul>
          <li><span class="label">Date</span><span class="val">\${results.executionDate || new Date().toISOString().split('T')[0]}</span></li>
          <li><span class="label">Platform</span><span class="val">Android</span></li>
          <li><span class="label">Device Name</span><span class="val">\${results.deviceName || 'Android Emulator'}</span></li>
          <li><span class="label">Android Version</span><span class="val">\${results.androidVersion || '11.0'}</span></li>
        </ul>
      </div>
    </div>

    <!-- FAILURE EXPLORER (Only if failures exist) -->
    \${results.failedTests && results.failedTests.length > 0 ? \`
    <h2 class="section-title">Failure Analysis</h2>
    <div class="failures-list">
      \${results.failedTests.map((f) => \`
      <div class="failure-item">
        <div class="failure-header">
          <span class="failure-title">\${f.name}</span>
          <span class="badge failed">Failed</span>
        </div>
        <div class="failure-content">
          <div class="failure-details">
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;">Stack Trace / Failure Reason:</p>
            <pre class="failure-reason">\${f.reason}</pre>
          </div>
          \${f.screenshotPath ? \`
          <div class="failure-screenshot">
            <img src="./failures/\${path.basename(f.screenshotPath)}" alt="Failure Screenshot" onclick="viewImage(this.src)">
            <p>Click to expand</p>
          </div>
          \` : ''}
        </div>
      </div>
      \`).join('')}
    </div>
    \` : ''}

    <!-- TEST CASE RECORDS -->
    <h2 class="section-title">Test Case Records</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Module</th>
            <th>Scenario</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          \${results.testCases.map((tc) => \`
          <tr>
            <td style="font-weight: 600; color: var(--primary);">\${tc.id}</td>
            <td>\${tc.module}</td>
            <td>\${tc.scenario}</td>
            <td>\${tc.duration}</td>
            <td><span class="badge \${tc.status.toLowerCase()}">\${tc.status}</span></td>
          </tr>
          \`).join('')}
        </tbody>
      </table>
    </div>

    <!-- LOGS RECORDS -->
    <h2 class="section-title">Chronological Steps</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 15%;">Timestamp</th>
            <th style="width: 25%;">Test Name</th>
            <th style="width: 35%;">Action / Step</th>
            <th style="width: 10%;">Result</th>
            <th style="width: 15%;">Remarks</th>
          </tr>
        </thead>
        <tbody>
          \${results.executionLogs.map((log) => \`
          <tr>
            <td style="color: var(--text-muted); font-size: 0.8rem;">\${log.timestamp}</td>
            <td style="font-weight: 600;">\${log.testName}</td>
            <td>\${log.step}</td>
            <td><span class="badge \${log.result.toLowerCase() === 'pass' ? 'passed' : log.result.toLowerCase() === 'fail' ? 'failed' : 'skipped'}">\${log.result}</span></td>
            <td style="color: var(--text-muted); font-size: 0.85rem;">\${log.remarks || ''}</td>
          </tr>
          \`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Image modal viewer -->
  <div id="imageModal" class="modal" onclick="closeModal()">
    <span class="modal-close" onclick="closeModal()">&times;</span>
    <img class="modal-content" id="expandedImage">
  </div>

  <script>
    function viewImage(src) {
      document.getElementById('imageModal').style.display = "block";
      document.getElementById('expandedImage').src = src;
    }
    function closeModal() {
      document.getElementById('imageModal').style.display = "none";
    }
  </script>
</body>
</html>`;

    fs.writeFileSync(filePath, htmlContent, 'utf8');
    logger.info(`HTML execution report saved: ${filePath}`);
    return filePath;
  }
}

module.exports = HtmlReporter;
