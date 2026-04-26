export const generatePDFReport = (analysisData, jobRole, userSkills) => {
  const { matched_skills, missing_skills, readiness_score, suggestions } = analysisData;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Skill Gap Analysis Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #adc6ff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #002e6a;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: #666;
          margin: 5px 0 0 0;
          font-size: 16px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          color: #002e6a;
          border-left: 4px solid #adc6ff;
          padding-left: 15px;
          font-size: 20px;
        }
        .score-container {
          text-align: center;
          margin: 30px 0;
        }
        .score-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 8px solid #adc6ff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%);
        }
        .score-text {
          font-size: 36px;
          font-weight: bold;
          color: #002e6a;
        }
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 20px 0;
        }
        .skill-box {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
        }
        .skill-box h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }
        .matched {
          border-left: 4px solid #10b981;
          background-color: #f0fdf4;
        }
        .matched h3 {
          color: #10b981;
        }
        .missing {
          border-left: 4px solid #ef4444;
          background-color: #fef2f2;
        }
        .missing h3 {
          color: #ef4444;
        }
        .skill-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .skill-list li {
          background: #f8fafc;
          margin: 5px 0;
          padding: 10px;
          border-radius: 4px;
          border-left: 3px solid #64748b;
        }
        .priority {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          margin-left: 8px;
        }
        .priority-high {
          background-color: #fef2f2;
          color: #dc2626;
        }
        .priority-medium {
          background-color: #fffbeb;
          color: #d97706;
        }
        .priority-low {
          background-color: #f1f5f9;
          color: #2563eb;
        }
        .suggestions {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
        }
        .suggestions h3 {
          color: #002e6a;
          margin-top: 0;
        }
        .suggestions ul {
          padding-left: 20px;
        }
        .suggestions li {
          margin: 8px 0;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #666;
          font-size: 14px;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Skill Gap Analysis Report</h1>
        <p>Target Role: <strong>${jobRole}</strong></p>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <div class="score-container">
          <div class="score-circle">
            <div class="score-text">${readiness_score}%</div>
          </div>
          <p style="margin-top: 15px; font-size: 18px; color: #666;">
            Job Readiness Score
          </p>
        </div>
      </div>

      <div class="section">
        <h2>Skills Analysis</h2>
        <div class="skills-grid">
          <div class="skill-box matched">
            <h3>✓ Matched Skills (${matched_skills.length})</h3>
            <ul class="skill-list">
              ${matched_skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
          </div>
          
          <div class="skill-box missing">
            <h3>✗ Skills to Develop (${missing_skills.length})</h3>
            <ul class="skill-list">
              ${missing_skills.map(skill => 
                `<li>${skill.skill} <span class="priority priority-${skill.priority.toLowerCase()}">${skill.priority}</span></li>`
              ).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Improvement Suggestions</h2>
        <div class="suggestions">
          <h3>📋 ATS Optimization Tips</h3>
          <ul>
            ${suggestions.ats_tips?.map(tip => `<li>${tip}</li>`).join('') || '<li>No specific suggestions available</li>'}
          </ul>
          
          <h3 style="margin-top: 20px;">🚀 Suggested Projects</h3>
          <ul>
            ${suggestions.project_ideas?.map(idea => `<li>${idea}</li>`).join('') || '<li>No specific project suggestions available</li>'}
          </ul>
          
          <h3 style="margin-top: 20px;">🔑 Missing Keywords</h3>
          <p style="background: #f1f5f9; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${suggestions.missing_keywords?.join(', ') || 'No missing keywords identified'}
          </p>
        </div>
      </div>

      <div class="footer">
        <p>This report was generated by Digital Skill Gap Analyzer</p>
        <p>For detailed insights and progress tracking, visit your dashboard</p>
      </div>
    </body>
    </html>
  `;

  // Create a new window and print
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

export const downloadAnalysisAsJSON = (analysisData, filename = 'analysis-report') => {
  const dataStr = JSON.stringify(analysisData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
