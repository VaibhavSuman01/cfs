import { Construction } from 'lucide-react';

interface ComingSoonProps {
  pageTitle: string;
  pageDescription?: string;
}

export default function ComingSoon({ pageTitle, pageDescription }: ComingSoonProps) {
  return (
    <div className="container mx-auto p-6 flex flex-col items-center justify-center text-center h-[calc(100vh-8rem)]">
        <Construction className="w-24 h-24 text-yellow-500 mb-6" />
        <h1 className="text-4xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-2xl font-semibold text-muted-foreground mb-4">Coming Soon!</p>
        <p className="max-w-md text-lg">
          {pageDescription || `We're working hard to bring you this feature. Please check back later.`}
        </p>
    </div>
  );
}
