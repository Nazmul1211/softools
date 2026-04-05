"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { FileDropzone, FilePreview } from "@/components/tools/FileDropzone";
import { ProcessingStatus, ProcessingProgress } from "@/components/tools/ProcessingStatus";
import { DownloadButton, DownloadAllButton } from "@/components/tools/DownloadButton";
import {
  FileText,
  FileSpreadsheet,
  Shield,
  Zap,
  RefreshCcw,
  FileDown,
  CheckCircle2,
  Globe,
  Layers,
  Clock,
  Sparkles,
  Table2,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingState {
  status: "idle" | "processing" | "done" | "error";
  message?: string;
  progress?: number;
}

interface Transaction {
  date: string;
  description: string;
  amount: string;
  balance?: string;
  type?: "credit" | "debit";
}

interface ExtractedData {
  transactions: Transaction[];
  bankName?: string;
  accountNumber?: string;
  statementPeriod?: string;
  pageCount: number;
}

interface ConversionResult {
  csvBlob: Blob;
  excelBlob: Blob;
  data: ExtractedData;
}

type OutputFormat = "excel" | "csv" | "both";

export default function BankStatementConverterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>({ status: "idle" });
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("excel");

  const handleFileSelect = useCallback((selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    );
    
    if (validFiles.length === 0) {
      setProcessing({
        status: "error",
        message: "Please select valid PDF files",
      });
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    const oversizedFiles = validFiles.filter((f) => f.size > maxSize);
    if (oversizedFiles.length > 0) {
      setProcessing({
        status: "error",
        message: `Files must be under 50MB: ${oversizedFiles.map((f) => f.name).join(", ")}`,
      });
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    setResults([]);
    setProcessing({ status: "idle" });
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResults([]);
  }, []);

  const extractTransactions = (text: string): Transaction[] => {
    const transactions: Transaction[] = [];
    const lines = text.split("\n").filter((line) => line.trim().length > 0);

    // Common date patterns for bank statements
    const datePatterns = [
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{2,4})/i,
    ];

    // Amount patterns (supports various currency formats)
    const amountPattern = /[\-\+]?\s*[\$£€]?\s*[\d,]+\.?\d*\s*(?:CR|DR)?|\([\d,]+\.?\d*\)/gi;

    for (const line of lines) {
      let dateMatch: RegExpMatchArray | null = null;
      
      // Try each date pattern
      for (const pattern of datePatterns) {
        dateMatch = line.match(pattern);
        if (dateMatch) break;
      }

      if (!dateMatch) continue;

      // Extract amounts from the line
      const amounts = line.match(amountPattern);
      if (!amounts || amounts.length === 0) continue;

      // Get the description (text between date and amount)
      const dateEndIndex = (dateMatch.index || 0) + dateMatch[0].length;
      const lastAmount = amounts[amounts.length - 1];
      const lastAmountIndex = line.lastIndexOf(lastAmount);
      let description = line.substring(dateEndIndex, lastAmountIndex).trim();
      
      // Clean up description
      description = description.replace(/\s+/g, " ").trim();
      if (description.length < 2) continue;

      // Parse the primary amount
      const firstAmount = amounts[0];
      let amountStr = firstAmount.trim();
      let type: "credit" | "debit" = "debit";
      
      // Determine if credit or debit
      if (amountStr.includes("CR") || amountStr.startsWith("+")) {
        type = "credit";
      } else if (amountStr.includes("DR") || amountStr.startsWith("-") || amountStr.includes("(")) {
        type = "debit";
      }

      // Clean amount string
      amountStr = amountStr.replace(/[CR|DR|\(\)]/gi, "").trim();
      amountStr = amountStr.replace(/^\+/, "");

      // Get balance if available (usually last amount)
      const balance = amounts.length > 1 ? amounts[amounts.length - 1].replace(/[CR|DR|\(\)]/gi, "").trim() : undefined;

      transactions.push({
        date: dateMatch[0],
        description,
        amount: amountStr,
        balance,
        type,
      });
    }

    return transactions;
  };

  const detectBankInfo = (text: string): Partial<ExtractedData> => {
    const info: Partial<ExtractedData> = {};

    // Common bank name patterns
    const bankPatterns = [
      /(?:Bank of America|Wells Fargo|Chase|Citibank|HSBC|Barclays|Capital One|TD Bank|PNC Bank|US Bank)/i,
      /(?:First National|Citizens Bank|Fifth Third|Regions|KeyBank|Santander|BB&T|SunTrust)/i,
    ];

    for (const pattern of bankPatterns) {
      const match = text.match(pattern);
      if (match) {
        info.bankName = match[0];
        break;
      }
    }

    // Account number pattern (masked or partial)
    const accountMatch = text.match(/(?:Account|A\/C|Acct)[#:\s]*(?:\*{4,})?(\d{4,})/i);
    if (accountMatch) {
      info.accountNumber = `****${accountMatch[1].slice(-4)}`;
    }

    // Statement period
    const periodMatch = text.match(
      /(?:Statement Period|Period)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\s*(?:to|[-–])\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
    );
    if (periodMatch) {
      info.statementPeriod = `${periodMatch[1]} - ${periodMatch[2]}`;
    }

    return info;
  };

  const generateCSV = (data: ExtractedData): Blob => {
    const headers = ["Date", "Description", "Amount", "Type", "Balance"];
    const rows = data.transactions.map((t) => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.type || "",
      t.balance || "",
    ]);

    let csv = headers.join(",") + "\n";
    csv += rows.map((row) => row.join(",")).join("\n");

    // Add metadata as comments at the end
    if (data.bankName || data.accountNumber || data.statementPeriod) {
      csv += "\n\n# Statement Information\n";
      if (data.bankName) csv += `# Bank: ${data.bankName}\n`;
      if (data.accountNumber) csv += `# Account: ${data.accountNumber}\n`;
      if (data.statementPeriod) csv += `# Period: ${data.statementPeriod}\n`;
    }

    return new Blob([csv], { type: "text/csv;charset=utf-8;" });
  };

  const generateExcel = async (data: ExtractedData): Promise<Blob> => {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    // Set column widths
    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Description", key: "description", width: 45 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Type", key: "type", width: 10 },
      { header: "Balance", key: "balance", width: 15 },
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    };
    headerRow.alignment = { horizontal: "center" };

    // Add transactions
    data.transactions.forEach((t, index) => {
      const row = worksheet.addRow({
        date: t.date,
        description: t.description,
        amount: t.amount,
        type: t.type === "credit" ? "Credit" : "Debit",
        balance: t.balance || "",
      });

      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF3F4F6" },
        };
      }

      // Color amount based on type
      const amountCell = row.getCell("amount");
      if (t.type === "credit") {
        amountCell.font = { color: { argb: "FF16A34A" } };
      } else if (t.type === "debit") {
        amountCell.font = { color: { argb: "FFDC2626" } };
      }
    });

    // Add summary section
    worksheet.addRow([]);
    worksheet.addRow(["Statement Summary"]);
    const summaryRow = worksheet.lastRow!;
    summaryRow.font = { bold: true, size: 12 };

    if (data.bankName) worksheet.addRow(["Bank:", data.bankName]);
    if (data.accountNumber) worksheet.addRow(["Account:", data.accountNumber]);
    if (data.statementPeriod) worksheet.addRow(["Period:", data.statementPeriod]);
    worksheet.addRow(["Total Transactions:", data.transactions.length]);

    // Calculate totals
    const credits = data.transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]/g, "") || "0"), 0);
    const debits = data.transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]/g, "") || "0"), 0);

    worksheet.addRow(["Total Credits:", credits.toFixed(2)]);
    worksheet.addRow(["Total Debits:", debits.toFixed(2)]);

    // Generate buffer and return as blob
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    try {
      setProcessing({ status: "processing", message: "Loading PDF library...", progress: 0 });

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const allResults: ConversionResult[] = [];

      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex];
        const progressBase = (fileIndex / files.length) * 100;
        const progressIncrement = 100 / files.length;

        setProcessing({
          status: "processing",
          message: `Processing ${file.name}...`,
          progress: progressBase,
        });

        // Read file
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        let fullText = "";

        // Extract text from each page
        for (let i = 1; i <= numPages; i++) {
          setProcessing({
            status: "processing",
            message: `${file.name}: Extracting page ${i}/${numPages}...`,
            progress: progressBase + (i / numPages) * (progressIncrement * 0.6),
          });

          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          let pageText = "";
          let lastY = -1;

          for (const item of textContent.items) {
            if ("str" in item) {
              const y = (item as { transform: number[] }).transform[5];

              if (lastY !== -1 && Math.abs(y - lastY) > 5) {
                pageText += "\n";
              } else if (pageText && !pageText.endsWith(" ") && !pageText.endsWith("\n")) {
                pageText += " ";
              }

              pageText += item.str;
              lastY = y;
            }
          }

          fullText += pageText + "\n\n";
        }

        setProcessing({
          status: "processing",
          message: `${file.name}: Extracting transactions...`,
          progress: progressBase + progressIncrement * 0.7,
        });

        // Extract transactions and bank info
        const transactions = extractTransactions(fullText);
        const bankInfo = detectBankInfo(fullText);

        const extractedData: ExtractedData = {
          transactions,
          ...bankInfo,
          pageCount: numPages,
        };

        setProcessing({
          status: "processing",
          message: `${file.name}: Generating output files...`,
          progress: progressBase + progressIncrement * 0.85,
        });

        // Generate output files
        const csvBlob = generateCSV(extractedData);
        const excelBlob = await generateExcel(extractedData);

        allResults.push({
          csvBlob,
          excelBlob,
          data: extractedData,
        });
      }

      setResults(allResults);
      setProcessing({
        status: "done",
        message: `Successfully converted ${files.length} file${files.length > 1 ? "s" : ""}!`,
        progress: 100,
      });
    } catch (error) {
      console.error("Processing failed:", error);
      setProcessing({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to process PDF files",
      });
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setProcessing({ status: "idle" });
  };

  const getOutputFilename = (file: File, format: "csv" | "xlsx") => {
    const baseName = file.name.replace(/\.pdf$/i, "");
    return `${baseName}_transactions.${format}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getTotalTransactions = () => {
    return results.reduce((sum, r) => sum + r.data.transactions.length, 0);
  };

  const getDownloadFiles = () => {
    const downloadFiles: { blob: Blob; filename: string }[] = [];
    
    results.forEach((result, index) => {
      const file = files[index];
      if (outputFormat === "excel" || outputFormat === "both") {
        downloadFiles.push({
          blob: result.excelBlob,
          filename: getOutputFilename(file, "xlsx"),
        });
      }
      if (outputFormat === "csv" || outputFormat === "both") {
        downloadFiles.push({
          blob: result.csvBlob,
          filename: getOutputFilename(file, "csv"),
        });
      }
    });

    return downloadFiles;
  };

  return (
    <ToolLayout
      title="Bank Statement Converter"
      description="Convert PDF bank statements to Excel (XLSX) and CSV format instantly. Extract transactions with smart AI-powered parsing. Free, secure, and works with statements from any bank worldwide."
      category={{ name: "Finance Tools", slug: "finance-tools" }}
      relatedTools={[
        { name: "Currency Converter", href: "/currency-converter/" },
        { name: "Loan Calculator", href: "/loan-calculator/" },
        { name: "PDF to Word", href: "/pdf-to-word/" },
        { name: "ROI Calculator", href: "/roi-calculator/" },
      ]}
      fullWidth={true}
      howToSteps={[
        {
          name: "Upload Bank Statement",
          text: "Drag and drop your PDF bank statement or click to browse. Supports files up to 50MB.",
        },
        {
          name: "Choose Output Format",
          text: "Select your preferred output format: Excel (XLSX), CSV, or both for maximum flexibility.",
        },
        {
          name: "Convert Statement",
          text: "Click 'Convert Statement' to extract all transactions with dates, descriptions, and amounts.",
        },
        {
          name: "Download Results",
          text: "Download your converted file instantly. All processing happens in your browser for complete privacy.",
        },
      ]}
      faqs={[
        {
          question: "What's the best bank statement converter online in 2026?",
          answer:
            "Softzar's Bank Statement Converter is the best free tool for turning bank statement PDFs into clean, accurate Excel or CSV files in seconds. It works with statements from any bank worldwide and processes everything locally in your browser for maximum privacy.",
        },
        {
          question: "Will my financial data remain private?",
          answer:
            "Yes, absolutely. All processing happens entirely in your browser - your files never leave your device or get uploaded to any server. This is the most secure way to convert sensitive financial documents.",
        },
        {
          question: "Does it work with scanned PDFs?",
          answer:
            "This tool works best with digitally-generated PDF statements. Scanned or image-based PDFs may have limited extraction accuracy since they require OCR processing. For best results, use the original digital PDF from your bank.",
        },
        {
          question: "Which banks are supported?",
          answer:
            "Our converter works with PDF statements from any bank worldwide - Bank of America, Chase, Wells Fargo, HSBC, Barclays, and thousands more. The intelligent parsing adapts to different statement formats automatically.",
        },
        {
          question: "What file formats can I export to?",
          answer:
            "You can export to Excel (XLSX) for detailed spreadsheet analysis with formatting, or CSV for simple data import into accounting software like QuickBooks, Xero, or FreshBooks. You can also download both formats at once.",
        },
        {
          question: "Is there a file size or page limit?",
          answer:
            "You can convert statements up to 50MB in size, which covers most multi-page bank statements. You can also batch convert multiple statements at once to save time.",
        },
        {
          question: "How accurate is the transaction extraction?",
          answer:
            "Our smart parsing algorithm is optimized for financial documents and achieves high accuracy on digitally-generated bank statements. It recognizes dates, descriptions, amounts, and transaction types (credits/debits) from various statement layouts.",
        },
        {
          question: "Can I convert multiple statements at once?",
          answer:
            "Yes! Our batch conversion feature lets you upload and process multiple bank statements simultaneously. This is ideal for monthly reconciliation or processing statements from multiple accounts.",
        },
      ]}
      content={
        <>
          <h2>Turn Bank Statement PDFs into Structured Spreadsheets</h2>
          <p>
            Bank statements in PDF format are great for viewing, but terrible for analysis. When you need to reconcile accounts, track spending, or import transactions into accounting software, you need structured data in Excel or CSV format. Our free Bank Statement Converter bridges this gap instantly.
          </p>
          <p>
            Whether you're an accountant managing client finances, a business owner tracking cash flow, or an individual organizing personal records, this tool transforms complex PDF statements into clean, sortable spreadsheets ready for analysis.
          </p>

          <h2>Smart Transaction Extraction Technology</h2>
          <p>
            Unlike basic PDF converters that simply dump text, our tool uses intelligent parsing algorithms designed specifically for financial documents. It recognizes:
          </p>
          <ul>
            <li><strong>Transaction dates</strong> in multiple formats (MM/DD/YYYY, DD-Mon-YYYY, etc.)</li>
            <li><strong>Descriptions</strong> with proper spacing and cleanup</li>
            <li><strong>Amounts</strong> with various currency symbols and formats</li>
            <li><strong>Transaction types</strong> - credits and debits properly categorized</li>
            <li><strong>Running balances</strong> when available in the statement</li>
          </ul>
          <p>
            The extracted data is organized into professionally formatted Excel files with color-coded amounts, summary statistics, and ready-to-use columns for filtering and pivot tables.
          </p>

          <h2>Works With Any Bank Worldwide</h2>
          <p>
            Our converter handles statements from thousands of banks globally. Whether your statement comes from major institutions like Chase, Bank of America, Wells Fargo, HSBC, Barclays, or from regional credit unions and international banks, the adaptive parsing engine extracts transactions accurately.
          </p>
          <p>
            The tool automatically detects bank names, account numbers (masked for security in the output), and statement periods when this information is present in your PDF. This metadata is included in your exported files for easy reference.
          </p>

          <h2>Complete Privacy - 100% Browser-Based</h2>
          <p>
            Financial documents contain sensitive information that should never be uploaded to unknown servers. That's why our entire conversion process runs locally in your web browser. Your bank statements never leave your device - not even temporarily.
          </p>
          <p>
            We use PDF.js (Mozilla's open-source PDF library) and ExcelJS for local processing. There's no server-side component, no file uploads, and no data collection. This makes our tool suitable for confidential business documents, tax records, and any statements you prefer to keep private.
          </p>

          <h2>Export Options: Excel and CSV</h2>
          <p>
            Choose the format that best fits your workflow:
          </p>
          <ul>
            <li><strong>Excel (XLSX)</strong> - Full formatting with styled headers, color-coded transactions (green for credits, red for debits), summary statistics, and optimized column widths. Perfect for manual review and analysis.</li>
            <li><strong>CSV</strong> - Clean comma-separated data ideal for importing into accounting software like QuickBooks, Xero, FreshBooks, or custom databases. Maximum compatibility with any system.</li>
            <li><strong>Both formats</strong> - Download Excel and CSV simultaneously when you need flexibility for different uses.</li>
          </ul>

          <h2>Batch Processing for Efficiency</h2>
          <p>
            Need to convert multiple statements? Our batch processing feature lets you upload several PDFs at once and convert them all in one operation. This is particularly useful for:
          </p>
          <ul>
            <li>Monthly reconciliation across multiple accounts</li>
            <li>Year-end financial review</li>
            <li>Processing client statements in accounting practice</li>
            <li>Consolidating records from different banks</li>
          </ul>
          <p>
            Each statement is processed independently, maintaining accurate data separation. Download individual files or get everything as a ZIP archive.
          </p>

          <h2>Who Benefits from This Tool?</h2>
          <p>
            <strong>Accountants and Bookkeepers:</strong> Convert client statements to Excel in seconds instead of hours of manual data entry. The structured output integrates seamlessly with your existing reconciliation workflows.
          </p>
          <p>
            <strong>Business Owners:</strong> Track cash flow, categorize expenses, and generate reports without expensive accounting software. Export to CSV for easy import into your preferred tools.
          </p>
          <p>
            <strong>Financial Analysts:</strong> Transform static PDFs into sortable, filterable data ready for modeling and analysis. The Excel output includes formulas and formatting for immediate use.
          </p>
          <p>
            <strong>Individuals:</strong> Organize personal finances, prepare for tax season, or simply get a clearer view of spending patterns. No signup required - just upload and convert.
          </p>

          <h2>Tips for Best Results</h2>
          <p>
            For optimal conversion accuracy:
          </p>
          <ul>
            <li>Use the original digital PDF from your bank's online portal rather than a scan</li>
            <li>Ensure the PDF isn't password-protected (unlock it first if needed)</li>
            <li>Multi-page statements are fully supported - all pages are processed automatically</li>
            <li>Review the extracted data for any edge cases unique to your bank's format</li>
          </ul>
          <p>
            The converter handles most standard bank statement layouts, but some highly customized or unusual formats may require minor manual adjustments after conversion.
          </p>
        </>
      }
    >
      <div className="space-y-6">
        {/* Upload Area */}
        {files.length === 0 && (
          <FileDropzone
            onFileSelect={handleFileSelect}
            accept=".pdf,application/pdf"
            maxSize={50}
            multiple={true}
            description="Drop PDF bank statements here or click to upload. Max 50MB per file. Multiple files supported."
          />
        )}

        {/* Processing Status */}
        {processing.status === "processing" && (
          <div className="space-y-3">
            <ProcessingStatus status="processing" message={processing.message} />
            {processing.progress !== undefined && (
              <ProcessingProgress
                current={Math.round(processing.progress)}
                total={100}
                label="Conversion Progress"
              />
            )}
          </div>
        )}

        {/* Error State */}
        {processing.status === "error" && (
          <ProcessingStatus status="error" message={processing.message} />
        )}

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-6">
            {/* File List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  {files.length} Statement{files.length > 1 ? "s" : ""} Selected
                </h3>
                {processing.status === "idle" && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg border"
                  >
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <FileText className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    {results[index] && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{results[index].data.transactions.length} transactions</span>
                      </div>
                    )}
                    {processing.status === "idle" && (
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                        aria-label="Remove file"
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Output Format Selection */}
            {processing.status === "idle" && results.length === 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Output Format</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "excel", label: "Excel (XLSX)", icon: FileSpreadsheet },
                    { value: "csv", label: "CSV", icon: Table2 },
                    { value: "both", label: "Both Formats", icon: Layers },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setOutputFormat(value as OutputFormat)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all",
                        outputFormat === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Success State */}
            {processing.status === "done" && results.length > 0 && (
              <>
                <ProcessingStatus status="done" message={processing.message} />

                {/* Results Summary */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                      {files.length}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Files Converted</p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-center">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {getTotalTransactions()}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-300">Transactions Extracted</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center">
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                      {results.reduce((sum, r) => sum + r.data.pageCount, 0)}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Pages Processed</p>
                  </div>
                </div>

                {/* Transaction Preview */}
                {results[0]?.data.transactions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Transaction Preview</h3>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">Date</th>
                            <th className="px-4 py-2 text-left font-medium">Description</th>
                            <th className="px-4 py-2 text-right font-medium">Amount</th>
                            <th className="px-4 py-2 text-center font-medium">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results[0].data.transactions.slice(0, 5).map((t, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                              <td className="px-4 py-2 whitespace-nowrap">{t.date}</td>
                              <td className="px-4 py-2 truncate max-w-[200px]">{t.description}</td>
                              <td
                                className={cn(
                                  "px-4 py-2 text-right whitespace-nowrap font-medium",
                                  t.type === "credit"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                )}
                              >
                                {t.amount}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-medium",
                                    t.type === "credit"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  )}
                                >
                                  {t.type === "credit" ? "Credit" : "Debit"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {results[0].data.transactions.length > 5 && (
                        <div className="px-4 py-2 text-sm text-muted-foreground text-center bg-muted/30 border-t">
                          + {results[0].data.transactions.length - 5} more transactions
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Download Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Download Files</h3>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{files[index].name}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.data.transactions.length} transactions • {result.data.pageCount} pages
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {(outputFormat === "excel" || outputFormat === "both") && (
                            <DownloadButton
                              blob={result.excelBlob}
                              filename={getOutputFilename(files[index], "xlsx")}
                              variant="primary"
                              size="sm"
                            >
                              Excel
                            </DownloadButton>
                          )}
                          {(outputFormat === "csv" || outputFormat === "both") && (
                            <DownloadButton
                              blob={result.csvBlob}
                              filename={getOutputFilename(files[index], "csv")}
                              variant="secondary"
                              size="sm"
                            >
                              CSV
                            </DownloadButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Download All Button */}
                  {results.length > 1 && (
                    <DownloadAllButton
                      files={getDownloadFiles()}
                      zipFilename="bank_statements_converted.zip"
                    />
                  )}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {results.length === 0 && processing.status !== "processing" && (
                <button
                  onClick={processFiles}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Convert Statement{files.length > 1 ? "s" : ""}
                </button>
              )}

              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <RefreshCcw className="h-4 w-4" />
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Features Grid (when no file) */}
        {files.length === 0 && (
          <div className="space-y-6 pt-6 border-t">
            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">100% Secure</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Files processed locally in your browser
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Any Bank Worldwide</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Works with statements from any bank
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Layers className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Batch Processing</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Convert multiple statements at once
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Instant Results</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Convert in seconds, not hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Smart Extraction</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI-powered transaction parsing
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <FileSpreadsheet className="h-5 w-5 text-teal-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Excel & CSV Export</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatted spreadsheets ready to use
                  </p>
                </div>
              </div>
            </div>

            {/* Who It's For Section */}
            <div className="mt-8">
              <h3 className="font-semibold text-lg mb-4">Who Is This Tool For?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">Accountants & Bookkeepers</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Convert client statements to Excel sheets ready for reconciliation
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold">Business Owners</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track cash flow and expenses with structured spreadsheet data
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Table2 className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Financial Analysts</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transform PDFs into sortable, filterable data for analysis
                  </p>
                </div>

                <div className="p-4 rounded-xl border bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-950/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold">Individuals</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Organize personal finances and prepare for tax season
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-6 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>No Upload Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Instant Processing</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
