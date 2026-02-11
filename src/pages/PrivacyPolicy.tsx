import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-5 py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-16 rounded-xl shadow-lg transition-colors duration-300">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Privacy Policy
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* 1 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">
          1. Introduction
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          Welcome to madnessLab ("we," "our," or "us"). We are committed to
          protecting your personal information and your right to privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you visit our website madnesslab.dev and use our
          AI consulting and development services.
        </p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          Please read this privacy policy carefully. If you do not agree with
          the terms of this privacy policy, please do not access the site or use
          our services.
        </p>

        {/* 2 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">
          2. Information We Collect
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          We collect information that you voluntarily provide to us when you:
        </p>

        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
          <li>Fill out contact forms</li>
          <li>Request a consultation or quote</li>
          <li>Subscribe to our newsletter</li>
          <li>Communicate via email or AI assistant</li>
          <li>Engage with our services</li>
        </ul>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          <strong>Personal Information:</strong> This may include your name,
          email address, phone number, company name, job title, and any other
          information you choose to provide.
        </p>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          <strong>Automatically Collected Information:</strong> We may collect
          IP address, browser type, operating system, referring URLs, and usage
          data.
        </p>

        {/* 3 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">
          3. How We Use Your Information
        </h2>

        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
          <li>Provide and maintain services</li>
          <li>Respond to inquiries</li>
          <li>Send marketing communications (with consent)</li>
          <li>Improve our website</li>
          <li>Analyze usage trends</li>
          <li>Prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>

        {/* 4 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">
          4. Sharing Your Information
        </h2>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          We do not sell, trade, or rent your personal information to third
          parties. We may share your information in the following situations:
        </p>

        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
          <li>
            <strong>Service Providers:</strong> Vendors performing services such
            as hosting, analytics, and email delivery.
          </li>
          <li>
            <strong>Legal Requirements:</strong> If required by law or public
            authorities.
          </li>
          <li>
            <strong>Business Transfers:</strong> During a merger, acquisition,
            or sale.
          </li>
          <li>
            <strong>With Your Consent:</strong> For any other purpose with your
            explicit consent.
          </li>
        </ul>

        {/* 5 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">
          5. Cookies and Tracking Technologies
        </h2>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          We use cookies and similar tracking technologies to collect and track
          browsing activity.
        </p>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          You can refuse cookies through your browser settings. However, some
          portions of the website may not function properly.
        </p>

        {/* 6 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">6. Data Security</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          We implement appropriate technical and organizational measures to
          protect your personal information. However, no internet transmission
          method is 100% secure.
        </p>

        {/* 7 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">7. Data Retention</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          We retain personal information only as long as necessary to fulfill
          the purposes it was collected for, including legal requirements.
        </p>

        {/* 8 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">8. Your Rights</h2>
        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-6 space-y-2">
          <li >Right to access your data</li>
          <li >Right to correct inaccurate data</li>
          <li >Right to delete your data</li>
          <li >Right to restrict or object to processing</li>
          <li >Right to data portability</li>
          <li >Right to withdraw consent</li>
        </ul>

        {/* 9 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">9. Third-Party Links</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          Our website may contain links to third-party sites. We are not
          responsible for their privacy practices.
        </p>

        {/* 10 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">10. Children's Privacy</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          Our services are not intended for individuals under 18. We do not
          knowingly collect personal information from children.
        </p>

        {/* 11 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">11. Changes to This Policy</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          We may update this Privacy Policy from time to time. Updates will be
          posted on this page with a revised "Last updated" date.
        </p>

        {/* 12 */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12 mb-5">12. Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
          mail@madnesslab.dev<br />
          madnesslab.dev
        </p>

        {/* Continue sections 6–12 using same pattern */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
