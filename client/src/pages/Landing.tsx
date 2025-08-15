import { Download, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useQuery } from '@tanstack/react-query';
import DynamicIcon from '../components/DynamicIcon';
import { Skeleton } from '../components/ui/skeleton';

export default function Landing() {
  // Fetch cards from database
  const { data: allCards, isLoading } = useQuery({
    queryKey: ['/api/resource-cards'],
  });

  // Filter cards by category
  const resourceCards = Array.isArray(allCards) ? allCards.filter((card: any) => card.category === 'resources').sort((a: any, b: any) => a.sortOrder - b.sortOrder) : [];
  const toolboxCards = Array.isArray(allCards) ? allCards.filter((card: any) => card.category === 'toolbox').sort((a: any, b: any) => a.sortOrder - b.sortOrder) : [];
  const featureCards = Array.isArray(allCards) ? allCards.filter((card: any) => card.category === 'features').sort((a: any, b: any) => a.sortOrder - b.sortOrder) : [];

  // Gradient mappings for different categories
  const getGradient = (category: string, index: number) => {
    const gradients = {
      resources: ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600'],
      toolbox: [
        'from-blue-500 to-indigo-600', 'from-green-500 to-emerald-600', 'from-purple-500 to-violet-600',
        'from-red-500 to-pink-600', 'from-yellow-500 to-orange-600', 'from-cyan-500 to-blue-600',
        'from-indigo-500 to-purple-600', 'from-red-500 to-rose-600', 'from-green-500 to-teal-600',
        'from-orange-500 to-red-600', 'from-pink-500 to-purple-600', 'from-teal-500 to-cyan-600',
        'from-violet-500 to-purple-600'
      ],
      features: ['from-green-500 to-emerald-600', 'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600']
    };
    const categoryGradients = (gradients as any)[category] || gradients.toolbox;
    return categoryGradients[index % categoryGradients.length];
  };

  // Handle card click
  const handleCardClick = (card: any) => {
    if (card.redirectUrl) {
      if (card.redirectUrl.startsWith('http')) {
        window.open(card.redirectUrl, '_blank');
      } else {
        window.location.href = card.redirectUrl;
      }
    }
  };



  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 to-pink-500 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-pulse">
            Download GTU Papers, Notes & Tools – All in One Place
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Access thousands of GTU question papers, study materials, and powerful tools designed specifically for GTU students. Everything you need to excel in your exams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-blue-500 px-8 py-4 text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Papers
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-blue-500 transition-all bg-transparent"
            >
              <Send className="w-5 h-5 mr-2" />
              Join Telegram
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Explore GTU Study Resources Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore GTU Study Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Access comprehensive study materials for all GTU courses and branches
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border-0">
                  <CardContent className="p-8 text-center">
                    <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-6" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))
            ) : (
              resourceCards.map((card: any, index: number) => (
                <Card 
                  key={card.id} 
                  className={`group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 border-0 ${card.redirectUrl ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleCardClick(card)}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`bg-gradient-to-br ${getGradient('resources', index)} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <DynamicIcon iconName={card.icon} className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* GTU Toolbox Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              GTU Toolbox
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Powerful tools and calculators designed specifically for GTU students
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border-0">
                  <CardContent className="p-6">
                    <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              toolboxCards.map((card: any, index: number) => (
                <Card 
                  key={card.id} 
                  className={`group cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 border-0 ${card.redirectUrl ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleCardClick(card)}
                >
                  <CardContent className="p-6">
                    <div className={`bg-gradient-to-br ${getGradient('toolbox', index)} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <DynamicIcon iconName={card.icon} className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Why Choose GTUWALA Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose GTUWALA?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Trusted by thousands of GTU students for reliable study resources
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="bg-white dark:bg-gray-800 border-0">
                  <CardContent className="p-8 text-center">
                    <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-6" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </CardContent>
                </Card>
              ))
            ) : (
              featureCards.map((card: any, index: number) => (
                <Card 
                  key={card.id} 
                  className={`group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 border-0 ${card.redirectUrl ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleCardClick(card)}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`bg-gradient-to-br ${getGradient('features', index)} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <DynamicIcon iconName={card.icon} className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
