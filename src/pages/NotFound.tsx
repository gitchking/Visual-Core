
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="text-center neo-card">
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-black">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <Button 
            asChild 
            className="neo-brutal"
          >
            <a href="/">Return to Home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
