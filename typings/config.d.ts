export interface IConfig {
  /** The ID range to search for characters. */
  range: [ number, number ];
  /** The directory to save the files. */
  destination: string;
  /** Whether to save each character in different folder. */
  foldered: boolean;
  /** Whether to log verbosely */
  verbose: boolean;
}
