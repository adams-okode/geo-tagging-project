import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Navigation: React.FC = () => {
    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/">
                            <Button variant="outline">Dashboard</Button>
                        </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Geo-Tagging Company Management System
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Navigation; 