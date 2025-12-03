// client/src/remoteDomLibrary.tsx
import React from 'react';

// 1) Your React components, now using forwardRef so MCP-UI can attach refs

type AppTextProps = React.PropsWithChildren<{ variant?: 'muted' | 'normal' }>;

export const AppText = React.forwardRef<HTMLParagraphElement, AppTextProps>(
  ({ children, variant = 'normal' }, ref) => {
    const color = variant === 'muted' ? '#6b7280' : '#111827';
    console.log('AppText: ',children);
    return (
      <p
        ref={ref}
        style={{
          margin: '4px 0',
          fontSize: 14,
          color,
        }}
      >
        {children}
      </p>
    );
  },
);
AppText.displayName = 'AppText';

type AppButtonProps = React.PropsWithChildren<{
  onPress?: () => void;
  tone?: 'primary' | 'outline';
}>;

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ children, onPress, tone = 'primary' }, ref) => {
    console.log('AppButton: ',children);
    const base: React.CSSProperties = {
      padding: '6px 12px',
      borderRadius: 999,
      fontSize: 13,
      cursor: 'pointer',
      fontWeight: 500,
    };

    const tones: Record<string, React.CSSProperties> = {
      primary: {
        background: '#2563eb',
        color: 'white',
        border: 'none',
      },
      outline: {
        background: 'white',
        color: '#111827',
        border: '1px solid #d1d5db',
      },
    };

    return (
      <button
        ref={ref}
        style={{ ...base, ...tones[tone] }}
        onClick={onPress}
      >
        {children}
      </button>
    );
  },
);
AppButton.displayName = 'AppButton';

type AppCardProps = React.PropsWithChildren<{ title?: string }>;

export const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  ({ children, title }, ref) => {
    console.log('AppCard: ',children);
    return (
      <div
        ref={ref}
        style={{
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 12,
          background: 'white',
          boxShadow: '0 4px 8px rgba(15,23,42,0.05)',
        }}
      >
        {title && (
          <h3
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            {title}
          </h3>
        )}
        {children}
      </div>
    );
  },
);
AppCard.displayName = 'AppCard';

// 2) Component library – plain object, cast when used

export const appComponentLibrary = {
  name: 'app-library',
  elements: [
    {
      tagName: 'ui-text',
      component: AppText as React.ComponentType<any>,
      propMapping: {
        value: 'children',
        variant: 'variant',
      },
    },
    {
      tagName: 'ui-button',
      component: AppButton as React.ComponentType<any>,
      propMapping: {
        label: 'children',
        tone: 'tone',
      },
      eventMapping: {
        press: 'onPress',
      },
    },
    {
      tagName: 'ui-card',
      component: AppCard as React.ComponentType<any>,
      propMapping: {
        title: 'title',
      },
    },
  ],
};

// 3) Remote elements config

export const appRemoteElements = [
  {
    tagName: 'ui-text',
    properties: {
      value: { type: String },
      variant: { type: String },
    },
  },
  {
    tagName: 'ui-button',
    properties: {
      label: { type: String },
      tone: { type: String },
    },
    events: {
      press: {},
    },
  },
  {
    tagName: 'ui-card',
    properties: {
      title: { type: String },
    },
  },
];
