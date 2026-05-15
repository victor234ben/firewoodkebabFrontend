import { APP_NAME } from '@/utils/constants';

const PrivacyPolicyPage = () => (
  <main className="pt-20 section-padding">
    <div className="container-wide max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="font-display">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: March 2026</p>
      <h2>1. Information We Collect</h2>
      <p>{APP_NAME} collects personal information you provide when creating an account, placing orders, or contacting us. This includes your name, email, phone number, delivery address, and payment information.</p>
      <h2>2. How We Use Your Information</h2>
      <p>We use your information to process orders, improve our services, send order updates, and communicate promotional offers (with your consent).</p>
      <h2>3. Data Security</h2>
      <p>We implement industry-standard security measures to protect your personal data. Payment information is processed securely through our PCI-compliant payment partners.</p>
      <h2>4. Cookies</h2>
      <p>We use cookies to enhance your browsing experience and analyze site traffic.</p>
      <h2>5. Your Rights</h2>
      <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.</p>
    </div>
  </main>
);

export default PrivacyPolicyPage;
