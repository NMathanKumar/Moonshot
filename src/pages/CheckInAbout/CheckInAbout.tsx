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
    <div className="checkin-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={id} defaultValue="" required>
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
      <div className="checkin-page">
        <Link className="checkin-back-link" to="/dashboard">
          ← Back to dashboard
        </Link>

        <div className="checkin-heading">
          <div className="checkin-heading-icon">
            <AppIcon name="user" size={24} />
          </div>
          <div>
            <p>Test check-in</p>
            <h1>Tell us about yourself</h1>
            <span>
              This information is collected to support research and service improvement only. It
              does not affect your test results
            </span>
          </div>
        </div>

        <div className="checkin-progress" aria-label="Step 1 of 2">
          <div className="active" aria-current="step">
            <span>1</span>
            <p>About you</p>
          </div>
          <div>
            <span>2</span>
            <p>Identity check</p>
          </div>
        </div>

        <form className="checkin-card" onSubmit={handleSubmit}>
          <div className="checkin-form-grid">
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

          <div className="checkin-actions">
            <Link to="/dashboard">Cancel</Link>
            <button type="submit">Continue to identity check →</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
