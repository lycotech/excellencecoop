'use client';

import React, { useEffect, useRef } from 'react';

// Skip to content link component
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>
  );
}

// Focus trap for modals and dialogs
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus first element
    firstElement?.focus();

    container.addEventListener('keydown', handleTabKey as EventListener);

    return () => {
      container.removeEventListener('keydown', handleTabKey as EventListener);
    };
  }, [isActive]);

  return containerRef;
}

// Announce changes for screen readers
export function useLiveRegion() {
  const regionRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-live', priority);
      regionRef.current.textContent = message;
    }
  };

  return { regionRef, announce };
}

// Live Region Component
export function LiveRegion() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      id="live-region"
    />
  );
}

// Keyboard Navigation Hook
export function useKeyboardNavigation(onEscape?: () => void, onEnter?: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
      if (e.key === 'Enter' && onEnter) {
        onEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter]);
}

// ARIA Announcer Hook
export function useAnnouncer() {
  const announce = (message: string) => {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  return { announce };
}

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  ariaLabel?: string;
  loading?: boolean;
}

export function AccessibleButton({
  children,
  ariaLabel,
  loading,
  disabled,
  ...props
}: AccessibleButtonProps) {
  return (
    <button
      {...props}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="sr-only">Loading...</span>
          <span aria-hidden="true">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Accessible Icon Button
interface AccessibleIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
}

export function AccessibleIconButton({
  icon,
  label,
  ...props
}: AccessibleIconButtonProps) {
  return (
    <button {...props} aria-label={label} title={label}>
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

// Accessible Form Field
interface AccessibleFormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
}

export function AccessibleFormField({
  id,
  label,
  error,
  required,
  children,
  description,
}: AccessibleFormFieldProps) {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
      </label>
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <div
        aria-describedby={`${error ? errorId : ''} ${description ? descriptionId : ''}`.trim()}
        aria-invalid={!!error}
      >
        {children}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible Modal Wrapper
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: AccessibleModalProps) {
  const containerRef = useFocusTrap(isOpen);
  useKeyboardNavigation(onClose);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="relative bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 id="modal-title" className="text-xl font-bold mb-2">
          {title}
        </h2>
        {description && (
          <p id="modal-description" className="text-sm text-muted-foreground mb-4">
            {description}
          </p>
        )}
        <div>{children}</div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
}



