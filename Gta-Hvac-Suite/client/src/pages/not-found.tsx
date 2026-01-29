import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1120] p-4">
      <Card className="w-full max-w-md mx-auto glass-card">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive items-center justify-center">
            <AlertCircle className="h-12 w-12" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">404 Page Not Found</h1>
          <p className="mt-4 text-sm text-gray-400 text-center">
            The dashboard page you are looking for does not exist.
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/">
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
