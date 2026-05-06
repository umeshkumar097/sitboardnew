import LandingPageTemplate from '@/components/LandingPageTemplate';
import { Metadata } from 'next';
import Script from 'next/script';
import { getLatestBlogs } from '@/lib/db';

export const metadata: Metadata = {
  title: 'SiteBoard – Plot Management & Real Estate CRM Software for Indian Builders',
  description: 'SiteBoard is India\'s #1 Visual Plot Management & Real Estate CRM Software. Track bookings, prevent double booking, and manage your entire project in one dashboard. Built for Indian builders and land developers.',
  keywords: 'real estate crm software india, plot management software, plot booking software, builder crm software india, real estate erp software india, real estate management software, best real estate crm india, real estate inventory management software, land developer software india',
  openGraph: {
    title: 'SiteBoard – Plot Management & Real Estate CRM for Indian Builders',
    description: 'India\'s #1 visual plot management and real estate CRM. Prevent double booking, manage leads, and run your entire sales floor from one dashboard.',
    type: 'website',
    url: 'https://siteboard.in',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SiteBoard',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Android, iOS',
  description: 'India\'s #1 Visual Plot Management & Real Estate CRM Software for builders and land developers.',
  url: 'https://siteboard.in',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
    description: 'Free early access available. Paid plans start post-launch.'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '47',
    bestRating: '5',
    worstRating: '1'
  }
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best real estate CRM software for Indian builders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SiteBoard is the best real estate CRM software for Indian builders. It combines visual plot management with CRM lead tracking, preventing double bookings and giving owners 100% visibility into their project.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does SiteBoard prevent double booking of plots?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Once a plot is marked Booked or Sold in SiteBoard, it is instantly locked for all agents. Double booking is technically impossible on the platform.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I manage multiple real estate projects on SiteBoard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SiteBoard supports unlimited projects. You can switch between projects from a single admin account and give agents view-only access to specific projects.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is SiteBoard suitable for small builders with one project?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. SiteBoard is designed to scale — from a single project with 20 plots to large enterprises with 10+ projects and hundreds of plots.'
      }
    }
  ]
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'AICLEX Technologies – SiteBoard',
  description: 'Real estate CRM and plot management software company in Greater Noida, India.',
  url: 'https://siteboard.in',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Greater Noida',
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN'
  },
  sameAs: ['https://siteboard.in']
};

export default async function Home() {
  const blogs = await getLatestBlogs(3);

  return (
    <>
      <Script
        id="schema-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="schema-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="schema-local"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <LandingPageTemplate source="home" blogs={blogs} />
    </>
  );
}
