export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export const response = <T = unknown>({
  success,
  message,
  data,
}: ApiResponse<T>) => ({
  success,
  message,
  data,
});
