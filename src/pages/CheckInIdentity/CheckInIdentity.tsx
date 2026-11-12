import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppIcon from '@components/AppIcon';
import { useAuth } from '@hooks/useAuth';
import { completeCheckIn } from '@utils/checkIn';
import AppShell from '../../layouts/AppShell';

function UploadField({
  id,
  icon,
  title,
  description,
  file,
  capture,
  onChange,
}: {
  id: string;
  icon: 'camera' | 'document';
  title: string;
  description: string;
  file: File | null;
  capture: 'user' | 'environment';
  onChange: (file: File | null) => void;
}) {
  const isCamera = icon === 'camera';
  return (
    <div className={`relative flex min-h-[250px] px-5.5 py-6.5 flex-col items-center justify-center rounded-[16px] border-[1.5px] border-dashed border-[#e0e0e0] bg-white text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${file ? 'border-[rgba(46,125,50,0.42)] bg-[#f8fcf8]' : ''}`}>
      <div className={`inline-flex items-center justify-center mb-3.5 rounded-full bg-[#fff8f1] text-[#FF6A00] ${isCamera ? 'w-[86px] h-[86px] border-2 border-dashed border-[rgba(255,106,0,0.45)] bg-white shadow-[inset_0_0_0_7px_#fff8f1]' : 'w-[86px] h-[86px]'}`}>
        <AppIcon name={isCamera ? 'user' : 'document'} size={isCamera ? 34 : 24} />
      </div>
      <h2 className="mb-1.5 text-[15px] font-black text-[#232d3f]">{title}</h2>
      <p className="flex items-start justify-center min-h-[56px] max-w-[260px] mb-4.5 text-[12px] text-[#55657b] leading-[1.55]">{description}</p>
      <input
        id={id}
        name={id}
        type="file"
        accept="image/jpeg,image/png"
        capture={capture}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        required
        className="absolute w-1 h-1 p-0 border-0 overflow-hidden clip-[rect(0_0_0_0)] whitespace-nowrap"
      />
      <label htmlFor={id} className="px-3.75 py-2.25 border-[1.5px] border-[rgba(255,106,0,0.34)] rounded-lg bg-white text-[#FF6A00] cursor-pointer text-[12px] font-black hover:opacity-90 transition-opacity">
        {file
          ? isCamera
            ? 'Retake photo'
            : 'Replace photo'
          : isCamera
            ? 'Take a photo'
            : 'Take or upload photo'}
      </label>
      {file && <span className="max-w-full mt-3 overflow-hidden text-[#2e7d32] text-[11px] font-bold text-ellipsis whitespace-nowrap">✓ {file.name}</span>}
    </div>
  );
}

export default function CheckInIdentity() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selfie, setSelfie] = useState<File | null>(null);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);

  const displayName = (user as any)?.given_name || 'Agnes Lee';
  const email = (user as any)?.signInDetails?.loginId || 'a.lee@email.com';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selfie || !identityDocument) return;
    // Photos stay in the browser — they are not uploaded until an identity API exists.
    completeCheckIn();
    navigate('/dashboard', { replace: true, state: { checkInComplete: true } });
  };

  return (
    <AppShell displayName={displayName} email={email}>
      <div className="max-w-[860px] mx-auto pb-12 px-4 sm:px-6 md:px-4">
        <Link className="inline-flex mb-6 text-[#55657b] text-[12px] font-bold no-underline" to="/check-in/about">
          ← Back to your details
        </Link>

        <div className="flex items-center gap-4 mb-6 md:items-start">
          <div className="inline-flex items-center justify-center w-[46px] h-[46px] flex-shrink-0 rounded-[10px] bg-[#FF6A00] text-white shadow-[0_6px_16px_rgba(255,106,0,0.2)]">
            <AppIcon name="identification" size={24} />
          </div>
          <div>
            <p className="mb-0.75 text-[10px] font-black text-[#FF6A00] uppercase tracking-[0.09em]">Test check-in</p>
            <h1 className="mb-1 text-[26px] font-black text-[#232d3f] md:text-[26px]">Verify your identity</h1>
            <span className="block text-[13px] text-[#55657b]">Take a clear photo of yourself and upload an accepted identity document.</span>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-0 mb-6">
          <div className="absolute top-4 left-1/4 right-1/4 h-0.5 bg-[#e0e0e0] z-0" />
          <div className="relative z-10 flex flex-col items-center gap-1.25 text-[#55657b]">
            <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-transparent rounded-full bg-[#FF6A00] text-white text-[11px] font-black">✓</span>
            <p className="text-[11px] font-bold">About you</p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1.25 text-[#FF6A00]">
            <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-transparent rounded-full bg-[#FF6A00] text-white text-[11px] font-black">2</span>
            <p className="text-[11px] font-bold">Identity check</p>
          </div>
        </div>

        <section className="border-[1.5px] border-[rgba(255,106,0,0.24)] rounded-[16px] bg-[#fff8f1] shadow-none mb-5 px-6 py-5.5" aria-labelledby="checkin-instructions-title">
          <h2 id="checkin-instructions-title" className="mb-3.5 text-[14px] font-black text-[#232d3f]">
            Before you proceed, please read the following instructions:
          </h2>
          <ul className="flex flex-col gap-2.75 pl-5 list-disc">
            <li className="text-[#FF6A00] text-[12px] font-black pl-0.75">
              <strong>Photo of yourself</strong>
              <span className="block mt-0.5 text-[#55657b] font-normal leading-[1.55]">
                Remove glasses or face coverings and centre your face in the on-screen circle.
              </span>
            </li>
            <li className="text-[#FF6A00] text-[12px] font-black pl-0.75">
              <strong>Photo of your Identity documents</strong>
              <span className="block mt-0.5 text-[#55657b] font-normal leading-[1.55]">
                Your original identity documents should be taken against a plain background.
              </span>
            </li>
          </ul>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <UploadField
              id="selfie"
              icon="camera"
              title="Photo of yourself"
              description="Use your device camera to take a clear photo of yourself."
              file={selfie}
              capture="user"
              onChange={setSelfie}
            />
            <UploadField
              id="identityDocument"
              icon="document"
              title="Identity document"
              description="Upload a clear photo of your original passport or national ID."
              file={identityDocument}
              capture="environment"
              onChange={setIdentityDocument}
            />
          </div>

          <div className="flex items-start gap-2.25 mt-4 px-3.5 py-3 rounded-lg bg-[#f5f5f5] text-[#55657b] text-[11px]">
            <span className="inline-flex items-center justify-center w-[17px] h-[17px] flex-shrink-0 rounded-full bg-[#55657b] text-white text-[10px] font-black">i</span>
            <p>Your photos are used only to verify your identity for this test.</p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-7 pt-5.5 border-t border-[#e0e0e0] md:flex-row flex-col-reverse md:items-center">
            <Link to="/check-in/about" className="text-[#55657b] text-[12px] font-bold no-underline">Back</Link>
            <button type="submit" disabled={!selfie || !identityDocument} className="min-h-[42px] px-5 py-2.75 rounded-[10px] border-none bg-[#FF6A00] text-white cursor-pointer text-[13px] font-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-55 w-full md:w-auto">
              Complete check-in
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
