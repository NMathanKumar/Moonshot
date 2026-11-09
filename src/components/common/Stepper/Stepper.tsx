/**
 * Stepper Component
 * Multi-step progress indicator with optional step navigation.
 * Display-only or optionally clickable for step navigation.
 * WCAG 2.1 AA.
 */

import styles from './Stepper.module.css';

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
  const stepperClass = [
    styles.stepper,
    styles[orientation],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleStepClick = (index: number) => {
    if (disabled || !onStepClick) return;
    onStepClick(index);
  };

  return (
    <div
      className={stepperClass}
      role="group"
      aria-label="Progress steps"
    >
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const isFuture = index > activeStep;

        const stepClass = [
          styles.step,
          orientation === 'vertical' ? styles.vertical : '',
          isCompleted ? styles.completed : '',
          isActive ? styles.active : '',
          disabled || isFuture ? styles.disabled : '',
        ]
          .filter(Boolean)
          .join(' ');

        const stepButtonContent = (
          <>
            <div className={styles.stepIndicator}>
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
            <div
              className={[
                styles.stepLabel,
                orientation === 'horizontal' ? styles.horizontal : styles.vertical,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <p className={[styles.stepText, isFuture ? styles.disabled : ''].filter(Boolean).join(' ')}>
                {step.label}
              </p>
            </div>
          </>
        );

        return (
          <div key={step.id || index} className={stepClass}>
            {/* Connector line (not on last step) */}
            {index < steps.length - 1 && (
              <div
                className={[
                  styles.connector,
                  index < activeStep ? styles.completed : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            )}

            {/* Step content */}
            {onStepClick && !disabled ? (
              <button
                type="button"
                className={styles.stepButton}
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
