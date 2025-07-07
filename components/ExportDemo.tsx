'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Table } from 'lucide-react';
import { showExportOptions, showDummyAction, type ExportData } from '@/utils/exportUtils';

const sampleData = [
  { name: 'Apple Inc.', type: 'Stock', value: 150000, change: 5.2, risk: 'Medium' },
  { name: 'Microsoft Corp.', type: 'Stock', value: 120000, change: 3.8, risk: 'Low' },
  { name: 'Tesla Inc.', type: 'Stock', value: 80000, change: -2.1, risk: 'High' },
  { name: 'Amazon.com Inc.', type: 'Stock', value: 95000, change: 1.5, risk: 'Medium' },
  { name: 'Google (Alphabet)', type: 'Stock', value: 110000, change: 4.3, risk: 'Low' }
];

export default function ExportDemo() {
  const handleExportDemo = () => {
    const exportData: ExportData = {
      title: 'Sample Portfolio Report',
      subtitle: 'Demo export functionality with sample investment data',
      data: sampleData,
      columns: [
        { header: 'Investment Name', dataKey: 'name' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Value ($)', dataKey: 'value' },
        { header: 'Change (%)', dataKey: 'change' },
        { header: 'Risk Level', dataKey: 'risk' }
      ],
      summary: [
        { label: 'Total Portfolio Value', value: `$${sampleData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}` },
        { label: 'Number of Holdings', value: sampleData.length.toString() },
        { label: 'Average Change', value: `${(sampleData.reduce((sum, item) => sum + item.change, 0) / sampleData.length).toFixed(2)}%` }
      ]
    };
    showExportOptions(exportData);
  };

  const handleDummyAction = () => {
    showDummyAction('Demo Action Triggered');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export Functionality Demo
        </CardTitle>
        <CardDescription>
          Test the export functionality with sample data. You can export to PDF, CSV, or Excel formats.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={handleExportDemo} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Sample Report
          </Button>
          <Button variant="outline" onClick={handleDummyAction} className="w-full">
            <Table className="h-4 w-4 mr-2" />
            Demo Action
          </Button>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Sample Data Preview:</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="font-medium">Investment</div>
              <div className="font-medium">Value</div>
              <div className="font-medium">Change</div>
              {sampleData.slice(0, 3).map((item, index) => (
                <React.Fragment key={index}>
                  <div className="truncate">{item.name}</div>
                  <div>${item.value.toLocaleString()}</div>
                  <div className={item.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </React.Fragment>
              ))}
              <div className="col-span-3 text-xs text-gray-500 mt-2">
                ...and {sampleData.length - 3} more items
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}