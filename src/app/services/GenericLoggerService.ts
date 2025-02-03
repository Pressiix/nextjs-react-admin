import {
  CloudWatchLogsClient,
  // CreateLogGroupCommand,
  // CreateLogStreamCommand,
  PutLogEventsCommand,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

export interface LoggerConfig {
  region: string;
  logGroupName: string;
  logStreamName: string;
}

export interface LogMessage {
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  metadata?: Record<string, unknown>;
}

export class GenericLoggerService {
  private static instance: GenericLoggerService | null = null;
  private client: CloudWatchLogsClient | null = null;
  private config: LoggerConfig | null = null;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private logStreamExists: boolean = false;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private logGroupExists: boolean = false;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private initialized: boolean = false;

  constructor() {
    // Empty constructor
  }

  public async initialize(
    config: LoggerConfig & {
      credentials?: {
        accessKeyId: string;
        secretAccessKey: string;
      };
    }
  ): Promise<void> {
    if (this.initialized) return;

    this.config = config;
    let clientConfig: any = {
      region: config.region,
    };

    if (config.credentials) {
      clientConfig.credentials = config.credentials;
    } else {
      clientConfig = {
        region: config.region,
      };
    }

    this.client = new CloudWatchLogsClient(clientConfig);

    await this.ensureLogGroupExists();
    await this.ensureLogStreamExists();
  }

  public static getInstance(): GenericLoggerService {
    if (!GenericLoggerService.instance) {
      GenericLoggerService.instance = new GenericLoggerService();
    }
    return GenericLoggerService.instance;
  }

  private async ensureLogGroupExists(): Promise<void> {
    if (this.logGroupExists) return;

    // Validate log group name: https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_CreateLogGroup.html
    // if (
    //   !this.config?.logGroupName ||
    //   this.config.logGroupName.length < 1 ||
    //   this.config.logGroupName.length > 512 ||
    //   // eslint-disable-next-line no-useless-escape
    //   !/^[\w\-\/\#\.]+$/.test(this.config.logGroupName)
    // ) {
    //   throw new Error(
    //     `Invalid log group name: ${this.config?.logGroupName}. Log group names must be 1-512 characters and contain only ASCII letters, numbers, underscores, hyphens, forward slashes, hash symbols, and periods.`,
    //   );
    // }

    try {
      // Describe log groups to check if the log group exists
      const describeLogGroupsResponse = await this.client!.send(
        new DescribeLogGroupsCommand({
          logGroupNamePrefix: this.config!.logGroupName,
        })
      );

      const logGroupExists = describeLogGroupsResponse.logGroups?.some(
        (logGroup) => logGroup.logGroupName === this.config!.logGroupName
      );

      if (logGroupExists) {
        this.logGroupExists = true;
        console.log(`Log group ${this.config!.logGroupName} already exists`);
      } else {
        // Log group doesn't exist, create it
        console.error("Log group does not exist, please create it manually");
      }
    } catch (error: any) {
      console.error("Failed to ensure log group exists:", {
        error,
        errorName: error.name,
        errorMessage: error.message,
        logGroupName: this.config?.logGroupName,
      });
      throw error;
    }
  }

  private async ensureLogStreamExists(): Promise<void> {
    if (this.logStreamExists) return;

    // Validate log stream name: https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_CreateLogStream.html
    // if (
    //   !this.config?.logStreamName ||
    //   this.config.logStreamName.length < 1 ||
    //   this.config.logStreamName.length > 512 ||
    //   // eslint-disable-next-line no-useless-escape
    //   !/^[\w\-\/\#\.]+$/.test(this.config.logStreamName)
    // ) {
    //   throw new Error(
    //     `Invalid log stream name: ${this.config?.logStreamName}. Stream names must be 1-512 characters and contain only ASCII letters, numbers, underscores, hyphens, forward slashes, hash symbols, and periods.`,
    //   );
    // }

    try {
      // First check if stream exists
      const { logStreams } = await this.client!.send(
        new DescribeLogStreamsCommand({
          logGroupName: this.config!.logGroupName,
          logStreamNamePrefix: this.config!.logStreamName,
        })
      );

      const streamExists = logStreams?.some(
        (stream) => stream.logStreamName === this.config!.logStreamName
      );

      if (streamExists) {
        this.logStreamExists = true;
        console.log(`Log stream ${this.config!.logStreamName} already exists`);
        return;
      }

      console.error("Log stream does not exist, please create it manually");
    } catch (error: any) {
      console.error("Failed to ensure log stream exists:", {
        error,
        errorName: error.name,
        errorMessage: error.message,
        logGroupName: this.config?.logGroupName,
        logStreamName: this.config?.logStreamName,
      });
      throw error;
    }
  }

  private formatLogMessage(logMessage: LogMessage): string {
    return JSON.stringify({
      ...logMessage,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  }

  public async log(logMessage: LogMessage): Promise<void> {
    try {
      const logEvent = {
        message: this.formatLogMessage(logMessage),
        timestamp: Date.now(),
      };

      await this.client!.send(
        new PutLogEventsCommand({
          logGroupName: this.config!.logGroupName,
          logStreamName: this.config!.logStreamName,
          logEvents: [logEvent],
        })
      );
    } catch (error) {
      console.error("Failed to send log to CloudWatch:", error);
      throw error;
    }
  }

  // Convenience methods for different log levels
  public async info(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    return this.log({ level: "INFO", message, metadata });
  }

  public async warn(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    return this.log({ level: "WARN", message, metadata });
  }

  public async error(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    return this.log({ level: "ERROR", message, metadata });
  }

  public async debug(
    message: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    return this.log({ level: "DEBUG", message, metadata });
  }
}
