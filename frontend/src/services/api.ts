/**
 * API service for communicating with the backend.
 */
import axios, { AxiosResponse } from 'axios';
import { Company, CompanyCreate, CompanyListResponse, ApiError } from '@/types/company';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

/**
 * Companies API service
 */
export const companiesApi = {
    /**
     * Get all companies with pagination
     */
    async getCompanies(skip = 0, limit = 100): Promise<CompanyListResponse> {
        const response: AxiosResponse<CompanyListResponse> = await api.get('/api/companies/', {
            params: { skip, limit }
        });
        return response.data;
    },

    /**
     * Get a specific company by ID
     */
    async getCompany(id: number): Promise<Company> {
        const response: AxiosResponse<Company> = await api.get(`/api/companies/${id}`);
        return response.data;
    },

    /**
     * Create a new company
     */
    async createCompany(company: CompanyCreate): Promise<Company> {
        const response: AxiosResponse<Company> = await api.post('/api/companies/', company);
        return response.data;
    },

    /**
     * Delete a company by ID
     */
    async deleteCompany(id: number): Promise<void> {
        await api.delete(`/api/companies/${id}`);
    },
};

export default api; 