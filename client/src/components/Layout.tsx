import ScrollProgress from './ScrollProgress';
import ScrollToTop from './ScrollToTop';
import AlertBar from './AlertBar';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="font-inter bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <ScrollProgress />
      <AlertBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
