<<<<<<< HEAD
=======

>>>>>>> NEW
import { EnhancedHeader } from "@/components/enhanced-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <EnhancedHeader />
<<<<<<< HEAD
      <main className="flex-grow pt-20">{children}</main>
=======
      <main className="flex-grow pt-20">
        {children}
      </main>
>>>>>>> NEW
    </div>
  );
}
