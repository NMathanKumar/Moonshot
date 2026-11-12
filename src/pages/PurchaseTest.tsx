import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppIcon from '@components/AppIcon';
import { useAuth } from '@hooks/useAuth';
import AppShell from '../layouts/AppShell';

/**
 * Flags are rendered as images because Windows browsers do not render
 * flag emoji (they show the two-letter country code instead).
 */
const institutions = [
  { name: 'University of Melbourne', country: 'Australia', type: 'University', flag: 'au', code: 'AU004827' },
  { name: 'University of Sydney', country: 'Australia', type: 'University', flag: 'au', code: 'AU004828' },
  { name: 'University of Auckland', country: 'New Zealand', type: 'University', flag: 'nz', code: 'NZ004829' },
  { name: 'University of Toronto', country: 'Canada', type: 'University', flag: 'ca', code: 'CA004830' },
  { name: 'Imperial College London', country: 'United Kingdom', type: 'University', flag: 'gb', code: 'GB004831' },
  { name: 'NUS Singapore', country: 'Singapore', type: 'University', flag: 'sg', code: 'SG004832' },
];

const faqs = [
  { q: 'How long is the test?', a: '~80 minutes, uninterrupted. Four skills: Reading, Listening, Writing, and Speaking in one sitting.' },
  { q: 'When do I get my results?', a: 'Results are ready within 48 hours, reviewed by certified human assessors.' },
  { q: 'How many times can I take the test?', a: 'You can only take this test once per purchase. Practice tests are available for free.' },
  { q: 'Where is the test accepted?', a: 'Over 2,000 institutions and organisations worldwide. Use the search above to find yours.' },
];

const CHECKOUT_FEATURES = ['Four skills, one sitting', 'Results in 48 hours', 'Certified in days', 'Recognised worldwide'];
const TEST_FEATURES = ['Four skills, one sitting', 'Results in 48 hours', 'Certified in days', 'Recognised worldwide'];
const PRACTICE_FEATURES = [
  'Practise all four skills',
  'Get an estimated score',
  'Complete the test in your own time',
  'Feel more confident on test day',
];

export default function PurchaseTest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const displayName = (user as any)?.given_name || 'Agnes Lee';
  const email = (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  const term = search.toLowerCase();
  const filtered = institutions.filter(
    (i) => i.name.toLowerCase().includes(term) || i.country.toLowerCase().includes(term)
  );

  const handleCheckout = () => {
    navigate('/checkout', { replace: false });
  };

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="max-w-[900px] mx-auto pb-12 px-4 sm:px-6 md:px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div>
            <Link
              to="/dashboard"
              className="text-[13px] text-[#55657b] no-underline font-semibold"
            >
              ← Dashboard
            </Link>
            <h1 className="text-[24px] font-black text-[#232d3f] mt-2">
              Purchase Test
            </h1>
            <p className="text-[14px] text-[#55657b] mt-1">
              Prove your English. Open your future.
            </p>
          </div>
        </div>

        {/* Hero Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
          {/* Test Card */}
          <div className="bg-[#fff3ea] rounded-[16px] px-8 py-7 text-[#232d3f] border border-[#FFC89F] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex flex-col">
            <p className="text-[11px] font-bold text-[#232d3f] uppercase tracking-[0.1em] mb-3">
              IDP English Test
            </p>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-[48px] font-black leading-[1] text-[#FF6A00]">
                $89
              </span>
              <span className="text-[16px] text-[#55657b] pb-1.5">
                AUD
              </span>
            </div>
            <div className="flex flex-col gap-2 mb-6 flex-1">
              {TEST_FEATURES.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 text-[13px] text-[#55657b]"
                >
                  <span className="text-[#FF6A00] font-black">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3 rounded-[10px] border-none bg-[#FF6A00] text-white text-[14px] font-black cursor-pointer hover:opacity-90 transition-opacity"
            >
              Purchase Test →
            </button>
          </div>

          {/* Practice Card */}
          <div className="bg-[#f5f5f5] rounded-[16px] px-8 py-7 border border-[#e0e0e0] flex flex-col">
            <p className="text-[22px] font-black text-[#232d3f] mb-1">
              Practice for free
            </p>
            <p className="text-[13px] text-[#55657b] mb-5 leading-[1.6]">
              See what the test is like before test day. Take a full practice test, receive an
              estimated score, and go at your own pace.
            </p>
            <p className="text-[11px] font-bold text-[#232d3f] uppercase tracking-[0.08em] mb-2.5">
              What's included
            </p>
            <div className="flex flex-col gap-2 mb-6 flex-1">
              {PRACTICE_FEATURES.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 text-[12px] text-[#55657b]"
                >
                  <span className="text-[#FF6A00]">→</span>
                  {f}
                </div>
              ))}
            </div>
            <Link
              to="/practice"
              className="block text-center py-3 rounded-[10px] border-[1.5px] border-[#e0e0e0] bg-white text-[#232d3f] text-[14px] font-bold no-underline hover:bg-[#f9f9f9] transition-colors"
            >
              Start free practice →
            </Link>
          </div>
        </div>

        {/* Institutions Section */}
        <div className="bg-white rounded-[16px] border border-[#e0e0e0] px-7 py-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-1">
            <div>
              <h2 className="text-[16px] font-black text-[#232d3f]">
                WHERE IDP ENGLISH TEST IS ACCEPTED
              </h2>
              <p className="text-[13px] text-[#55657b] mt-0.5">
                2,000+ institutions and organizations worldwide
              </p>
            </div>
          </div>

          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-3 mb-1 md:gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search institutions…"
              aria-label="Search institutions"
              className="px-3.5 py-2.5 rounded-lg border-[1.5px] border-[#e0e0e0] bg-white text-[13px] text-[#232d3f] outline-none font-sans flex-1 min-w-0"
            />
            <select aria-label="Institution type" className="px-3.5 py-2.5 rounded-lg border-[1.5px] border-[#e0e0e0] bg-white text-[13px] text-[#232d3f] outline-none font-sans w-full md:w-[150px] flex-shrink-0">
              <option>All types</option>
              <option>University</option>
              <option>College</option>
              <option>Government</option>
            </select>
            <select aria-label="Region" className="px-3.5 py-2.5 rounded-lg border-[1.5px] border-[#e0e0e0] bg-white text-[13px] text-[#232d3f] outline-none font-sans w-full md:w-[150px] flex-shrink-0">
              <option>All regions</option>
              <option>Asia Pacific</option>
              <option>North America</option>
              <option>Europe</option>
            </select>
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filtered.map((inst) => (
              <div
                key={inst.code}
                className="px-4 py-3.5 rounded-[10px] border border-[#e0e0e0] bg-[#f5f5f5]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/w40/${inst.flag}.png`}
                    alt={`${inst.country} flag`}
                    width={22}
                    height={15}
                    className="w-[22px] h-auto flex-shrink-0 rounded-sm"
                  />
                  <div>
                    <div className="text-[13px] font-bold text-[#232d3f] leading-[1.3]">
                      {inst.name}
                    </div>
                    <div className="text-[11px] text-[#55657b] mt-0.5">
                      {inst.country} · {inst.type}
                    </div>
                    <div className="text-[10px] font-bold text-[#55657b] mt-1 tracking-[0.04em]">
                      Code: {inst.code}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-[#55657b]">
              <div className="flex justify-center mb-1">
                <AppIcon name="search" size={24} />
              </div>
              <p className="text-[13px] font-semibold mb-1">
                Try a different institution name, country, or clear your filters.
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-[12px] text-[#FF6A00] bg-none border-none cursor-pointer font-bold"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Nomination Footer */}
          <div className="mt-4 text-center">
            <p className="text-[12px] text-[#55657b] mb-2">
              Don't see your institution?
            </p>
            <button
              type="button"
              className="text-[13px] font-bold text-[#FF6A00] bg-none border-none cursor-pointer"
            >
              Submit a nomination →
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-[16px] border border-[#e0e0e0] px-7 py-6">
          <h2 className="text-[16px] font-black text-[#232d3f] mb-4">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-0">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className={i < faqs.length - 1 ? 'border-b border-[#e0e0e0]' : ''}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left py-4 bg-none border-none text-[14px] font-bold text-[#232d3f] cursor-pointer flex items-center justify-between outline-none hover:text-[#FF6A00] transition-colors"
                  >
                    {faq.q}
                    <span aria-hidden="true" className="text-[#55657b] text-[16px]">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <p
                      id={`faq-answer-${i}`}
                      className="text-[13px] text-[#55657b] leading-[1.7] pb-4"
                    >
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
