import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppIcon from '@components/AppIcon';
import { useAuth } from '@hooks/useAuth';
import AppShell from '../../layouts/AppShell';

const fieldOptions = {
  residence: ['Australia', 'New Zealand', 'Canada', 'United Kingdom', 'United States', 'Other'],
  language: ['Mandarin', 'English', 'Spanish', 'Hindi', 'Arabic', 'Other'],
  education: [
    'None',
    'Less than 1 year',
    '1–2 years',
    '3–5 years',
    '6–10 years',
    'More than 10 years',
  ],
  resultCountry: ['Australia', 'New Zealand', 'Canada', 'United Kingdom', 'United States', 'Other'],
};

function SelectField({ id, label, options }: { id: string; label: string; options: string[] }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1.75 text-[11px] font-bold text-[#55657b] uppercase tracking-[0.06em]">{label}</label>
      <select id={id} name={id} defaultValue="" required className="w-full px-3.5 py-3 border-[1.5px] border-[#e0e0e0] rounded-lg bg-white text-[13px] text-[#232d3f] font-sans">
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default function CheckInAbout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = (user as any)?.given_name || 'Agnes Lee';
  const email = (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Answers are not persisted yet — there is no check-in API.
    navigate('/check-in/identity');
  };

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="max-w-[860px] mx-auto pb-12 px-4 sm:px-6 md:px-4">
        <Link className="inline-flex mb-6 text-[#55657b] text-[12px] font-bold no-underline" to="/dashboard">
          ← Back to dashboard
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex items-center justify-center w-[46px] h-[46px] flex-shrink-0 rounded-[10px] bg-[#FF6A00] text-white shadow-[0_6px_16px_rgba(255,106,0,0.2)]">
            <AppIcon name="user" size={24} />
          </div>
          <div>
            <p className="mb-0.75 text-[10px] font-black text-[#FF6A00] uppercase tracking-[0.09em]">Test check-in</p>
            <h1 className="mb-1 text-[26px] font-black text-[#232d3f]">Tell us about yourself</h1>
            <span className="block text-[13px] text-[#55657b]">
              This information is collected to support research and service improvement only. It
              does not affect your test results
            </span>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-0 mb-6">
          <div className="absolute top-4 left-1/4 right-1/4 h-0.5 bg-[#e0e0e0] z-0" />
          <div className="relative z-10 flex flex-col items-center gap-1.25 text-[#55657b]">
            <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-transparent rounded-full bg-[#FF6A00] text-white text-[11px] font-black">1</span>
            <p className="text-[11px] font-bold">About you</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1.25 text-[#55657b]">
            <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-[#e0e0e0] rounded-full bg-white text-[11px] font-black">2</span>
            <p className="text-[11px] font-bold">Identity check</p>
          </div>
        </div>

        <form className="border-[1.5px] border-[#e0e0e0] rounded-[16px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-7 md:p-7" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-5 mb-0">
            <SelectField
              id="countryOfResidence"
              label="Country of residence"
              options={fieldOptions.residence}
            />
            <SelectField id="firstLanguage" label="First language" options={fieldOptions.language} />
            <SelectField
              id="englishEducation"
              label="Years of education in English"
              options={fieldOptions.education}
            />
            <SelectField
              id="resultCountry"
              label="Country where you plan to use your results"
              options={fieldOptions.resultCountry}
            />
          </div>

          <div className="flex items-center justify-between gap-4 mt-7 pt-5.5 border-t border-[#e0e0e0] md:flex-row flex-col-reverse md:items-center">
            <Link to="/dashboard" className="text-[#55657b] text-[12px] font-bold no-underline">Cancel</Link>
            <button type="submit" className="min-h-[42px] px-5 py-2.75 rounded-[10px] border-none bg-[#FF6A00] text-white cursor-pointer text-[13px] font-black hover:opacity-90 transition-opacity w-full md:w-auto">Continue to identity check →</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
