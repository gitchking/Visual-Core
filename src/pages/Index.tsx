
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
      accent: "yellow"
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
        return 'bg-pink-accent hover:bg-pink-accent/90 text-white';
      case 'yellow':
        return 'bg-yellow-accent hover:bg-yellow-accent/90 text-black';
      case 'blue':
        return 'bg-blue-accent hover:bg-blue-accent/90 text-white';
      default:
        return 'bg-foreground hover:bg-foreground/90 text-background';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to VisualFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your productivity with visual workflows, interactive charts, and collaborative tools.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="hover-lift border-2 hover:border-foreground transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  asChild 
                  className={`w-full ${getAccentClasses(feature.accent)}`}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">0</CardTitle>
              <CardDescription>Active Tasks</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">0</CardTitle>
              <CardDescription>Completed Flows</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">0</CardTitle>
              <CardDescription>Community Posts</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
