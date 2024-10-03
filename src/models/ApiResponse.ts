export interface ApiResponse<T> {
    success: boolean;
    data: T; // Esto debe ser del tipo Producto
    message?: string;
  }
  