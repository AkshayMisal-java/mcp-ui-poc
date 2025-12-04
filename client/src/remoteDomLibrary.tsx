// client/src/remoteDomLibrary.tsx

import * as Dialog from '@radix-ui/react-dialog';
import * as Separator from '@radix-ui/react-separator';
import * as Label from '@radix-ui/react-label';
import { ComponentLibrary, remoteButtonDefinition, RemoteElementConfiguration, remoteImageDefinition, remoteStackDefinition, remoteTextDefinition } from '@mcp-ui/client';
import React from 'react';

// 1) Your React components, now using forwardRef so MCP-UI can attach refs

type AppTextProps = React.PropsWithChildren<{ content?: string, value?: string, variant?: 'muted' | 'normal' }>;

export const AppText = React.forwardRef<HTMLParagraphElement, AppTextProps>(
  ({ children, content, value, variant = 'normal', }, ref) => {
    const color = variant === 'muted' ? '#6b7280' : '#111827';
    console.log('AppText: ',children, content, value, variant);
    return (
      <p
        ref={ref}
        style={{
          margin: '4px 0',
          fontSize: 14,
          color,
        }}
      >
        {content}
      </p>
    );
  },
);
AppText.displayName = 'AppText';

type AppButtonProps = React.PropsWithChildren<{
  onPress?: () => void;
  title?: string, 
  label?: string,
  tone?: 'primary' | 'outline';
}>;

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ children, title, label, onPress, tone = 'primary' }, ref) => {
    console.log('AppButton: ',children, title, label);
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
        {title}
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

/* Radix elements*/
const RadixStack = React.forwardRef<
  HTMLDivElement,
  {
    direction?: string;
    spacing?: string;
    children?: React.ReactNode;
    align?: string;
    justify?: string;
    [key: string]: any;
  }
>(
  (
    {
      direction = 'vertical',
      spacing = '16',
      align = 'stretch',
      justify = 'flex-start',
      children,
      ...props
    },
    ref,
  ) => {
    return React.createElement(
      'div',
      {
        ref,
        style: {
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          gap: `${spacing}px`,
          alignItems: align,
          justifyContent: justify,
          padding: '20px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
          border: '2px solid #e5d3ff',
          boxShadow: '0 8px 32px rgba(108, 43, 217, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
          position: 'relative' as const,
        },
        ...props,
      },
      children,
    );
  },
);
RadixStack.displayName = 'RadixStack';

// Radix UI Text component using Label primitive
const RadixText = React.forwardRef<
  HTMLLabelElement,
  {
    content?: string;
    children?: React.ReactNode;
    htmlFor?: string;
    [key: string]: any;
  }
>(({ content, children, htmlFor, ...props }, ref) => {
  return React.createElement(
    'label',
    {
      ref,
      htmlFor,
      style: {
        fontSize: '15px',
        fontWeight: '600',
        lineHeight: '1.4',
        color: '#6c2bd9',
        display: 'block',
        marginBottom: '8px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        textShadow: '0 1px 2px rgba(108, 43, 217, 0.1)',
      },
      ...props,
    },
    content || children,
  );
});
RadixText.displayName = 'RadixText';


// Custom button using Radix styling patterns
const RadixButton = React.forwardRef<
  HTMLButtonElement,
  {
    label?: string;
    onPress?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    variant?: 'solid' | 'soft' | 'outline';
    [key: string]: any;
  }
>(({ label, onPress, onClick, children, variant = 'solid', ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('RadixButton clicked, calling handlers:', {
      label,
      variant,
      onPress: !!onPress,
      onClick: !!onClick,
    });

    // Call onPress if it exists (from remote press event)
    // Important: Don't pass the event object as it cannot be cloned for postMessage
    if (onPress) {
      onPress();
    }

    // Call onClick if it exists (standard React handler)
    if (onClick) {
      onClick(event);
    }
  };

  const getButtonStyles = () => {
    const baseStyles = {
      all: 'unset' as const,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      padding: '0 20px',
      fontSize: '14px',
      lineHeight: '1',
      fontWeight: '600',
      height: '40px',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid transparent',
      outline: 'none',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      textTransform: 'none' as const,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    };

    switch (variant) {
      case 'soft':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #f3e8ff, #e5d3ff)',
          color: '#6c2bd9',
          boxShadow:
            '0 4px 12px rgba(108, 43, 217, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        };
      case 'outline':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
          color: '#6c2bd9',
          borderColor: '#6c2bd9',
          borderWidth: '2px',
          borderStyle: 'solid',
          boxShadow: '0 2px 8px rgba(108, 43, 217, 0.1)',
        };
      default: // solid
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #6c2bd9, #8b5cf6)',
          color: 'white',
          boxShadow: '0 6px 20px rgba(108, 43, 217, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
        };
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    switch (variant) {
      case 'soft':
        target.style.background = 'linear-gradient(135deg, #ede9fe, #ddd6fe)';
        target.style.transform = 'translateY(-2px)';
        target.style.boxShadow =
          '0 8px 25px rgba(108, 43, 217, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.4)';
        break;
      case 'outline':
        target.style.background = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
        target.style.transform = 'translateY(-2px)';
        target.style.boxShadow = '0 6px 20px rgba(108, 43, 217, 0.2)';
        break;
      default:
        target.style.background = 'linear-gradient(135deg, #7c3aed, #9333ea)';
        target.style.transform = 'translateY(-2px)';
        target.style.boxShadow =
          '0 10px 30px rgba(108, 43, 217, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)';
        break;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const styles = getButtonStyles();
    target.style.background = styles.background as string;
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = styles.boxShadow as string;
  };

  const displayText = label || children || 'Button';

  return React.createElement(
    'button',
    {
      ref,
      onClick: handleClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      style: getButtonStyles(),
      ...props,
    },
    displayText,
  );
});
RadixButton.displayName = 'RadixButton';

// Radix Image component with enhanced styling
const RadixImage = React.forwardRef<
  HTMLImageElement,
  {
    src?: string;
    alt?: string;
    width?: string;
    height?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }
>(({ src, alt, width, height, children, ...props }, ref) => {
  // Explicitly ignore children since img elements can't have them
  void children;

  return React.createElement('img', {
    ref,
    src,
    alt,
    width,
    height,
    style: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '16px',
      border: '3px solid #e5d3ff',
      boxShadow: '0 12px 32px rgba(108, 43, 217, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)',
      padding: '4px',
      display: 'block',
    },
    onMouseEnter: (e: React.MouseEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      target.style.transform = 'scale(1.02) translateY(-4px)';
      target.style.boxShadow =
        '0 20px 40px rgba(108, 43, 217, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.6)';
      target.style.borderColor = '#c084fc';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      target.style.transform = 'scale(1) translateY(0)';
      target.style.boxShadow =
        '0 12px 32px rgba(108, 43, 217, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.6)';
      target.style.borderColor = '#e5d3ff';
    },
    ...props,
  });
});
RadixImage.displayName = 'RadixImage';

// 2) Component library – plain object, cast when used

export const appComponentLibrary: ComponentLibrary = {
  name: 'app-library',
  elements: [
   {
      tagName: 'ui-text',
      component: RadixText,
      propMapping: {
        content: 'content',
        htmlFor: 'htmlFor',
      },
      eventMapping: {},
    },
    {
      tagName: 'ui-button',
      component: RadixButton,
      propMapping: {
        label: 'label',
        variant: 'variant',
      },
      eventMapping: {
        press: 'onPress',
      },
    },
     {
      tagName: 'ui-stack',
      component: RadixStack,
      propMapping: {
        direction: 'direction',
        spacing: 'spacing',
        align: 'align',
        justify: 'justify',
      },
      eventMapping: {},
    },
     {
      tagName: 'ui-image',
      component: RadixImage,
      propMapping: {
        src: 'src',
        alt: 'alt',
        width: 'width',
        height: 'height',
      },
      eventMapping: {},
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


export const remoteFeedbackFormDefinition: RemoteElementConfiguration = {
  tagName: 'ui-feedback-form',
  // Attributes that Remote DOM is allowed to set via setAttribute(...)
  remoteAttributes: ['title', 'description', 'submitLabel'],
  // Events that Remote DOM can listen to via addEventListener(...)
  remoteEvents: ['submit'],
};

export const remoteChecklistFormDefinition: RemoteElementConfiguration = {
  tagName: 'ui-checklist-form',
  remoteAttributes: ['title', 'description', 'items', 'submitLabel'],
  remoteEvents: ['submit'],
};

export  const remoteElements = [
  remoteTextDefinition,
  remoteButtonDefinition,
  remoteStackDefinition,
  remoteImageDefinition,
  remoteFeedbackFormDefinition,
  remoteChecklistFormDefinition
];

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
