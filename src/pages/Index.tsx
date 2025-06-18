
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
  ArrowRight
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: "To-Do Flow",
      description: "Create and manage tasks, then visualize them as interactive flowcharts",
      icon: CheckSquare,
      href: "/todos",
      accent: "pink"
    },
    {
      title: "Flow Editor",
      description: "Transform your workflow into beautiful node-based diagrams",
      icon: Workflow,
      href: "/flow-editor",
      accent: "blue"
    },
    {
      title: "Charts",
      description: "Visualize your productivity data with interactive charts",
      icon: BarChart3,
      href: "/analytics",
      accent: "purple"
    },
    {
      title: "Community",
      description: "Connect with others and share your workflows",
      icon: Users,
      href: "/community",
      accent: "pink"
    },
    {
      title: "Studio",
      description: "Create and publish content for your workspace",
      icon: Megaphone,
      href: "/studio",
      accent: "blue"
    }
  ];

  const getAccentClasses = (accent: string) => {
    switch (accent) {
      case 'pink':
        return 'bg-pink-accent hover:bg-pink-accent/90 text-white neo-brutal-pink';
      case 'blue':
        return 'bg-blue-accent hover:bg-blue-accent/90 text-white neo-brutal-blue';
      case 'purple':
        return 'bg-purple-accent hover:bg-purple-accent/90 text-white neo-brutal-purple';
      default:
        return 'bg-foreground hover:bg-foreground/90 text-background neo-brutal';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
            Apps
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Build amazing applications with visual workflows and productivity tools.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="neo-card hover-lift border-2 hover:border-foreground transition-all duration-300">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted border-2 border-black neo-card flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-sm sm:text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <Button 
                  asChild 
                  className={`w-full ${getAccentClasses(feature.accent)} text-sm sm:text-base`}
                >
                  <Link to={feature.href} className="flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <Card className="text-center neo-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold">0</CardTitle>
              <CardDescription className="text-sm sm:text-base">Active Tasks</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center neo-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold">0</CardTitle>
              <CardDescription className="text-sm sm:text-base">Completed Flows</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center neo-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold">0</CardTitle>
              <CardDescription className="text-sm sm:text-base">Community Posts</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
