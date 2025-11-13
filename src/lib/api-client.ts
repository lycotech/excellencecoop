/**
 * API Client for PHP Backend
 * 
 * This client handles all communication between Next.js (Vercel)
 * and your PHP API (SmartWeb/cPanel)
 */

// API Base URL - Change this to your domain
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://excellencecoop.com/api';

/**
 * API Response interface
 */
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

/**
 * Get authentication token from localStorage
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Save authentication token to localStorage
 */
export function saveToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

/**
 * Remove authentication token from localStorage
 */
export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
}

/**
 * Make API request
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization token if available
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    // If token is expired or invalid, clear it
    if (response.status === 401) {
      removeToken();
    }

    return data;

  } catch (error: any) {
    console.error('API Request Error:', error);
    return {
      success: false,
      message: 'Network error or server unavailable',
      error: error.message,
    };
  }
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      saveToken(response.data.token);
    }

    return response;
  },

  /**
   * Register new user
   */
  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    user_type: string;
  }) => {
    const response = await apiRequest('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      saveToken(response.data.token);
    }

    return response;
  },

  /**
   * Logout user
   */
  logout: () => {
    removeToken();
  },

  /**
   * Verify token
   */
  verifyToken: async () => {
    return apiRequest('/auth/verify-token.php', {
      method: 'GET',
    });
  },
};

/**
 * Users API
 */
export const usersApi = {
  /**
   * Get all users
   */
  getUsers: async (params?: {
    user_type?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.user_type) queryParams.append('user_type', params.user_type);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return apiRequest(`/users/get-users.php${query ? `?${query}` : ''}`);
  },

  /**
   * Get single user
   */
  getUser: async (userId: number) => {
    return apiRequest(`/users/get-user.php?id=${userId}`);
  },

  /**
   * Create user
   */
  createUser: async (userData: any) => {
    return apiRequest('/users/create-user.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update user
   */
  updateUser: async (userId: number, userData: any) => {
    return apiRequest('/users/update-user.php', {
      method: 'PUT',
      body: JSON.stringify({ user_id: userId, ...userData }),
    });
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: number) => {
    return apiRequest('/users/delete-user.php', {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    });
  },
};

/**
 * Members API
 */
export const membersApi = {
  /**
   * Get all members
   */
  getMembers: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return apiRequest(`/members/get-members.php${query ? `?${query}` : ''}`);
  },

  /**
   * Get single member
   */
  getMember: async (memberId: number) => {
    return apiRequest(`/members/get-member.php?id=${memberId}`);
  },

  /**
   * Create member
   */
  createMember: async (memberData: any) => {
    return apiRequest('/members/create-member.php', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  /**
   * Update member
   */
  updateMember: async (memberId: number, memberData: any) => {
    return apiRequest('/members/update-member.php', {
      method: 'PUT',
      body: JSON.stringify({ member_id: memberId, ...memberData }),
    });
  },
};

/**
 * Loans API
 */
export const loansApi = {
  /**
   * Get all loans
   */
  getLoans: async (params?: {
    status?: string;
    member_id?: number;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.member_id) queryParams.append('member_id', params.member_id.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const query = queryParams.toString();
    return apiRequest(`/loans/get-loans.php${query ? `?${query}` : ''}`);
  },

  /**
   * Get single loan
   */
  getLoan: async (loanId: number) => {
    return apiRequest(`/loans/get-loan.php?id=${loanId}`);
  },

  /**
   * Create loan
   */
  createLoan: async (loanData: any) => {
    return apiRequest('/loans/create-loan.php', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  },

  /**
   * Update loan
   */
  updateLoan: async (loanId: number, loanData: any) => {
    return apiRequest('/loans/update-loan.php', {
      method: 'PUT',
      body: JSON.stringify({ loan_id: loanId, ...loanData }),
    });
  },

  /**
   * Approve loan
   */
  approveLoan: async (loanId: number) => {
    return apiRequest('/loans/approve-loan.php', {
      method: 'POST',
      body: JSON.stringify({ loan_id: loanId }),
    });
  },

  /**
   * Reject loan
   */
  rejectLoan: async (loanId: number, reason: string) => {
    return apiRequest('/loans/reject-loan.php', {
      method: 'POST',
      body: JSON.stringify({ loan_id: loanId, reason }),
    });
  },
};

/**
 * Dashboard/Statistics API
 */
export const dashboardApi = {
  /**
   * Get dashboard stats
   */
  getStats: async () => {
    return apiRequest('/dashboard/get-stats.php');
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (limit: number = 10) => {
    return apiRequest(`/dashboard/get-activities.php?limit=${limit}`);
  },
};

/**
 * Export all APIs
 */
export default {
  auth: authApi,
  users: usersApi,
  members: membersApi,
  loans: loansApi,
  dashboard: dashboardApi,
};

