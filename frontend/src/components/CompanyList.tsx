import React, { useState, useMemo } from 'react';
import { Company } from '@/types/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Building2, Filter } from 'lucide-react';

interface CompanyListProps {
    companies: Company[];
    onCompanySelect: (company: Company) => void;
    selectedCompany?: Company;
}

const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    onCompanySelect,
    selectedCompany
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [industryFilter, setIndustryFilter] = useState<string>('all');

    const filteredCompanies = useMemo(() => {
        return companies.filter(company => {
            const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
            return matchesSearch && matchesIndustry;
        });
    }, [companies, searchTerm, industryFilter]);

    const industries = useMemo(() => {
        const uniqueIndustries = Array.from(new Set(companies.map(company => company.industry)));
        return uniqueIndustries.sort();
    }, [companies]);

    const handleCompanyClick = (company: Company) => {
        onCompanySelect(company);
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Companies ({filteredCompanies.length})
                    </CardTitle>
                </div>

                {/* Search and Filter */}
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <Select value={industryFilter} onValueChange={setIndustryFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by industry" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Industries</SelectItem>
                                {industries.map(industry => (
                                    <SelectItem key={industry} value={industry}>
                                        {industry}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                    {filteredCompanies.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground">
                            {searchTerm || industryFilter !== 'all'
                                ? 'No companies match your search criteria'
                                : 'No companies found'
                            }
                        </div>
                    ) : (
                        <div className="space-y-2 p-4">
                            {filteredCompanies.map((company) => (
                                <div
                                    key={company.id}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedCompany?.id === company.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => handleCompanyClick(company)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground truncate">
                                                {company.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {company.location}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {company.industry}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {company.latitude.toFixed(4)}, {company.longitude.toFixed(4)}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedCompany?.id === company.id && (
                                            <div className="ml-2">
                                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyList; 