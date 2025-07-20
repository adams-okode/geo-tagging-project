/**
 * Main page component for the Geo-Tagging Company Management System.
 */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import toast, { Toaster } from 'react-hot-toast';
import { Company } from '@/types/company';
import { companiesApi } from '@/services/api';
import CompanyList from '@/components/CompanyList';
import CompanyDialog from '@/components/CompanyDialog';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Globe } from 'lucide-react';

// Dynamically import the map component to avoid SSR issues
const CompanyMap = dynamic(() => import('@/components/CompanyMap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
            <div className="text-muted-foreground">Loading map...</div>
        </div>
    ),
});

const Home: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
    const [isLoading, setIsLoading] = useState(true);

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

    const handleCompanySelect = (company: Company) => {
        setSelectedCompany(company);
        toast.success(`Selected: ${company.name}`, {
            duration: 2000,
        });
    };

    const handleCompanyCreated = () => {
        fetchCompanies();
    };

    const handleMarkerClick = (company: Company) => {
        setSelectedCompany(company);
        toast.success(`Selected: ${company.name}`, {
            duration: 2000,
        });
    };

    return (
        <>
            <Head>
                <title>Company Dashboard - Geo-Tagging System</title>
                <meta name="description" content="Interactive dashboard for managing companies with geographic data" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="bg-white border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                                    <Globe className="w-8 h-8 text-primary" />
                                    Company Dashboard
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Interactive map and company management system
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Total Companies</p>
                                    <p className="text-2xl font-bold text-primary">{companies.length}</p>
                                </div>
                                <CompanyDialog onCompanyCreated={handleCompanyCreated} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Navigation />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
                        {/* Map Section - Left Side */}
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Company Locations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 h-full">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                                            <div className="text-muted-foreground">Loading companies...</div>
                                        </div>
                                    ) : companies.length === 0 ? (
                                        <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                                            <div className="text-center">
                                                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <div className="text-muted-foreground mb-2">No companies found</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Add a company using the button above to see it on the map
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full">
                                            <CompanyMap
                                                companies={companies}
                                                onMarkerClick={handleMarkerClick}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Company List Section - Right Side */}
                        <div className="lg:col-span-1">
                            <CompanyList
                                companies={companies}
                                onCompanySelect={handleCompanySelect}
                                selectedCompany={selectedCompany}
                            />
                        </div>
                    </div>

                    {/* Selected Company Details */}
                    {selectedCompany && (
                        <div className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        Selected Company Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Company Name</p>
                                            <p className="font-semibold">{selectedCompany.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Industry</p>
                                            <Badge variant="secondary">{selectedCompany.industry}</Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Location</p>
                                            <p className="font-semibold">{selectedCompany.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Coordinates</p>
                                            <p className="font-mono text-sm">
                                                {selectedCompany.latitude.toFixed(6)}, {selectedCompany.longitude.toFixed(6)}
                                            </p>
                                        </div>
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

export default Home; 