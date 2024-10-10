import React from 'react';
import { Metadata } from 'next';
import DocsClient from './DocsClient';

export const metadata: Metadata = {
  title: "API Documentation | Dhruvan"
}

export default function APIDocs() {
  return <DocsClient />;
}