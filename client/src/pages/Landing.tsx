import { Download, Send, FileText, Book, GraduationCap, Zap, RotateCcw, Gift, Calculator, Megaphone, Calendar, TrendingUp, Lightbulb, Users, ArrowUpDown, AlertTriangle, Percent, Clock, Timer, FileInput, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function Landing() {
  const resourceCards = [
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: "GTU Papers",
      description: "GTU All Courses, Branches All Years Question Papers PDFs Download",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Book className="w-8 h-8 text-white" />,
      title: "GTU Syllabus", 
      description: "GTU All Courses, Branches & Subjects Syllabus PDFs Download",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      title: "GTU Study Material",
      description: "GTU Study Material Free Download. Adding New Study Materials Daily.",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  const toolboxCards = [
    { icon: <Calculator className="w-6 h-6 text-white" />, title: "SPI/CPI/CGPA Calculator", description: "Calculate your semester and cumulative performance index", gradient: "from-blue-500 to-indigo-600" },
    { icon: <Megaphone className="w-6 h-6 text-white" />, title: "GTU Circulars", description: "Latest GTU circulars with advanced features", gradient: "from-green-500 to-emerald-600" },
    { icon: <Calendar className="w-6 h-6 text-white" />, title: "Academic Calendar", description: "GTU academic calendar with advanced features", gradient: "from-purple-500 to-violet-600" },
    { icon: <TrendingUp className="w-6 h-6 text-white" />, title: "GTU Result", description: "Check GTU results with advanced features", gradient: "from-red-500 to-pink-600" },
    { icon: <Lightbulb className="w-6 h-6 text-white" />, title: "GTU Tips & Solutions", description: "Paper solutions, viva tips, and writing answers", gradient: "from-yellow-500 to-orange-600" },
    { icon: <Users className="w-6 h-6 text-white" />, title: "Student Community", description: "Connect with GTU students community", gradient: "from-cyan-500 to-blue-600" },
    { icon: <ArrowUpDown className="w-6 h-6 text-white" />, title: "SPI to CPI Calculator", description: "Convert SPI to CPI with accurate calculations", gradient: "from-indigo-500 to-purple-600" },
    { icon: <AlertTriangle className="w-6 h-6 text-white" />, title: "Backlog Checker", description: "Manual backlog checker tool for students", gradient: "from-red-500 to-rose-600" },
    { icon: <Percent className="w-6 h-6 text-white" />, title: "Attendance Calculator", description: "Calculate your attendance percentage", gradient: "from-green-500 to-teal-600" },
    { icon: <Clock className="w-6 h-6 text-white" />, title: "Exam Countdown", description: "Countdown timer for upcoming exams", gradient: "from-orange-500 to-red-600" },
    { icon: <Timer className="w-6 h-6 text-white" />, title: "Study Timer", description: "Pomodoro study timer for effective learning", gradient: "from-pink-500 to-purple-600" },
    { icon: <FileInput className="w-6 h-6 text-white" />, title: "Paper Merge Tool", description: "Merge multiple PDF papers into one file", gradient: "from-teal-500 to-cyan-600" },
    { icon: <Heart className="w-6 h-6 text-white" />, title: "Contribute", description: "Help improve GTUWALA by contributing", gradient: "from-violet-500 to-purple-600" }
  ];

  const featureCards = [
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Fast & Reliable",
      description: "Quick access to all study materials with high-speed downloads",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-white" />,
      title: "Regular Updates",
      description: "Daily updates with latest papers and study materials",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Gift className="w-8 h-8 text-white" />,
      title: "Free Forever", 
      description: "All resources available free of cost for students",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

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
            {resourceCards.map((card, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 border-0">
                <CardContent className="p-8 text-center">
                  <div className={`bg-gradient-to-br ${card.gradient} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                </CardContent>
              </Card>
            ))}
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
            {toolboxCards.map((card, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 border-0">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-br ${card.gradient} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
                </CardContent>
              </Card>
            ))}
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
            {featureCards.map((card, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800 border-0">
                <CardContent className="p-8 text-center">
                  <div className={`bg-gradient-to-br ${card.gradient} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
