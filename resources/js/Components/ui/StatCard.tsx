import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            
            {trend && (
              <p className={cn(
                "text-sm mt-2 font-medium flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                <span className="text-gray-500 font-normal ml-1">vs last month</span>
              </p>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-primary-light rounded-lg">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
