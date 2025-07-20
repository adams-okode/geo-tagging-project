/**
 * Original view page component for the Geo-Tagging Company Management System.
 */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import toast, { Toaster } from 'react-hot-toast';
import { Company, CompanyCreate } from '@/types/company';
import { companiesApi } from '@/services/api';
import CompanyForm from '@/components/CompanyForm';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dynamically import the map component to avoid SSR issues
const CompanyMap = dynamic(() => import('@/components/CompanyMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-gray-600">Loading map...</div>
        </div>
    ),
});

const OriginalView: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch companies on component mount
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setIsLoading(true);
            const response = await companiesApi.getCompanies();
            setCompanies(response.companies);
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Failed to load companies. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCompany = async (companyData: CompanyCreate) => {
        try {
            setIsSubmitting(true);
            const newCompany = await companiesApi.createCompany(companyData);
            setCompanies(prev => [...prev, newCompany]);
            toast.success('Company added successfully!');
        } catch (error) {
            console.error('Error adding company:', error);
            toast.error('Failed to add company. Please try again.');
            throw error; // Re-throw to let the form handle the error
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkerClick = (company: Company) => {
        toast.success(`Selected: ${company.name}`, {
            duration: 2000,
        });
    };

    return (
        <>
            <Head>
                <title>Geo-Tagging Company Management</title>
                <meta name="description" content="Manage companies with geographic data" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="bg-white border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Geo-Tagging Company Management
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Manage and visualize companies with geographic data
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total Companies</p>
                                <p className="text-2xl font-bold text-primary">{companies.length}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Navigation />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Map Section */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Company Locations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                                            <div className="text-muted-foreground">Loading companies...</div>
                                        </div>
                                    ) : companies.length === 0 ? (
                                        <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                                            <div className="text-center">
                                                <div className="text-muted-foreground mb-2">No companies found</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Add a company using the form to see it on the map
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <CompanyMap
                                            companies={companies}
                                            onMarkerClick={handleMarkerClick}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Form Section */}
                        <div className="lg:col-span-1">
                            <CompanyForm
                                onSubmit={handleAddCompany}
                                isLoading={isSubmitting}
                            />
                        </div>
                    </div>

                    {/* Companies List Section */}
                    {companies.length > 0 && (
                        <div className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Companies List</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-border">
                                            <thead className="bg-muted">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Industry
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Location
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        Coordinates
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-background divide-y divide-border">
                                                {companies.map((company) => (
                                                    <tr key={company.id} className="hover:bg-muted/50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                                            {company.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                            {company.industry}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                            {company.location}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                            {company.latitude.toFixed(6)}, {company.longitude.toFixed(6)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>

                {/* Toast Notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#10B981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#EF4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </div>
        </>
    );
};

export default OriginalView; 