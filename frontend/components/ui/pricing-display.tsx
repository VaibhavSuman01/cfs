"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getServicePricing } from "@/lib/pricing";

interface PricingDisplayProps {
  serviceName: string;
  className?: string;
  showTooltip?: boolean;
}

export function PricingDisplay({ 
  serviceName, 
  className = "", 
  showTooltip = true 
}: PricingDisplayProps) {
  const pricing = getServicePricing(serviceName);
  
  if (!pricing?.basePrice) {
    return <span className={className}>Price not available</span>;
  }

  const priceText = pricing.basePrice;
  const tooltipText = pricing.tooltip;

  if (!showTooltip || !tooltipText) {
    return <span className={className}>{priceText}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help ${className}`}>
            {priceText}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-center">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface PackagePricingDisplayProps {
  serviceName: string;
  packageType: "BASIC" | "STANDARD" | "PREMIUM";
  className?: string;
  showTooltip?: boolean;
}

export function PackagePricingDisplay({ 
  serviceName, 
  packageType, 
  className = "", 
  showTooltip = true 
}: PackagePricingDisplayProps) {
  const pricing = getServicePricing(serviceName);
  
  if (!pricing?.packages?.[packageType]) {
    return <span className={className}>Price not available</span>;
  }

  const priceText = pricing.packages[packageType];
  const tooltipText = pricing.tooltip;

  if (!showTooltip || !tooltipText) {
    return <span className={className}>{priceText}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`cursor-help ${className}`}>
            {priceText}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-center">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
