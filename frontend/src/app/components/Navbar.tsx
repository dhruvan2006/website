import { auth } from '@/auth';
import NavbarClient from './NavbarClient';

interface Indicator {
  name: string;
  url_name: string;
  human_name: string;
}

interface Category {
  name: string;
  id: number;
}

export interface CategoryWithIndicators {
  category: Category;
  indicators: Indicator[];
}

export interface DataSource {
  url: string;
  name: string;
  description: string;
}

export interface Notebook {
  path: string;
  name: string;
}

async function getIndicators() {
  const res = await fetch('https://api.gnanadhandayuthapani.com/api/indicators/categories_with_indicators');
  const data = res.json();
  if (!res.ok) {
    return 'There was an error.';
  }
  return data;
}

async function getDataSources() {
  const res = await fetch('https://api.gnanadhandayuthapani.com/api/indicators/datasource');
  const data = res.json();
  if (!res.ok) {
    return 'There was an error.';
  }
  return data;
}
async function getNotebooks() {
  const res = await fetch('https://api.gnanadhandayuthapani.com/api/research/notebooks');
  const data = res.json();
  if (!res.ok) {
    return 'There was an error.';
  }
  return data;
}

export default async function Navbar() {
  const [indicators, dataSources, notebooks] = await Promise.all([
    getIndicators(),
    getDataSources(),
    getNotebooks()
  ]);

  const session = await auth();

  return <NavbarClient indicators={indicators} dataSources={dataSources} notebooks={notebooks} session={session} />
}
