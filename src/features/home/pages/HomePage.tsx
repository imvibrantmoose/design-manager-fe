import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const HomePage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="mb-6 text-2xl font-bold">
                Welcome to Design Template Manager
              </h2>
              <p className="mb-6 text-muted-foreground">
                Manage your design templates efficiently
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
