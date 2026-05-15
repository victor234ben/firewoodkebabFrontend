import { APP_NAME } from '@/utils/constants';

const TermsPage = () => (
  <main className="pt-20 section-padding">
    <div className="container-wide max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="font-display">Terms & Conditions</h1>
      <p className="text-muted-foreground">Last updated: March 2026</p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using {APP_NAME}'s website and services, you agree to be bound by these terms and conditions.</p>
      <h2>2. Orders & Payment</h2>
      <p>All orders are subject to availability. Prices are listed in world Naira ($) and include applicable taxes. Payment is processed securely through our payment partners.</p>
      <h2>3. Delivery</h2>
      <p>Delivery times are estimates and may vary depending on location and demand. We strive to deliver within the estimated timeframe provided at checkout.</p>
      <h2>4. Cancellations & Refunds</h2>
      <p>Orders may be cancelled within 5 minutes of placement. Refunds for cancelled orders will be processed within 3–5 business days.</p>
      <h2>5. Contact</h2>
      <p>For questions about these terms, please contact us through our Contact page.</p>
    </div>
  </main>
);

export default TermsPage;
