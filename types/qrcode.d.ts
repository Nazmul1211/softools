declare module "qrcode" {
  export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H" | "low" | "medium" | "quartile" | "high";

  export interface QRCodeColorOptions {
    dark?: string;
    light?: string;
  }

  export interface QRCodeToDataURLOptions {
    errorCorrectionLevel?: ErrorCorrectionLevel;
    type?: string;
    width?: number;
    margin?: number;
    scale?: number;
    color?: QRCodeColorOptions;
  }

  export interface QRCodeToStringOptions {
    errorCorrectionLevel?: ErrorCorrectionLevel;
    type?: "utf8" | "svg" | "terminal";
    width?: number;
    margin?: number;
    color?: QRCodeColorOptions;
  }

  export function toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>;
  export function toString(text: string, options?: QRCodeToStringOptions): Promise<string>;

  const QRCode: {
    toDataURL: typeof toDataURL;
    toString: typeof toString;
  };

  export default QRCode;
}
