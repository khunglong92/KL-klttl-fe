// Mock API functions - replace with real API calls

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Mock delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (data: LoginData): Promise<ApiResponse> => {
    await delay(1000); // Simulate API call
    
    // Mock validation
    if (data.email === 'demo@example.com' && data.password === 'password123') {
      return {
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token-12345',
          user: {
            id: '1',
            email: data.email,
            name: 'Demo User',
          },
        },
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password',
    };
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    await delay(1000);
    
    return {
      success: true,
      message: 'Registration successful. Please login.',
      data: {
        token: 'mock-jwt-token-12345',
        user: {
          id: Date.now().toString(),
          email: data.email,
          name: data.name,
        },
      },
    };
  },

  resetPassword: async (_data: ResetPasswordData): Promise<ApiResponse> => {
    await delay(1000);
    
    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  },

  logout: async (): Promise<ApiResponse> => {
    await delay(500);
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  },
};
