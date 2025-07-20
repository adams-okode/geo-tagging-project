/**
 * Company Form Component for adding new companies.
 */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CompanyCreate } from '@/types/company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyFormProps {
    onSubmit: (data: CompanyCreate) => Promise<void>;
    isLoading?: boolean;
}

interface FormData {
    name: string;
    industry: string;
    location: string;
    latitude: string;
    longitude: string;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit, isLoading = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormData>();

    const handleFormSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const companyData: CompanyCreate = {
                name: data.name.trim(),
                industry: data.industry.trim(),
                location: data.location.trim(),
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
            };

            await onSubmit(companyData);
            reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setValue('latitude', position.coords.latitude.toString());
                    setValue('longitude', position.coords.longitude.toString());
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get current location. Please enter coordinates manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Company</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Company Name *
                        </Label>
                        <Input
                            type="text"
                            id="name"
                            {...register('name', {
                                required: 'Company name is required',
                                minLength: { value: 1, message: 'Company name cannot be empty' }
                            })}
                            placeholder="Enter company name"
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                        <Label htmlFor="industry">
                            Industry *
                        </Label>
                        <Input
                            type="text"
                            id="industry"
                            {...register('industry', {
                                required: 'Industry is required',
                                minLength: { value: 1, message: 'Industry cannot be empty' }
                            })}
                            placeholder="Enter industry"
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.industry && (
                            <p className="text-sm text-destructive">{errors.industry.message}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">
                            Location *
                        </Label>
                        <Input
                            type="text"
                            id="location"
                            {...register('location', {
                                required: 'Location is required',
                                minLength: { value: 1, message: 'Location cannot be empty' }
                            })}
                            placeholder="Enter location (city, address, etc.)"
                            disabled={isLoading || isSubmitting}
                        />
                        {errors.location && (
                            <p className="text-sm text-destructive">{errors.location.message}</p>
                        )}
                    </div>

                    {/* Coordinates Section */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <Label>
                                Coordinates *
                            </Label>
                            <Button
                                type="button"
                                variant="link"
                                onClick={handleGetCurrentLocation}
                                disabled={isLoading || isSubmitting}
                                className="p-0 h-auto"
                            >
                                Use Current Location
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Latitude */}
                            <div className="space-y-2">
                                <Label htmlFor="latitude">
                                    Latitude
                                </Label>
                                <Input
                                    type="number"
                                    id="latitude"
                                    step="any"
                                    {...register('latitude', {
                                        required: 'Latitude is required',
                                        min: { value: -90, message: 'Latitude must be between -90 and 90' },
                                        max: { value: 90, message: 'Latitude must be between -90 and 90' }
                                    })}
                                    placeholder="e.g., 40.7128"
                                    disabled={isLoading || isSubmitting}
                                />
                                {errors.latitude && (
                                    <p className="text-sm text-destructive">{errors.latitude.message}</p>
                                )}
                            </div>

                            {/* Longitude */}
                            <div className="space-y-2">
                                <Label htmlFor="longitude">
                                    Longitude
                                </Label>
                                <Input
                                    type="number"
                                    id="longitude"
                                    step="any"
                                    {...register('longitude', {
                                        required: 'Longitude is required',
                                        min: { value: -180, message: 'Longitude must be between -180 and 180' },
                                        max: { value: 180, message: 'Longitude must be between -180 and 180' }
                                    })}
                                    placeholder="e.g., -74.0060"
                                    disabled={isLoading || isSubmitting}
                                />
                                {errors.longitude && (
                                    <p className="text-sm text-destructive">{errors.longitude.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isLoading || isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Adding Company...' : 'Add Company'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CompanyForm; 