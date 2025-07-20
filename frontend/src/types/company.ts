/**
 * TypeScript types for company data.
 */

export interface Company {
    id: number;
    name: string;
    industry: string;
    location: string;
    latitude: number;
    longitude: number;
}

export interface CompanyCreate {
    name: string;
    industry: string;
    location: string;
    latitude: number;
    longitude: number;
}

export interface CompanyListResponse {
    companies: Company[];
    total: number;
}

export interface ApiError {
    detail: string;
} 