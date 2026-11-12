import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import AppShell from '../layouts/AppShell';
import { Button } from '@components/common/Button';
import { Input } from '@components/common/Input';
import { Card } from '@components/common/Card';

const CHECKOUT_FEATURES = [
  'A clear score, mapped to CEFR',
  'Reviewed by certified assessors',
  'Accepted by institutions around the globe',
  'Certified in days',
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayName = (user as any)?.given_name || 'Agnes Lee';
  const email = (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  const handleBack = () => {
    navigate('/book', { replace: false });
  };

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="max-w-[900px] mx-auto pb-12 px-4 sm:px-6 md:px-4">
        {/* Back button and title */}
        <button
          type="button"
          onClick={handleBack}
          className="text-[14px] font-semibold text-[#55657b] bg-none border-none cursor-pointer mb-6 p-0 flex items-center gap-1"
        >
          ← Back
        </button>

        <div className="max-w-[600px]">
          <h1 className="text-[28px] font-black text-[#232d3f] mb-1">
            Checkout
          </h1>
          <p className="text-[14px] text-[#55657b] mb-8">
            IDP English Test · One-time access
          </p>

          {/* Order Summary Card */}
          <Card 
            bordered={true}
            padding="lg"
            shadow="sm"
            className="bg-[#fff3ea] border-[#FFC89F] mb-8"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[15px] font-bold text-[#232d3f]">
                  IDP English Test
                </span>
              </div>
              <span className="text-[18px] font-black text-[#232d3f]">$89 AUD</span>
            </div>
            <div className="text-[13px] text-[#55657b] mb-4">
              ONE TIME TEST · UP TO 80 MINS · Results in 48 hours
            </div>
            <div className="border-t border-[#FFC89F] pt-4">
              <div className="text-[13px] text-[#55657b] flex flex-col gap-2.5">
                {CHECKOUT_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <span className="text-[#FF6A00] font-black">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Payment Form Section */}
          <div className="mb-8">
            <h2 className="text-[16px] font-black text-[#232d3f] mb-6">
              Payment information
            </h2>

            {/* Card Number */}
            <Input
              label="Card number"
              name="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
            />

            {/* Expiry and CVV Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Expiry"
                name="card-expiry"
                autoComplete="cc-exp"
                placeholder="MM / YY"
              />
              <Input
                label="CVV"
                name="card-cvv"
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="•••"
              />
            </div>

            {/* Name on Card */}
            <Input
              label="Name on card"
              name="card-name"
              autoComplete="cc-name"
              placeholder="Agnes Lee"
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="terms" className="text-[13px] text-[#55657b] cursor-pointer">
              I agree to the{' '}
              <span className="text-[#FF6A00] font-bold">
                Terms of Service and Privacy Policy
              </span>
            </label>
          </div>

          {/* Pay Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            type="button"
            className="mb-3"
          >
            Pay $89 AUD
          </Button>
          <p className="text-[12px] text-[#55657b] text-center">
            CONDITIONS APPLY · Secure payment
          </p>
        </div>
      </div>
    </AppShell>
  );
}
