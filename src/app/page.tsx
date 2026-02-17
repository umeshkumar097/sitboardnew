import Link from 'next/link';
import SignupForm from '@/components/SignupForm';
import PricingSection from '@/components/PricingSection';
import BrandLogo from '@/components/BrandLogo';
import LandingPageTemplate from '@/components/LandingPageTemplate';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SiteBoard | Best Real Estate CRM & Management Software in India',
  description: 'SiteBoard is the #1 Real Estate ERP Software in India for builders. Manage plots, bookings, and sales with our top-rated Real Estate Management Software.',
  keywords: 'real estate crm software, real estate software, real estate erp software india, real estate management software, real estate software development, best real estate management software, best real estate crm software in india, real estate plot managment',
};

import pool from '@/lib/db';

async function getLatestBlogs() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT id, title, slug, excerpt, featured_image, published_at 
      FROM blogs 
      WHERE published = true 
      ORDER BY published_at DESC 
      LIMIT 3
    `);
    return res.rows;
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  } finally {
    client.release();
  }
}

export default async function Home() {
  const blogs = await getLatestBlogs();

  return (
    <LandingPageTemplate source="home" blogs={blogs} />
  );
}
