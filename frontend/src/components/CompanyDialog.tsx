import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CompanyCreate } from '@/types/company';
import { companiesApi } from '@/services/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, MapPin, Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const industries = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "finance", label: "Finance" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "transportation", label: "Transportation" },
    { value: "real-estate", label: "Real Estate" },
    { value: "entertainment", label: "Entertainment" },
    { value: "food-beverage", label: "Food & Beverage" },
    { value: "automotive", label: "Automotive" },
    { value: "energy", label: "Energy" },
    { value: "other", label: "Other" },
];

interface CompanyDialogProps {
    onCompanyCreated: () => void;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({ onCompanyCreated }) => {
    const [open, setOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isGettingLocation, setIsGettingLocation] = React.useState(false);
    const [selectedIndustry, setSelectedIndustry] = React.useState<string>('');
    const [industryOpen, setIndustryOpen] = React.useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm<CompanyCreate>();

    const onSubmit = async (data: CompanyCreate) => {
        if (!selectedIndustry) {
            toast.error('Please select an industry');
            return;
        }

        // Get the label for the selected industry value
        const selectedIndustryLabel = industries.find(industry => industry.value === selectedIndustry)?.label || selectedIndustry;

        // Ensure industry is included in the form data
        const formData = {
            ...data,
            industry: selectedIndustryLabel
        };

        try {
            setIsSubmitting(true);
            await companiesApi.createCompany(formData);
            toast.success('Company created successfully!');
            reset();
            setSelectedIndustry('');
            setOpen(false);
            onCompanyCreated();
        } catch (error) {
            console.error('Error creating company:', error);
            toast.error('Failed to create company. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
            setSelectedIndustry('');
        }
    };



    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by this browser.');
            return;
        }

        setIsGettingLocation(true);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                });
            });

            const { latitude, longitude } = position.coords;
            setValue('latitude', latitude);
            setValue('longitude', longitude);

            // Try to get address from coordinates using reverse geocoding
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                );
                const data = await response.json();
                if (data.display_name) {
                    setValue('location', data.display_name);
                }
            } catch (error) {
                console.warn('Could not get address from coordinates:', error);
                setValue('location', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }

            toast.success('Current location set successfully!');
        } catch (error) {
            console.error('Error getting location:', error);
            toast.error('Failed to get current location. Please enter coordinates manually.');
        } finally {
            setIsGettingLocation(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Company
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                    <DialogDescription>
                        Enter the company details and location information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Company name is required' })}
                            placeholder="Enter company name"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="industry">Industry *</Label>
                        <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={industryOpen}
                                    className="w-full justify-between"
                                >
                                    {selectedIndustry
                                        ? industries.find((industry) => industry.value === selectedIndustry)?.label
                                        : "Select industry..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search industry..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty>No industry found.</CommandEmpty>
                                        <CommandGroup>
                                            {industries.map((industry) => (
                                                <CommandItem
                                                    key={industry.value}
                                                    value={industry.value}
                                                    onSelect={(currentValue) => {
                                                        const newValue = currentValue === selectedIndustry ? "" : currentValue;
                                                        setSelectedIndustry(newValue);
                                                        setValue('industry', newValue, { shouldValidate: true });
                                                        trigger('industry');
                                                        setIndustryOpen(false);
                                                    }}
                                                >
                                                    {industry.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            selectedIndustry === industry.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {/* Hidden input for form validation */}
                        <input
                            type="hidden"
                            {...register('industry', { required: 'Industry is required' })}
                            value={selectedIndustry}
                        />
                        {errors.industry && (
                            <p className="text-sm text-red-500">{errors.industry.message}</p>
                        )}
                        {!selectedIndustry && !errors.industry && (
                            <p className="text-sm text-red-500">Industry is required</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="flex gap-2">
                            <Input
                                id="location"
                                {...register('location', { required: 'Location is required' })}
                                placeholder="Enter address or location"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={getCurrentLocation}
                                disabled={isGettingLocation}
                                className="flex items-center gap-2"
                            >
                                {isGettingLocation ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <MapPin className="w-4 h-4" />
                                )}
                                {isGettingLocation ? 'Getting...' : 'Current'}
                            </Button>
                        </div>
                        {errors.location && (
                            <p className="text-sm text-red-500">{errors.location.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                {...register('latitude', {
                                    required: 'Latitude is required',
                                    min: { value: -90, message: 'Latitude must be between -90 and 90' },
                                    max: { value: 90, message: 'Latitude must be between -90 and 90' },
                                })}
                                placeholder="e.g., 51.5074"
                            />
                            {errors.latitude && (
                                <p className="text-sm text-red-500">{errors.latitude.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                {...register('longitude', {
                                    required: 'Longitude is required',
                                    min: { value: -180, message: 'Longitude must be between -180 and 180' },
                                    max: { value: 180, message: 'Longitude must be between -180 and 180' },
                                })}
                                placeholder="e.g., -0.1278"
                            />
                            {errors.longitude && (
                                <p className="text-sm text-red-500">{errors.longitude.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Company'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CompanyDialog; 