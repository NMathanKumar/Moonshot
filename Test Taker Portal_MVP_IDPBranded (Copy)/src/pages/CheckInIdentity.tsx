import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppIcon from "@/components/AppIcon";
import { completeCheckIn } from "@/lib/checkIn";

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
  icon: "camera" | "document";
  title: string;
  description: string;
  file: File | null;
  capture: "user" | "environment";
  onChange: (file: File | null) => void;
}) {
  return (
    <div className={`checkin-upload${file ? " complete" : ""}`}>
      <div className={`checkin-upload-icon${icon === "camera" ? " face-guide" : ""}`}>
        <AppIcon name={icon === "camera" ? "user" : icon} size={icon === "camera" ? 34 : 24} />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <input
        id={id}
        name={id}
        type="file"
        accept="image/jpeg,image/png"
        capture={capture}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        required
      />
      <label htmlFor={id}>
        {file
          ? icon === "camera" ? "Retake photo" : "Replace photo"
          : icon === "camera" ? "Take a photo" : "Take or upload photo"}
      </label>
      {file && <span className="checkin-file-name">✓ {file.name}</span>}
    </div>
  );
}

export default function CheckInIdentity() {
  const navigate = useNavigate();
  const [selfie, setSelfie] = useState<File | null>(null);
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selfie || !identityDocument) return;
    completeCheckIn();
    navigate("/dashboard", { replace: true, state: { checkInComplete: true } });
  };

  return (
    <div className="checkin-page">
      <Link className="checkin-back-link" to="/check-in/about">← Back to your details</Link>

      <div className="checkin-heading">
        <div className="checkin-heading-icon"><AppIcon name="identification" size={24} /></div>
        <div>
          <p>Test check-in</p>
          <h1>Verify your identity</h1>
          <span>Take a clear photo of yourself and upload an accepted identity document.</span>
        </div>
      </div>

      <div className="checkin-progress" aria-label="Step 2 of 2">
        <div className="complete"><span>✓</span><p>About you</p></div>
        <div className="active"><span>2</span><p>Identity check</p></div>
      </div>

      <section className="checkin-instructions" aria-labelledby="checkin-instructions-title">
        <h2 id="checkin-instructions-title">Before you proceed, please read the following instructions:</h2>
        <ul>
          <li>
            <strong>Photo of yourself</strong>
            <span>Remove glasses or face coverings and centre your face in the on-screen circle.</span>
          </li>
          <li>
            <strong>Photo of your Identity documents</strong>
            <span>Your original identity documents should be taken against a plain background.</span>
          </li>
        </ul>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="checkin-upload-grid">
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

        <div className="checkin-privacy">
          <span aria-hidden="true">i</span>
          <p>Your photos are used only to verify your identity for this test.</p>
        </div>

        <div className="checkin-actions">
          <Link to="/check-in/about">Back</Link>
          <button type="submit" disabled={!selfie || !identityDocument}>Complete check-in</button>
        </div>
      </form>
    </div>
  );
}
