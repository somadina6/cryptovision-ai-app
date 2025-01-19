import axios from "axios";

// Create base API client
export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// Create CoinGecko client
export const coingeckoAxios = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000,
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

// Global fetcher for SWR
export const fetcher = async (url: string) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("SWR Fetcher Error:", error);
    throw error;
  }
};
