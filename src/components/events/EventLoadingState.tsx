import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';

const EventLoadingState: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </CardContent>
        <CardFooter>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EventLoadingState;