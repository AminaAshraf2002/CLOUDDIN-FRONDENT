import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface Course {
  title: string;
  modules: number;
  duration: string;
  description: string;
  image: string;
  badge?: 'Pro';
  category: string;
  path: string;
  author?: string;
  rating?: number;
  reviewCount?: number;
  currentPrice?: number;
  originalPrice?: number;
  isPremium?: boolean;
  lastUpdated?: string;
  level?: string;
  subtitles?: string;
  shortDescription?: string;
  features?: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatTabsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  categories: string[] = ['ALL', 'GRAPHIC DESIGNING', 'DIGITAL MARKETING', 'Ecommerce Mastery'];
  selectedCategory: string = 'ALL';

  courses: Course[] = [
    {
      title: 'DIGITAL MARKETING MASTERCLASS',
      modules: 7,
      duration: '3 Months',
      image: 'https://img.freepik.com/free-psd/digital-marketing-agency-corporate-web-banner-template_106176-2332.jpg',
      description: "Our comprehensive Digital Marketing Course is designed to empower students with the skills and knowledge needed to succeed in the ever-evolving digital landscape. Through hands-on training and real-world projects, students will learn the fundamentals of digital marketing, including search engine optimization (SEO), pay-per-click advertising (PPC), social media marketing, email marketing, and content marketing. Our expert instructors will guide students through the latest digital marketing tools and platforms, including Google Analytics, Facebook Ads, and HubSpot. By the end of the course, students will have a deep understanding of how to create and execute a successful digital marketing strategy, and will be equipped with the skills to drive real results for businesses and organizations",
      badge: 'Pro',
      category: 'DIGITAL MARKETING',
      path: 'digital-marketing',
      author: 'Sarah Johnson, Digital Marketing Expert',
      rating: 4.8,
      reviewCount: 2456,
      currentPrice: 2000,
      originalPrice: 3000,
      isPremium: true,
      lastUpdated: 'March 2025',
      level: 'All Levels',
      subtitles: 'Subtitles, CC',
      shortDescription: '25+ Digital Marketing Tools to 10x Business, Productivity, Creativity | SEO, Social Media, Email & Content Marketing',
      features: [
        'Master SEO techniques to rank higher in search results',
        'Create engaging social media campaigns that convert',
        'Develop effective email marketing strategies',
        'Learn data-driven marketing analytics and optimization'
      ]
    },
    {
      title: 'GRAPHIC DESIGNING PRO',
      modules: 4,
      duration: '1 Month',
      image: 'https://images.shiksha.com/mediadata/images/articles/1708410614phpnjbsFG.jpeg',
      description: 'Our comprehensive Graphic Designing Course is designed to equip students with the skills and knowledge needed to succeed in the creative industry. Through hands-on training and real-world projects, students will learn the fundamentals of graphic design, including typography, color theory, and composition. Our expert instructors will guide students through the latest design software, including Adobe Creative Cloud, and teach them how to create stunning visuals for logos, brochures, business cards, websites, and social media graphics. By the end of the course, students will have a professional portfolio and the confidence to pursue a career in graphic design, branding, advertising, or digital media.',
      badge: 'Pro',
      category: 'GRAPHIC DESIGNING',
      path: 'graphics-designing',
      author: 'Michael Chen, Design Professional',
      rating: 4.7,
      reviewCount: 1893,
      currentPrice: 2000,
      originalPrice: 2500,
      isPremium: true,
      lastUpdated: 'February 2025',
      level: 'Beginner to Advanced',
      subtitles: 'English, Hindi',
      shortDescription: 'Master Adobe Creative Suite | Learn Logo Design, Typography, Branding, UI/UX Design & Create a Professional Portfolio',
      features: [
        'Create professional logos and branding materials',
        'Master Adobe Photoshop, Illustrator, and InDesign',
        'Design engaging social media graphics and digital assets',
        'Build your professional design portfolio'
      ]
    },
    {
      title: 'Ecommerce Mastery',
      modules: 6,
      duration: '3 Months',
      image: 'https://clictadigital.com/wp-content/uploads/2023/11/best-social-media-platforms.png',
      description: "Ecommerce Mastery is an exceptional choice for entrepreneurs seeking to establish a thriving ecommerce store or online business. Our comprehensive program covers a wide range of topics, including dropshipping, brand building, affiliate marketing, web development, reselling, and social media marketing. By joining Ecommerce Mastery, you'll learn how to start a successful dropshipping business, develop a strong brand identity, promote products through affiliate marketing, build a professional ecommerce website, resell products online, and leverage social media platforms to drive sales, gaining the knowledge and skills necessary to succeed in the competitive ecommerce landscape",
      badge: 'Pro',
      category: 'Ecommerce Mastery',
      path: 'ecommerce-mastery',
      author: 'David Martinez & Emma Wilson',
      rating: 4.9,
      reviewCount: 3218,
      currentPrice: 2000,
      originalPrice: 2999,
      isPremium: true,
      lastUpdated: 'March 2025',
      level: 'All Levels',
      subtitles: 'Multiple Languages',
      shortDescription: 'Launch, Scale & Optimize Your Online Store | Dropshipping, Brand Building, Shopify, WooCommerce & Marketing Strategies',
      features: [
        'Build and launch a profitable online store from scratch',
        'Master dropshipping, inventory management, and fulfillment',
        'Optimize your store for conversions and sales',
        'Implement effective marketing strategies for ecommerce'
      ]
    }
  ];

  constructor(private router: Router) {}

  get filteredCourses(): Course[] {
    return this.selectedCategory === 'ALL'
      ? this.courses
      : this.courses.filter(course => course.category === this.selectedCategory);
  }

  viewMore(course: Course) {
    // Store the selected course information for use in the registration page
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    
    // Navigate to the registration page with course information as query parameters
    this.router.navigate(['/register'], { 
      queryParams: { 
        courseId: course.path,
        title: course.title,
        price: course.currentPrice
      } 
    });
  }
}
