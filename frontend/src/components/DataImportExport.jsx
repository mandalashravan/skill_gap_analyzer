import { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';

export const DataImportExport = ({ 
  onImport, 
  onExport, 
  importTemplate, 
  exportFormats = ['json', 'csv'],
  title = 'Data Management'
}) => {
  const [importFile, setImportFile] = useState(null);
  const [importStatus, setImportStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportFile(file);
      setImportStatus('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setImportFile(file);
      setImportStatus('');
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportStatus('Please select a file first');
      return;
    }

    try {
      const text = await importFile.text();
      const data = importFile.name.endsWith('.json') 
        ? JSON.parse(text)
        : parseCSV(text);

      if (onImport) {
        await onImport(data);
        setImportStatus('success');
        setTimeout(() => {
          setImportFile(null);
          setImportStatus('');
        }, 2000);
      }
    } catch (error) {
      setImportStatus('Error processing file. Please check the format.');
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
    return data;
  };

  const handleExport = async (format) => {
    try {
      if (onExport) {
        const data = await onExport(format);
        let content, filename, mimeType;

        if (format === 'json') {
          content = JSON.stringify(data, null, 2);
          filename = `export-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
        } else if (format === 'csv') {
          content = convertToCSV(data);
          filename = `export-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const convertToCSV = (data) => {
    if (!Array.isArray(data) || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(item => 
      headers.map(header => {
        const value = item[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadTemplate = () => {
    if (importTemplate) {
      const template = importTemplate();
      const content = JSON.stringify(template, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'import-template.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline space-y-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      
      {/* Import Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-on-surface">Import Data</h4>
        
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-outline hover:border-primary/30 bg-surface-container-high'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={48} className="mx-auto text-on-surface-variant mb-4" />
          <p className="text-on-surface-variant mb-4">
            Drag and drop a file here, or click to browse
          </p>
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleFileSelect}
            className="hidden"
            id="file-import"
          />
          <label
            htmlFor="file-import"
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium cursor-pointer hover:bg-primary/90 transition-colors"
          >
            Choose File
          </label>
        </div>

        {importFile && (
          <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
            <span className="text-sm text-on-surface truncate">{importFile.name}</span>
            <button
              onClick={handleImport}
              className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              Import
            </button>
          </div>
        )}

        {importStatus && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            importStatus === 'success' 
              ? 'bg-emerald-500/10 text-emerald-500' 
              : 'bg-error-container text-on-error-container'
          }`}>
            {importStatus === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span className="text-sm font-medium">
              {importStatus === 'success' ? 'File imported successfully!' : importStatus}
            </span>
          </div>
        )}

        {importTemplate && (
          <button
            onClick={downloadTemplate}
            className="text-sm text-primary hover:underline"
          >
            Download Import Template
          </button>
        )}
      </div>

      {/* Export Section */}
      <div className="space-y-4">
        <h4 className="font-medium text-on-surface">Export Data</h4>
        <div className="flex flex-wrap gap-3">
          {exportFormats.map(format => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="flex items-center px-4 py-2 bg-surface-container-high text-on-surface rounded-lg border border-outline hover:bg-surface-container-highest transition-colors"
            >
              <Download size={16} className="mr-2" />
              Export as {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
