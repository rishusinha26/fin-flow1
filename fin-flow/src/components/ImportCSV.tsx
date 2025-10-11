import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useExpenses } from '@/contexts/ExpenseContext';

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

export function ImportCSV() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number } | null>(null);
  const { addExpense } = useExpenses();
  const { toast } = useToast();

  const parseCSV = (text: string): ParsedTransaction[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const transactions: ParsedTransaction[] = [];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle CSV with commas in quoted fields
      const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
      if (!matches || matches.length < 3) continue;

      const [date, description, amount, category] = matches.map(m => m.replace(/^"|"$/g, '').trim());

      // Parse date (supports multiple formats)
      let parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        // Try DD/MM/YYYY format
        const parts = date.split('/');
        if (parts.length === 3) {
          parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      }

      // Parse amount (remove currency symbols and commas)
      const parsedAmount = parseFloat(amount.replace(/[₹$,]/g, ''));

      if (!isNaN(parsedDate.getTime()) && !isNaN(parsedAmount) && parsedAmount > 0) {
        transactions.push({
          date: parsedDate.toISOString().split('T')[0],
          description: description || 'Imported transaction',
          amount: parsedAmount,
          category: category || 'Other',
        });
      }
    }

    return transactions;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setResults(null);

    try {
      const text = await file.text();
      const transactions = parseCSV(text);

      let successCount = 0;
      let failedCount = 0;

      for (const transaction of transactions) {
        try {
          addExpense({
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            date: transaction.date,
          });
          successCount++;
        } catch (error) {
          failedCount++;
        }
      }

      setResults({ success: successCount, failed: failedCount });

      toast({
        title: 'Import Complete',
        description: `Successfully imported ${successCount} transactions`,
      });
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Error processing CSV file',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="text-lg font-bold">Import Bank Statement</h3>
            <p className="text-sm text-gray-600">Upload a CSV file to import transactions</p>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
            disabled={isProcessing}
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              {isProcessing ? 'Processing...' : 'Click to upload CSV file'}
            </p>
            <p className="text-xs text-gray-500">
              Format: Date, Description, Amount, Category
            </p>
          </label>
        </div>

        {results && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{results.success} transactions imported</span>
            </div>
            {results.failed > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{results.failed} transactions failed</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-2">CSV Format Example:</h4>
          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`Date,Description,Amount,Category
2024-01-15,Grocery Store,1500,Food
2024-01-16,Netflix,199,Entertainment
2024-01-17,Uber,350,Transportation`}
          </pre>
        </div>
      </div>
    </Card>
  );
}
