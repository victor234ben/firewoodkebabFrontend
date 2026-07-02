import { APP_NAME } from '@/utils/constants';
import client from '@/services/api/client';
import { useState, useEffect } from 'react';

function parseMarkdown(md: string): string {
  if (!md) return "";
  return md
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .split('\n\n')
    .map(para => {
      const trimmed = para.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h')) return trimmed;
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
}

const TermsPage = () => {
  const [data, setData] = useState<{ title: string; content: string; lastUpdated: string } | null>(null);

  useEffect(() => {
    client.get('/content/terms')
      .then(res => {
        if (res.data?.terms) {
          setData(res.data.terms);
        }
      })
      .catch(err => {
        console.error("Failed to fetch terms:", err);
      });
  }, []);

  const title = data?.title || "Terms & Conditions";
  const lastUpdated = data?.lastUpdated || "March 2026";
  const content = data?.content;

  return (
    <main className="mt-10 pt-20 section-padding">
      <div className="container-wide max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        <h1 className="font-display">{title}</h1>
        <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }} />
        ) : (
          <>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using {APP_NAME}'s website and services, you agree to be bound by these terms and conditions.</p>
            <h2>2. Orders & Payment</h2>
            <p>All orders are subject to availability. Prices are listed in US Dollars ($) and include applicable taxes. Payment is processed securely through our payment partners.</p>
            <h2>3. Delivery</h2>
            <p>Delivery times are estimates and may vary depending on location and demand. We strive to deliver within the estimated timeframe provided at checkout.</p>
            <h2>4. Cancellations & Refunds</h2>
            <p>Orders may be cancelled within 5 minutes of placement. Refunds for cancelled orders will be processed within 3–5 business days.</p>
            <h2>5. Contact</h2>
            <p>For questions about these terms, please contact us through our Contact page.</p>
          </>
        )}
      </div>
    </main>
  );
};

export default TermsPage;
