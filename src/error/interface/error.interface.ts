export interface ApiError {
  name: string;
  statusCode: number;
  message: string;
  details: string[];
}
