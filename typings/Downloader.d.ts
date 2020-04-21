/** Options for Downloader. */
export interface IOptions {
  /** URLs to fetch. */
  urls: string[];

  /** Whether to stop downloading once a URL returns bad HTTP status. */
  stopOnError: boolean;

  /** Destination path of the files. */
  destination: string;

  /** Function to call on a downloaded file. */
  callback?: (file: IFile) => any;
}

export interface IFile {
  name: string;
  data: Buffer;
  encoding: string;
  mimeType: string;
}
