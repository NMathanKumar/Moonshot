/**
 * Stepper Component
 * Multi-step progress indicator with optional step navigation.
 * Display-only or optionally clickable for step navigation.
 * WCAG 2.1 AA.
 */

export interface Step {
  label: string;
  id?: string;
}

export interface StepperProps {
  steps?: Step[];
  activeStep?: number;
  onStepClick?: (index: number) => void;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps = [],
  activeStep = 0,
  onStepClick,
  disabled = false,
  orientation = 'horizontal',
  className = '',
}) => {
  const isHorizontal = orientation === 'horizontal';
  const stepperClass = [
    'flex gap-4',
    isHorizontal ? 'flex-row items-center' : 'flex-col items-start',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleStepClick = (index: number) => {
    if (disabled || !onStepClick) return;
    onStepClick(index);
  };

  return (
    <div className={stepperClass} role="group" aria-label="Progress steps">
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const isFuture = index > activeStep;

        const stepButtonContent = (
          <>
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm border-2 flex-shrink-0 transition-all ${
                isCompleted
                  ? 'bg-[#FF6A00] border-[#FF6A00] text-white'
                  : isActive
                    ? 'bg-[#FF6A00] border-[#FF6A00] text-white shadow-[0_0_0_3px_rgba(255,106,0,0.1)]'
                    : disabled || isFuture
                      ? 'border-[#DDE2E7] bg-white text-[#232D3F] opacity-50'
                      : 'border-[#DDE2E7] bg-white text-[#232D3F]'
              }`}
            >
              {isCompleted ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 11-1.06-1.06L12.72 4.22a.75.75 0 011.06 0z" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className={`flex flex-col gap-1 ${isHorizontal ? 'items-center' : 'items-start'}`}>
              <p
                className={`text-sm font-medium ${isFuture ? 'text-[#55657B]' : 'text-[#232D3F]'}`}
              >
                {step.label}
              </p>
            </div>
          </>
        );

        return (
          <div
            key={step.id || index}
            className={`flex ${isHorizontal ? 'flex-row items-center' : 'flex-col items-start'} relative flex-1`}
          >
            {/* Connector line (not on last step) */}
            {index < steps.length - 1 && (
              <div
                className={`absolute ${
                  isHorizontal
                    ? 'top-4.5 left-1/2 w-[calc(100%-36px)] h-0.5 ml-4.5'
                    : 'left-4.5 top-9 w-0.5 h-[calc(100%-36px)]'
                } ${index < activeStep ? 'bg-[#FF6A00]' : 'bg-[#DDE2E7]'} transition-colors`}
              />
            )}

            {/* Step content */}
            {onStepClick && !disabled ? (
              <button
                type="button"
                className={`bg-none border-none p-0 cursor-pointer flex gap-2 w-full text-left rounded-md transition-colors ${
                  isHorizontal ? 'flex-col items-center text-center' : 'flex-row'
                } hover:bg-[#fafafa] focus-visible:outline-2 focus-visible:outline-[#FF6A00] focus-visible:outline-offset-2 disabled:cursor-not-allowed`}
                onClick={() => handleStepClick(index)}
                disabled={isFuture || disabled}
                aria-label={`Step ${index + 1}: ${step.label}${isActive ? ' (current)' : ''}${isCompleted ? ' (completed)' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {stepButtonContent}
              </button>
            ) : (
              stepButtonContent
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
