
import React from 'react';
import { 
  Workflow, 
  BarChart3, 
  Users, 
  Zap, 
  Settings,
  ArrowRight,
  CheckCircle,
  Database
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Workflow,
      title: "Visual Flow Editor",
      description: "Transform your to-do lists into beautiful, interactive node-based flowcharts. Drag, connect, and visualize your workflow like never before.",
      color: "purple",
      items: ["Drag & drop interface", "Custom node types", "Flow state saving", "JSON import/export"]
    },
    {
      icon: BarChart3,
      title: "Data Analytics",
      description: "Powerful visualization tools that turn your productivity data into actionable insights with stunning charts and metrics.",
      color: "blue",
      items: ["Bar, line & pie charts", "Real-time filtering", "Custom metrics", "Export capabilities"]
    },
    {
      icon: Users,
      title: "Community Threads",
      description: "Engage in rich discussions with advanced text editing, code blocks, embeds, and collaborative features.",
      color: "green",
      items: ["Rich text editor", "Code highlighting", "Thread tagging", "Upvote system"]
    },
    {
      icon: Settings,
      title: "DevTool Dashboard",
      description: "Complete control over your data with a secure developer dashboard for managing users, content, and database operations.",
      color: "orange",
      items: ["User management", "Data visualization", "SQLite interface", "Backup system"]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: "bg-purple-500 text-purple-600 bg-purple-50 border-purple-200",
      blue: "bg-blue-500 text-blue-600 bg-blue-50 border-blue-200",
      green: "bg-green-500 text-green-600 bg-green-50 border-green-200",
      orange: "bg-orange-500 text-orange-600 bg-orange-50 border-orange-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-100 rounded-full mb-4 sm:mb-6">
            <Database className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-xs sm:text-sm font-medium text-purple-600">Powered by SQLite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6">
            Everything You Need in
            <span className="block text-gradient-purple">One Platform</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            VisualFlow combines the best of productivity tools, data visualization, 
            and community collaboration in a beautifully designed interface.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = getColorClasses(feature.color).split(' ');
            
            return (
              <div 
                key={feature.title}
                className="group hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
                  {/* Icon and Title */}
                  <div className="flex flex-col sm:flex-row items-start mb-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colors[2]} ${colors[3]} rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-4 group-hover:scale-110 transition-transform duration-300 mx-auto sm:mx-0`}>
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors[1]}`} />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                    </div>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-2 sm:space-y-3 mb-6">
                    {feature.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center">
                        <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${colors[1]} mr-2 sm:mr-3 flex-shrink-0`} />
                        <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className={`inline-flex items-center ${colors[1]} hover:${colors[0]} transition-colors group w-full sm:w-auto justify-center sm:justify-start`}>
                    <span className="font-medium text-sm sm:text-base">Explore Feature</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 sm:p-12 rounded-3xl text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h3>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">Join thousands of users who've revolutionized their productivity</p>
            <button className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
              Start Your Free Trial
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
