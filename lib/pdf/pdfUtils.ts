import { PDFDocument, degrees, rgb, StandardFonts, PDFPage } from "pdf-lib";

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
 * Rotate specific pages in a PDF
 */
export async function rotateSpecificPages(
  file: File,
  pageRotations: Map<number, 0 | 90 | 180 | 270>
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const pages = pdf.getPages();
  pageRotations.forEach((rotation, pageIndex) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      pages[pageIndex].setRotation(degrees(rotation));
    }
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

/**
 * Convert images to a PDF document
 */
export async function imagesToPDF(
  files: File[],
  options: {
    pageSize: "fit" | "a4" | "letter";
    orientation: "portrait" | "landscape";
    margin: number; // in points (1 inch = 72 points)
  } = { pageSize: "a4", orientation: "portrait", margin: 36 }
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  // Page dimensions in points (72 dpi)
  const pageSizes = {
    a4: { width: 595.28, height: 841.89 },
    letter: { width: 612, height: 792 },
  };

  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    const uint8 = new Uint8Array(imageBytes);

    let image;
    const type = file.type.toLowerCase();

    if (type === "image/png") {
      image = await pdfDoc.embedPng(uint8);
    } else if (type === "image/jpeg" || type === "image/jpg") {
      image = await pdfDoc.embedJpg(uint8);
    } else {
      // For other formats, try to convert via canvas
      const bitmap = await createImageBitmap(new Blob([uint8], { type: file.type }));
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");
      ctx.drawImage(bitmap, 0, 0);
      const jpegBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
          "image/jpeg",
          0.95
        );
      });
      const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
      image = await pdfDoc.embedJpg(jpegBytes);
      bitmap.close();
    }

    const imgWidth = image.width;
    const imgHeight = image.height;

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === "fit") {
      // Page fits the image exactly (with margin)
      pageWidth = imgWidth + options.margin * 2;
      pageHeight = imgHeight + options.margin * 2;
    } else {
      const size = pageSizes[options.pageSize];
      if (options.orientation === "landscape") {
        pageWidth = size.height;
        pageHeight = size.width;
      } else {
        pageWidth = size.width;
        pageHeight = size.height;
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate dimensions to fit image within margins while preserving aspect ratio
    const availableWidth = pageWidth - options.margin * 2;
    const availableHeight = pageHeight - options.margin * 2;
    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    // Center the image on the page
    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

/**
 * Add page numbers to a PDF
 */
export type PageNumberPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

export interface AddPageNumbersOptions {
  position: PageNumberPosition;
  format: "number" | "page-x-of-y" | "roman";
  fontSize: number;
  startFrom: number; // 1-indexed: which page to start numbering from
  startNumber: number; // what number to start at
}

function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

function getPageNumberText(
  currentPage: number,
  totalPages: number,
  format: AddPageNumbersOptions["format"]
): string {
  switch (format) {
    case "number":
      return `${currentPage}`;
    case "page-x-of-y":
      return `Page ${currentPage} of ${totalPages}`;
    case "roman":
      return toRoman(currentPage).toLowerCase();
    default:
      return `${currentPage}`;
  }
}

function getNumberPosition(
  page: PDFPage,
  position: PageNumberPosition,
  textWidth: number,
  fontSize: number
): { x: number; y: number } {
  const { width, height } = page.getSize();
  const margin = 36; // 0.5 inch

  switch (position) {
    case "bottom-center":
      return { x: (width - textWidth) / 2, y: margin };
    case "bottom-left":
      return { x: margin, y: margin };
    case "bottom-right":
      return { x: width - textWidth - margin, y: margin };
    case "top-center":
      return { x: (width - textWidth) / 2, y: height - margin - fontSize };
    case "top-left":
      return { x: margin, y: height - margin - fontSize };
    case "top-right":
      return { x: width - textWidth - margin, y: height - margin - fontSize };
    default:
      return { x: (width - textWidth) / 2, y: margin };
  }
}

export async function addPageNumbers(
  file: File,
  options: AddPageNumbersOptions = {
    position: "bottom-center",
    format: "number",
    fontSize: 12,
    startFrom: 1,
    startNumber: 1,
  }
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const totalPages = pages.length - (options.startFrom - 1);

  for (let i = 0; i < pages.length; i++) {
    // Skip pages before startFrom (0-indexed vs 1-indexed)
    if (i < options.startFrom - 1) continue;

    const pageNumber = options.startNumber + (i - (options.startFrom - 1));
    const text = getPageNumberText(pageNumber, totalPages, options.format);
    const textWidth = font.widthOfTextAtSize(text, options.fontSize);

    const { x, y } = getNumberPosition(
      pages[i],
      options.position,
      textWidth,
      options.fontSize
    );

    pages[i].drawText(text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  const pdfBytes = await pdf.save();
  return uint8ArrayToBlob(pdfBytes, "application/pdf");
}

