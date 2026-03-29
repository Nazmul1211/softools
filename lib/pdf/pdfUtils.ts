import { PDFDocument, degrees } from "pdf-lib";

// Helper function to convert Uint8Array to Blob
function uint8ArrayToBlob(data: Uint8Array, type: string): Blob {
  // Create a new ArrayBuffer copy to avoid TypeScript compatibility issues
  const buffer = new ArrayBuffer(data.length);
  const view = new Uint8Array(buffer);
  view.set(data);
  return new Blob([buffer], { type });
}

export interface CompressionResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  pageCount: number;
}

export interface CompressionOptions {
  quality: "low" | "medium" | "high";
  removeMetadata?: boolean;
}

/**
 * Compress a PDF file client-side using pdf-lib
 * This removes object streams and optimizes the PDF structure
 */
export async function compressPDF(
  file: File,
  options: CompressionOptions = { quality: "medium" }
): Promise<CompressionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const pageCount = pdfDoc.getPageCount();

  // Remove metadata if requested
  if (options.removeMetadata) {
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("");
  }

  // Compression settings based on quality
  const saveOptions: {
    useObjectStreams?: boolean;
    addDefaultPage?: boolean;
    objectsPerTick?: number;
  } = {
    useObjectStreams: false,
    addDefaultPage: false,
  };

  // Lower objectsPerTick can help with memory for large files
  if (options.quality === "low") {
    saveOptions.objectsPerTick = 20;
  } else if (options.quality === "medium") {
    saveOptions.objectsPerTick = 50;
  }

  const pdfBytes = await pdfDoc.save(saveOptions);
  const blob = uint8ArrayToBlob(pdfBytes, "application/pdf");

  return {
    blob,
    originalSize: file.size,
    compressedSize: blob.size,
    pageCount,
  };
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

/**
 * Split a PDF into individual pages
 */
export async function splitPDF(file: File): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const pageCount = pdf.getPageCount();
  const splitPdfs: Blob[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);

    const pdfBytes = await newPdf.save();
    splitPdfs.push(uint8ArrayToBlob(pdfBytes, "application/pdf"));
  }

  return splitPdfs;
}

/**
 * Extract specific pages from a PDF
 */
export async function extractPages(
  file: File,
  pageNumbers: number[]
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const newPdf = await PDFDocument.create();
  
  // Convert 1-indexed to 0-indexed
  const validIndices = pageNumbers
    .map((n) => n - 1)
    .filter((n) => n >= 0 && n < pdf.getPageCount());

  const pages = await newPdf.copyPages(pdf, validIndices);
  pages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

/**
 * Rotate all pages in a PDF
 */
export async function rotatePDF(
  file: File,
  rotationDegrees: 0 | 90 | 180 | 270
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const pages = pdf.getPages();
  pages.forEach((page) => {
    page.setRotation(degrees(rotationDegrees));
  });

  const pdfBytes = await pdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

/**
 * Get PDF info without modifying it
 */
export async function getPDFInfo(file: File): Promise<{
  pageCount: number;
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  creator: string | undefined;
  producer: string | undefined;
  creationDate: Date | undefined;
  modificationDate: Date | undefined;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    subject: pdf.getSubject(),
    creator: pdf.getCreator(),
    producer: pdf.getProducer(),
    creationDate: pdf.getCreationDate(),
    modificationDate: pdf.getModificationDate(),
  };
}
