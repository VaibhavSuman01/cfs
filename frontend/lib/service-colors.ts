export function getServiceCardClasses(serviceCategory: string): string {
  const baseClasses = "border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group";
  switch (serviceCategory) {
    case 'Taxation':
      return `${baseClasses} border-red-200 hover:border-red-300`;
    case 'Other Registration':
      return `${baseClasses} border-green-200 hover:border-green-300`;
    case 'Advisory':
      return `${baseClasses} border-purple-200 hover:border-purple-300`;
    case 'ROC Returns':
      return `${baseClasses} border-cyan-200 hover:border-cyan-300`;
    case 'Reports':
      return `${baseClasses} border-yellow-200 hover:border-yellow-300`;
    case 'Company Formation':
      return `${baseClasses} border-blue-200 hover:border-blue-300`;
    case 'Trademark & ISO':
      return `${baseClasses} border-indigo-200 hover:border-indigo-300`;
    default:
      return `${baseClasses} border-gray-200 hover:border-gray-300`;
  }
}

export function getServiceBackgroundColor(serviceCategory: string): string {
  switch (serviceCategory) {
    case 'Taxation':
      return "mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors";
    case 'Other Registration':
      return "mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors";
    case 'Advisory':
      return "mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors";
    case 'ROC Returns':
      return "mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors";
    case 'Reports':
      return "mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors";
    case 'Company Formation':
      return "mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors";
    case 'Trademark & ISO':
      return "mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors";
    default:
      return "mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors";
  }
}

export function getServiceIconColor(serviceCategory: string): string {
  switch (serviceCategory) {
    case 'Taxation':
      return "h-8 w-8 text-red-600 group-hover:scale-110 transition-transform";
    case 'Other Registration':
      return "h-8 w-8 text-green-600 group-hover:scale-110 transition-transform";
    case 'Advisory':
      return "h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform";
    case 'ROC Returns':
      return "h-8 w-8 text-cyan-600 group-hover:scale-110 transition-transform";
    case 'Reports':
      return "h-8 w-8 text-yellow-600 group-hover:scale-110 transition-transform";
    case 'Company Formation':
      return "h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform";
    case 'Trademark & ISO':
      return "h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform";
    default:
      return "h-8 w-8 text-gray-600 group-hover:scale-110 transition-transform";
  }
}

export function getServicePriceColor(serviceCategory: string): string {
  switch (serviceCategory) {
    case 'Taxation':
      return "text-2xl font-bold text-red-600";
    case 'Other Registration':
      return "text-2xl font-bold text-green-600";
    case 'Advisory':
      return "text-2xl font-bold text-purple-600";
    case 'ROC Returns':
      return "text-2xl font-bold text-cyan-600";
    case 'Reports':
      return "text-2xl font-bold text-yellow-600";
    case 'Company Formation':
      return "text-2xl font-bold text-blue-600";
    case 'Trademark & ISO':
      return "text-2xl font-bold text-indigo-600";
    default:
      return "text-2xl font-bold text-gray-600";
  }
}

export function getServicePageHeroBackground(serviceCategory: string): string {
  switch (serviceCategory) {
    case 'Taxation':
      return "bg-gradient-to-br from-red-50 via-white to-red-100";
    case 'Other Registration':
      return "bg-gradient-to-br from-green-50 via-white to-green-100";
    case 'Advisory':
      return "bg-gradient-to-br from-purple-50 via-white to-purple-100";
    case 'ROC Returns':
      return "bg-gradient-to-br from-cyan-50 via-white to-cyan-100";
    case 'Reports':
      return "bg-gradient-to-br from-yellow-50 via-white to-yellow-100";
    case 'Company Formation':
      return "bg-gradient-to-br from-blue-50 via-white to-blue-100";
    case 'Trademark & ISO':
      return "bg-gradient-to-br from-indigo-50 via-white to-indigo-100";
    default:
      return "bg-gradient-to-br from-blue-50 via-white to-blue-100";
  }
}