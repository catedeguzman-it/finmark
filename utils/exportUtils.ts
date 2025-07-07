'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
  title: string;
  subtitle?: string;
  data: any[];
  columns: { header: string; dataKey: string; width?: number }[];
  summary?: { label: string; value: string }[];
}

export const exportToPDF = (exportData: ExportData) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(exportData.title, pageWidth / 2, 20, { align: 'center' });
    
    // Add subtitle if provided
    if (exportData.subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(exportData.subtitle, pageWidth / 2, 30, { align: 'center' });
    }
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);
    
    let yPosition = 50;
    
    // Add summary if provided
    if (exportData.summary && exportData.summary.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      exportData.summary.forEach((item) => {
        doc.text(`${item.label}: ${item.value}`, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
    }
    
    // Add table
    autoTable(doc, {
      startY: yPosition,
      head: [exportData.columns.map(col => col.header)],
      body: exportData.data.map(row => 
        exportData.columns.map(col => {
          const value = row[col.dataKey];
          if (typeof value === 'number') {
            return value.toLocaleString();
          }
          if (value instanceof Date) {
            return value.toLocaleDateString();
          }
          return value?.toString() || '';
        })
      ),
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });
    
    // Save the PDF
    const fileName = `${exportData.title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: 'Failed to generate PDF' };
  }
};

export const exportToCSV = (exportData: ExportData) => {
  try {
    // Create CSV header
    const headers = exportData.columns.map(col => col.header);
    const csvContent = [headers.join(',')];
    
    // Add data rows
    exportData.data.forEach(row => {
      const csvRow = exportData.columns.map(col => {
        const value = row[col.dataKey];
        let cellValue = '';
        
        if (typeof value === 'number') {
          cellValue = value.toString();
        } else if (value instanceof Date) {
          cellValue = value.toLocaleDateString();
        } else {
          cellValue = value?.toString() || '';
        }
        
        // Escape commas and quotes
        if (cellValue.includes(',') || cellValue.includes('"')) {
          cellValue = `"${cellValue.replace(/"/g, '""')}"`;
        }
        
        return cellValue;
      });
      csvContent.push(csvRow.join(','));
    });
    
    // Create and download file
    const csvString = csvContent.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `${exportData.title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating CSV:', error);
    return { success: false, error: 'Failed to generate CSV' };
  }
};

export const exportToExcel = (exportData: ExportData) => {
  try {
    // Create a simple Excel-compatible format using CSV with tab separators
    const headers = exportData.columns.map(col => col.header);
    const excelContent = [headers.join('\t')];
    
    // Add data rows
    exportData.data.forEach(row => {
      const excelRow = exportData.columns.map(col => {
        const value = row[col.dataKey];
        if (typeof value === 'number') {
          return value.toString();
        } else if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        return value?.toString() || '';
      });
      excelContent.push(excelRow.join('\t'));
    });
    
    // Create and download file
    const excelString = excelContent.join('\n');
    const blob = new Blob([excelString], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `${exportData.title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xls`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating Excel:', error);
    return { success: false, error: 'Failed to generate Excel file' };
  }
};

export const showExportOptions = (exportData: ExportData) => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold mb-4">Export Report</h3>
      <p class="text-gray-600 mb-6">Choose your preferred export format:</p>
      <div class="space-y-3">
        <button id="export-pdf" class="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
          Export as PDF
        </button>
        <button id="export-csv" class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
          Export as CSV
        </button>
        <button id="export-excel" class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Export as Excel
        </button>
        <button id="export-cancel" class="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('#export-pdf')?.addEventListener('click', () => {
    exportToPDF(exportData);
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#export-csv')?.addEventListener('click', () => {
    exportToCSV(exportData);
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#export-excel')?.addEventListener('click', () => {
    exportToExcel(exportData);
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#export-cancel')?.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
};

export const showSuccessToast = (message: string) => {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

export const showDummyAction = (actionName: string) => {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
  toast.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>${actionName} - Demo Mode</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};