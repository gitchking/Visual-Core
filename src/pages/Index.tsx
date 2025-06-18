
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Workflow, 
  BarChart3, 
  Users, 
  Megaphone,
  ArrowRight,
  Cherry
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: "To-Do Flow",
      description: "Create and manage tasks, then visualize them as interactive flowcharts",
      icon: CheckSquare,
      href: "/todos",
      accent: "cherry"
    },
    {
      title: "Flow Editor",
      description: "Transform your workflow into beautiful node-based diagrams",
      icon: Workflow,
      href: "/flow-editor",
      accent: "cherry"
    },
    {
      title: "Charts",
      description: "Visualize your productivity data with interactive charts",
      icon: BarChart3,
      href: "/analytics",
      accent: "cherry"
    },
    {
      title: "Community",
      description: "Connect with others and share your workflows",
      icon: Users,
      href: "/community",
      accent: "cherry"
    },
    {
      title: "Studio",
      description: "Create and publish content for your workspace",
      icon: Megaphone,
      href: "/studio",
      accent: "cherry"
    }
  ];

  const getAccentClasses = (accent: string) => {
    return 'bg-red-500 hover:bg-red-600 text-white neo-brutal';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cherry className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Apps
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Build amazing applications with visual workflows and productivity tools.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-4 sm:px-0">
          {features.map((feature) => (
            <Card key={feature.title} className="neo-card hover-lift border-2 hover:border-foreground transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 border-2 border-black neo-card flex items-center justify-center">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-sm sm:text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  className={`w-full ${getAccentClasses(feature.accent)}`}
                >
                  <Link to={feature.href} className="flex items-center justify-center gap-2">
                    <Cherry className="w-4 h-4" />
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          <Card className="text-center neo-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-red-500">0</CardTitle>
              <CardDescription className="text-sm sm:text-base">Active Tasks</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center neo-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-red-500">0</CardTitle>
              <CardDescription className="text-sm sm:text-base">Completed Flows</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center neo-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-red-500">0</CardTitle>
              <CardDescription className="text-sm sm:text-base">Community Posts</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
