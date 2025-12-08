/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Separator from '@radix-ui/react-separator';
import * as Label from '@radix-ui/react-label';
import { remoteButtonDefinition, RemoteElementConfiguration, remoteImageDefinition, remoteStackDefinition, remoteTextDefinition, type ComponentLibrary } from '@mcp-ui/client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  Title as ChartTitle,
} from 'chart.js';
import { Bar, Line, Doughnut, Pie, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  ChartTitle,
);
// Shared design tokens
const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const colors = {
  primary: '#6c2bd9',
  primarySoft: '#ede9fe',
  primarySofter: '#f5f3ff',
  primaryStrong: '#7c3aed',
  text: '#0f172a',
  textMuted: '#64748b',
  borderSoft: '#e5d3ff',
  borderSubtle: '#e5e7eb',
  surface: '#ffffff',
  surfaceSoft: '#f9fafb',
};

// Radix UI Text component using Label primitive
const RadixSmallText = React.forwardRef<
  HTMLLabelElement,
  {
    content?: string;
    children?: React.ReactNode;
    htmlFor?: string;
    align?: 'left' | 'center' | 'right';
    [key: string]: any;
  }
>(({ content, children, htmlFor, align = 'left', ...props }, ref) => {
  const getStyles = () => {
    const base: React.CSSProperties = {
      fontFamily,
      display: 'block',
      marginBottom: '4px',
      textAlign: align,
      textRendering: 'geometricPrecision',
       fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.4,
        color: colors.textMuted,
    };
    return base;
  };

  return React.createElement(
    Label.Root,
    {
      ref,
      htmlFor,
      style: getStyles(),
      ...props,
    },
    content || children,
  );
});
RadixSmallText.displayName = 'RadixSmallText';

// Radix UI Text component using Label primitive
const RadixText = React.forwardRef<
  HTMLLabelElement,
  {
    content?: string;
    children?: React.ReactNode;
    htmlFor?: string;
    variant?: 'small' | 'large';
    align?: 'left' | 'center' | 'right';
    [key: string]: any;
  }
>(({ content, children, htmlFor, variant = 'large', align = 'left', ...props }, ref) => {
  const getStyles = () => {
    const base: React.CSSProperties = {
      fontFamily,
      display: 'block',
      marginBottom: '4px',
      textAlign: align,
      textRendering: 'geometricPrecision',
    };

    if (variant === 'small') {
      return {
        ...base,
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: 1.4,
        color: colors.textMuted,
      };
    }

    return {
      ...base,
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.primary,
      textShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    };
  };

  return React.createElement(
    Label.Root,
    {
      ref,
      htmlFor,
      style: getStyles(),
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
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    variant?: 'solid' | 'soft' | 'outline';
    disabled?: boolean;
    [key: string]: any;
  }
>(({ label, onPress, onClick, children, variant = 'solid', disabled = false, ...props }, ref) => {
  console.log('Button input: ', label, variant, props);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    // Do not pass the event object further for remote-dom postMessage
    if (onPress) {
      onPress();
    } else if (onClick) {
      onClick(event);
    }
  };

  const getButtonStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      all: 'unset',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9999,
      padding: '0 18px',
      fontSize: '14px',
      lineHeight: 1,
      fontWeight: 600,
      height: '40px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.18s ease-out',
      borderWidth: 1,
      borderStyle: 'solid',
      outline: 'none',
      fontFamily,
      textTransform: 'none',
      position: 'relative',
      overflow: 'hidden',
      letterSpacing: '0.01em',
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
    };

    if (disabled) {
      return {
        ...base,
        background: colors.surfaceSoft,
        borderColor: colors.borderSubtle,
        color: '#9ca3af',
        boxShadow: 'none',
      };
    }

    switch (variant) {
      case 'soft':
        return {
          ...base,
          background: `linear-gradient(135deg, ${colors.primarySofter}, ${colors.primarySoft})`,
          color: colors.primary,
          borderColor: 'rgba(124, 58, 237, 0.18)',
        };
      case 'outline':
        return {
          ...base,
          background: colors.surface,
          color: colors.primary,
          borderColor: 'rgba(124, 58, 237, 0.5)',
        };
      default: {
        // solid
        return {
          ...base,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryStrong})`,
          color: '#ffffff',
          borderColor: 'transparent',
          boxShadow: '0 10px 30px rgba(124, 58, 237, 0.35)',
        };
      }
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const target = e.currentTarget;
    target.style.transform = 'translateY(-1px)';
    target.style.boxShadow = '0 12px 32px rgba(124, 58, 237, 0.4)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const baseStyles = getButtonStyles();
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = (baseStyles.boxShadow as string) || 'none';
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
      disabled,
      ...props,
    },
    displayText,
  );
});
RadixButton.displayName = 'RadixButton';

// Radix Stack component using CSS Flexbox
const RadixStack = React.forwardRef<
  HTMLDivElement,
  {
    direction?: string;
    spacing?: string;
    children?: React.ReactNode;
    align?: string;
    justify?: string;
    minheight?: string;
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
      minheight,
      ...props
    },
    ref,
  ) => {
    const spacingPx = Number(spacing || '16');
    const isInline = spacingPx <= 8; // small spacing → treat as simple layout, not a card

    const style: React.CSSProperties = {
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: `${spacingPx}px`,
      alignItems: align,
      justifyContent: justify,
      boxSizing: 'border-box',
    };

    if(minheight){
      style.minHeight = `${minheight}px`;
    }

    if (!isInline) {
      Object.assign(style, {
        padding: '16px',
        borderRadius: '18px',
        background: `linear-gradient(135deg, ${colors.surfaceSoft}, ${colors.primarySofter})`,
        border: `1px solid ${colors.borderSoft}`,
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
      });
    }

    return React.createElement(
      'div',
      {
        ref,
        style,
        ...props,
      },
      children,
    );
  },
);
RadixStack.displayName = 'RadixStack';

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
      borderRadius: '18px',
      border: `1px solid ${colors.borderSoft}`,
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
      transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out',
      background: `linear-gradient(135deg, ${colors.surfaceSoft}, ${colors.primarySofter})`,
      padding: '4px',
      display: 'block',
      objectFit: 'cover',
    },
    onMouseEnter: (e: React.MouseEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      target.style.transform = 'scale(1.02) translateY(-2px)';
      target.style.boxShadow = '0 20px 40px rgba(15, 23, 42, 0.18)';
      target.style.borderColor = colors.primarySoft;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLImageElement>) => {
      const target = e.currentTarget;
      target.style.transform = 'scale(1) translateY(0)';
      target.style.boxShadow = '0 12px 32px rgba(15, 23, 42, 0.14)';
      target.style.borderColor = colors.borderSoft;
    },
    ...props,
  });
});
RadixImage.displayName = 'RadixImage';

// Radix Separator component
const RadixSeparator = React.forwardRef<
  HTMLDivElement,
  {
    orientation?: string;
    decorative?: boolean;
    [key: string]: any;
  }
>(({ orientation = 'horizontal', decorative = true, ...props }, ref) => {
  return React.createElement(Separator.Root, {
    ref,
    orientation: orientation as 'horizontal' | 'vertical',
    decorative,
    style: {
      margin: orientation === 'horizontal' ? '16px 0' : '0 16px',
      borderRadius: 9999,
      background:
        orientation === 'horizontal'
          ? 'linear-gradient(90deg, transparent, rgba(148,163,184,0.6), transparent)'
          : 'linear-gradient(180deg, transparent, rgba(148,163,184,0.6), transparent)',
      ...(orientation === 'horizontal'
        ? { height: '1px', width: '100%' }
        : { width: '1px', height: '30px' }),
    },
    ...props,
  });
});
RadixSeparator.displayName = 'RadixSeparator';

// Radix Dialog component
const RadixDialog = React.forwardRef<
  HTMLDivElement,
  {
    trigger?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    [key: string]: any;
  }
>(
  (
    {
      trigger = 'Open Dialog',
      title = 'Dialog Title',
      description,
      children,
      open,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    return React.createElement(
      Dialog.Root,
      { open, onOpenChange },
      React.createElement(
        Dialog.Trigger,
        { asChild: true },
        React.createElement(RadixButton, { variant: 'soft', label: trigger }),
      ),
      React.createElement(
        Dialog.Portal,
        {},
        React.createElement(Dialog.Overlay, {
          style: {
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            position: 'fixed',
            inset: 0,
            backdropFilter: 'blur(4px)',
          },
        }),
        React.createElement(
          Dialog.Content,
          {
            ref,
            style: {
              background: `linear-gradient(135deg, ${colors.surface}, ${colors.surfaceSoft})`,
              borderRadius: '18px',
              border: `1px solid ${colors.borderSoft}`,
              boxShadow:
                '0 24px 60px rgba(15, 23, 42, 0.35), 0 10px 20px rgba(15, 23, 42, 0.16)',
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              maxWidth: '520px',
              maxHeight: '85vh',
              padding: '24px 24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            },
            ...props,
          },
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px',
              },
            },
            React.createElement(
              'div',
              { style: { flex: 1, minWidth: 0 } },
              React.createElement(
                Dialog.Title,
                {
                  style: {
                    margin: 0,
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: 1.3,
                    color: colors.primary,
                    fontFamily,
                  },
                },
                title,
              ),
              description &&
                React.createElement(
                  Dialog.Description,
                  {
                    style: {
                      margin: '6px 0 0',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      color: colors.textMuted,
                      fontFamily,
                    },
                  },
                  description,
                ),
            ),
            React.createElement(
              Dialog.Close,
              { asChild: true },
              React.createElement('button', {
                'aria-label': 'Close',
                children: '×',
                style: {
                  all: 'unset',
                  fontFamily,
                  borderRadius: '9999px',
                  height: '28px',
                  width: '28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.textMuted,
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(148, 163, 184, 0.12)',
                  transition: 'background-color 0.15s ease-out, color 0.15s ease-out',
                },
                onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
                  const t = e.currentTarget;
                  t.style.backgroundColor = 'rgba(148, 163, 184, 0.22)';
                  t.style.color = colors.text;
                },
                onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
                  const t = e.currentTarget;
                  t.style.backgroundColor = 'rgba(148, 163, 184, 0.12)';
                  t.style.color = colors.textMuted;
                },
              }),
            ),
          ),
          React.createElement(
            'div',
            { style: { marginTop: '12px' } },
            children,
          ),
        ),
      ),
    );
  },
);
RadixDialog.displayName = 'RadixDialog';

// Radix TextInput component
const RadixTextInput = React.forwardRef<
  HTMLInputElement,
  {
    value?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    onChange?: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
  }
>((props, ref) => {
  const { value, placeholder, type = 'text', disabled, onChange, ...rest } = props;

  const { children, dangerouslySetInnerHTML, ...safeRest } = rest;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return React.createElement('input', {
    ref,
    type,
    value,
    placeholder,
    disabled,
    onChange: handleChange,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '9px 11px',
      borderRadius: '10px',
      border: `1px solid ${colors.borderSubtle}`,
      outline: 'none',
      fontSize: '14px',
      lineHeight: 1.4,
      fontFamily,
      backgroundColor: colors.surface,
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      color: colors.text,
      transition:
        'border-color 0.16s ease-out, box-shadow 0.16s ease-out, background-color 0.16s ease-out',
    },
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      target.style.borderColor = colors.primarySoft;
      target.style.boxShadow = '0 0 0 1px rgba(124, 58, 237, 0.35)';
      target.style.backgroundColor = colors.surfaceSoft;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      const target = e.currentTarget;
      target.style.borderColor = colors.borderSubtle;
      target.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.04)';
      target.style.backgroundColor = colors.surface;
    },
    ...safeRest,
  });
});
RadixTextInput.displayName = 'RadixTextInput';

// Radix Checkbox component
const RadixCheckbox = React.forwardRef<
  HTMLInputElement,
  {
    checked?: boolean;
    label?: string;
    disabled?: boolean;
    onChange?: (value: boolean | React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
  }
>((props, ref) => {
  const { checked, label, disabled, onChange, ...rest } = props;

  const { children, dangerouslySetInnerHTML, ...safeRest } = rest;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('inside checkbox handle change', e.target.checked);
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return React.createElement(
    'label',
    {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '13px',
        color: colors.text,
        fontWeight: 500,
        fontFamily,
      },
    },
    React.createElement('input', {
      ref,
      type: 'checkbox',
      checked: !!checked,
      disabled,
      onChange: handleChange,
      style: {
        width: '16px',
        height: '16px',
        borderRadius: '6px',
        border: `1px solid ${colors.borderSubtle}`,
        appearance: 'none',
        WebkitAppearance: 'none',
        outline: 'none',
        display: 'inline-block',
        position: 'relative',
        background: checked ? colors.primary : colors.surface,
        boxShadow: checked
          ? '0 2px 6px rgba(124, 58, 237, 0.35)'
          : '0 1px 2px rgba(15, 23, 42, 0.10)',
        transition: 'all 0.15s ease-out',
      },
      onMouseEnter: (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        target.style.boxShadow = '0 3px 8px rgba(124, 58, 237, 0.45)';
      },
      onMouseLeave: (e: React.MouseEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        target.style.boxShadow = checked
          ? '0 2px 6px rgba(124, 58, 237, 0.35)'
          : '0 1px 2px rgba(15, 23, 42, 0.10)';
      },
      ...safeRest,
    }),
    label &&
      React.createElement('span', {
        children: label,
      }),
  );
});
RadixCheckbox.displayName = 'RadixCheckbox';

// Radix Feedback Form component
const RadixFeedbackForm = React.forwardRef<
  HTMLDivElement,
  {
    title?: string;
    description?: string;
    submitlabel?: string;
    onSubmit?: (payload: {
      name: string;
      email: string;
      feedback: string;
      allowContact: boolean;
    }) => void;
    [key: string]: any;
  }
>(({ title, description, submitlabel = 'Submit feedback', onSubmit, ...props }, ref) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [feedback, setFeedback] = React.useState('');
  const [allowContact, setAllowContact] = React.useState(true);

  const handleSubmit = () => {
    if (!feedback.trim()) return;

    if (onSubmit) {
      onSubmit({
        name: name.trim(),
        email: email.trim(),
        feedback: feedback.trim(),
        allowContact,
      });
    }
  };

  return React.createElement(
    'div',
    {
      ref,
      style: {
        width: '100%',
        maxWidth: '520px',
        borderRadius: '20px',
        padding: '20px 20px 18px',
        background: `linear-gradient(135deg, ${colors.surface}, ${colors.surfaceSoft})`,
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
        border: `1px solid ${colors.borderSoft}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxSizing: 'border-box',
      },
      ...props,
    },
    // Header
    React.createElement(
      RadixStack,
      { direction: 'vertical', spacing: '4' },
      React.createElement(RadixText, {
        variant: 'large',
        content: title || 'Share your feedback',
      }),
      React.createElement(RadixText, {
        variant: 'small',
        content:
          description ||
          'Help us improve by telling us what worked well and what could be better.',
      }),
    ),

    // Name
    React.createElement(
      RadixStack,
      { direction: 'vertical', spacing: '4' },
      React.createElement(RadixText, {
        variant: 'small',
        content: 'Name (optional)',
      }),
      React.createElement(RadixTextInput, {
        value: name,
        placeholder: 'Your name',
        onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => {
          const v = typeof event === 'string' ? event : event.target.value;
          setName(v);
        },
      }),
    ),

    // Email
    React.createElement(
      RadixStack,
      { direction: 'vertical', spacing: '4' },
      React.createElement(RadixText, {
        variant: 'small',
        content: 'Email (optional)',
      }),
      React.createElement(RadixTextInput, {
        value: email,
        placeholder: 'you@example.com',
        type: 'email',
        onChange: (event: React.ChangeEvent<HTMLInputElement> | string) => {
          const v = typeof event === 'string' ? event : event.target.value;
          setEmail(v);
        },
      }),
    ),

    // Feedback textarea
    React.createElement(
      RadixStack,
      { direction: 'vertical', spacing: '4' },
      React.createElement(RadixText, {
        variant: 'small',
        content: 'Your feedback',
      }),
      React.createElement('textarea', {
        value: feedback,
        placeholder:
          'Tell us what you liked, what was confusing, or what can be improved...',
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value),
        style: {
          width: '100%',
          minHeight: '120px',
          resize: 'vertical',
          boxSizing: 'border-box',
          padding: '10px 11px',
          borderRadius: '12px',
          border: `1px solid ${colors.borderSubtle}`,
          outline: 'none',
          fontSize: '14px',
          lineHeight: 1.5,
          fontFamily,
          backgroundColor: colors.surface,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
          color: colors.text,
        },
      }),
    ),

    // Checkbox
    React.createElement(RadixCheckbox, {
      checked: allowContact,
      label: 'Okay to contact me about this feedback',
      onChange: (event: React.ChangeEvent<HTMLInputElement> | boolean) => {
        const v = typeof event === 'boolean' ? event : event.target.checked;
        setAllowContact(v);
      },
    }),

    // Submit button
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '4px' } },
      React.createElement(RadixButton, {
        label: submitlabel,
        variant: 'solid',
        onPress: handleSubmit,
        disabled: !feedback.trim(),
      }),
    ),
  );
});
RadixFeedbackForm.displayName = 'RadixFeedbackForm';


const RadixChecklistForm = React.forwardRef<
  HTMLDivElement,
  {
    title?: string;
    description?: string;
    items?: string; // JSON string or comma-separated list
    submitlabel?: string;
    onSubmit?: (payload: {
      items: { label: string; checked: boolean }[];
    }) => void;
    [key: string]: any;
  }
>(({ title, description, items, submitlabel = 'Save selection', onSubmit, ...props }, ref) => {
  console.log('inside checklist form');
  const labels = React.useMemo(() => {
    if (!items) return [] as string[];

    try {
      const parsed = JSON.parse(items);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v));
      }
    } catch {
      // ignore and fall back to CSV
    }

    return String(items)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [items]);

  const [checked, setChecked] = React.useState<boolean[]>(() =>
    labels.map(() => false),
  );

  React.useEffect(() => {
    setChecked(labels.map(() => false));
  }, [labels]);

  const handleToggle = (index: number, value: boolean | React.ChangeEvent<HTMLInputElement>) => {
    const isChecked =
      typeof value === 'boolean' ? value : value.target.checked;

    setChecked((prev) => {
      const next = [...prev];
      next[index] = isChecked;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!onSubmit) return;

    const payload = {
      items: labels.map((label, idx) => ({
        label,
        checked: !!checked[idx],
      })),
    };

    onSubmit(payload);
  };

  return React.createElement(
    'div',
    {
      ref,
      style: {
        width: '100%',
        maxWidth: '520px',
        borderRadius: '20px',
        padding: '20px 20px 18px',
        background: `linear-gradient(135deg, ${colors.surface}, ${colors.surfaceSoft})`,
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
        border: `1px solid ${colors.borderSoft}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxSizing: 'border-box',
      },
      ...props,
    },
    // Header
    React.createElement(
      RadixStack,
      { direction: 'vertical', spacing: '4' },
      React.createElement(RadixText, {
        variant: 'large',
        content: title || 'Select applicable options',
      }),
      React.createElement(RadixText, {
        variant: 'small',
        content:
          description ||
          'Tick all the statements that are true for you or apply to this situation.',
      }),
    ),

    // Checklist items
    React.createElement(
      RadixStack,
      { direction: 'vertical', spacing: '8' },
      ...labels.map((label, index) =>
        React.createElement(RadixCheckbox, {
          key: index,
          checked: checked[index],
          label,
          onChange: (value: boolean | React.ChangeEvent<HTMLInputElement>) =>
            handleToggle(index, value),
        }),
      ),
    ),

    // Submit button
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '4px' } },
      React.createElement(RadixButton, {
        label: submitlabel,
        variant: 'solid',
        onPress: handleSubmit,
      }),
    ),
  );
});
RadixChecklistForm.displayName = 'RadixChecklistForm';


// Chart.js chart component for Remote DOM
const RadixChart = React.forwardRef<
  HTMLDivElement,
  {
    title?: string;
    labels?: string;   // JSON string or comma-separated
    values?: string;   // JSON string or comma-separated numbers
    showlegend?: string | boolean;
    charttype?: string; // "bar" | "line" | "pie" | "doughnut" | "radar"
    [key: string]: any;
  }
>(({ title = 'Chart', labels, values, showlegend = 'false', charttype = 'bar', ...props }, ref) => {
  console.log('Chart input: ', title, showlegend, charttype, props);
  // Parse labels
  const parsedLabels: string[] = React.useMemo(() => {
    if (!labels) return [];

    try {
      const parsed = JSON.parse(labels);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // fallback: CSV
    }

    return String(labels)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [labels]);

  // Parse values
  const parsedValues: number[] = React.useMemo(() => {
    if (!values) return [];

    try {
      const parsed = JSON.parse(values);
      if (Array.isArray(parsed)) return parsed.map((v) => Number(v) || 0);
    } catch {
      // fallback: CSV
    }

    return String(values)
      .split(',')
      .map((s) => Number(s.trim()) || 0);
  }, [values]);

  const normalizedType = (charttype || 'bar').toLowerCase();
  const legendVisible =
    typeof showlegend === 'boolean'
      ? showlegend
      : String(showlegend).toLowerCase() === 'true';

  const data = React.useMemo(
    () => ({
      labels: parsedLabels,
      datasets: [
        {
          label: title,
          data: parsedValues,
          borderRadius: normalizedType === 'bar' ? 12 : 0,
          borderSkipped: false,
          backgroundColor:
            normalizedType === 'pie' || normalizedType === 'doughnut'
              ? [
                  'rgba(124, 58, 237, 0.85)',
                  'rgba(59, 130, 246, 0.85)',
                  'rgba(34, 197, 94, 0.85)',
                  'rgba(249, 115, 22, 0.85)',
                  'rgba(244, 63, 94, 0.85)',
                  'rgba(14, 165, 233, 0.85)',
                ]
              : 'rgba(124, 58, 237, 0.85)',
          borderColor:
            normalizedType === 'line' || normalizedType === 'radar'
              ? 'rgba(129, 140, 248, 1)'
              : undefined,
          pointBackgroundColor:
            normalizedType === 'line' || normalizedType === 'radar'
              ? 'rgba(129, 140, 248, 1)'
              : undefined,
          fill: normalizedType === 'line' || normalizedType === 'radar',
          maxBarThickness: 40,
        },
      ],
    }),
    [parsedLabels, parsedValues, title, normalizedType],
  );

  const options = React.useMemo(() => {
    const base = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: legendVisible,
          labels: {
            color: colors.textMuted,
            font: { family: fontFamily, size: 11 },
          },
        },
        title: { display: false },
        tooltip: {
          backgroundColor: '#020617',
          borderColor: 'rgba(148,163,184,0.6)',
          borderWidth: 1,
          titleFont: { family: fontFamily, size: 12 },
          bodyFont: { family: fontFamily, size: 11 },
        },
      },
    } as any;

    if (normalizedType === 'bar' || normalizedType === 'line') {
      base.scales = {
        x: {
          grid: { display: false },
          ticks: {
            color: colors.textMuted,
            font: { family: fontFamily, size: 11 },
          },
        },
        y: {
          grid: { color: 'rgba(148,163,184,0.25)' },
          ticks: {
            color: colors.textMuted,
            font: { family: fontFamily, size: 11 },
            precision: 0,
          },
        },
      };
    }

    if (normalizedType === 'radar') {
      base.scales = {
        r: {
          angleLines: { color: 'rgba(148,163,184,0.35)' },
          grid: { color: 'rgba(148,163,184,0.25)' },
          pointLabels: {
            color: colors.textMuted,
            font: { family: fontFamily, size: 11 },
          },
          ticks: {
            color: colors.textMuted,
            font: { family: fontFamily, size: 10 },
            backdropColor: 'transparent',
          },
        },
      };
    }

    // pie/doughnut use default radial options

    return base;
  }, [legendVisible, normalizedType]);

  let ChartComponent: React.ComponentType<any> = Bar;
  if (normalizedType === 'line') ChartComponent = Line;
  else if (normalizedType === 'pie') ChartComponent = Pie;
  else if (normalizedType === 'doughnut') ChartComponent = Doughnut;
  else if (normalizedType === 'radar') ChartComponent = Radar;

  return React.createElement(
    'div',
    {
      ref,
      style: {
        width: '100%',
        maxWidth: '520px',
        borderRadius: '20px',
        padding: '18px 18px 16px',
        background: `linear-gradient(135deg, ${colors.surface}, ${colors.surfaceSoft})`,
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.18)',
        border: `1px solid ${colors.borderSoft}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      },
      ...props,
    },
    React.createElement('div', {
      style: {
        fontFamily,
        fontSize: '14px',
        fontWeight: 600,
        color: colors.text,
      },
      children: title,
    }),
    React.createElement('div', {
      style: {
        marginTop: 4,
        borderRadius: 14,
        padding: '10px 10px 8px',
        background: `radial-gradient(circle at top, ${colors.surfaceSoft}, ${colors.surface})`,
        border: `1px solid ${colors.borderSubtle}`,
        height: 240,
      },
      children: React.createElement(ChartComponent, {
        data,
        options,
      }),
    }),
  );
});
RadixChart.displayName = 'RadixChart';

// Radix Badge / Pill component
const RadixBadge = React.forwardRef<
  HTMLSpanElement,
  {
    label?: string;
    tone?: 'success' | 'warning' | 'info';
    [key: string]: any;
  }
>(({ label, tone = 'info', ...props }, ref) => {
  let bg = 'rgba(59,130,246,0.14)';
  let border = 'rgba(59,130,246,0.4)';
  let color = '#1d4ed8';

  if (tone === 'success') {
    bg = 'rgba(22,163,74,0.10)';
    border = 'rgba(22,163,74,0.45)';
    color = '#15803d';
  } else if (tone === 'warning') {
    bg = 'rgba(245,158,11,0.10)';
    border = 'rgba(245,158,11,0.45)';
    color = '#b45309';
  }

  return React.createElement('span', {
    ref,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      padding: '3px 10px',
      fontFamily,
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      backgroundColor: bg,
      border: `1px solid ${border}`,
      color,
      whiteSpace: 'nowrap',
    },
    ...props,
    children: label || props.children || 'Badge',
  });
});
RadixBadge.displayName = 'RadixBadge';


const RadixNumberInput = React.forwardRef<
  HTMLInputElement,
  {
    value?: string;
    placeholder?: string;
    maxLength?: number | string;
    disabled?: boolean;
    allowdecimal?: boolean | string; // "true" / "false" or boolean
    format?: 'plain' | 'card' | 'currency'; // NEW
    currencysymbol?: string; // NEW, default "₹"
    onChange?: (value: string) => void; // we always emit raw string
    [key: string]: any;
  }
>((props, ref) => {
  const {
    value,
    placeholder,
    maxLength,
    disabled,
    allowdecimal,
    format = 'plain',
    currencysymbol = '₹',
    onChange,
    ...rest
  } = props;

  // Backing "raw" numeric value (no spaces/commas, may include one dot)
  const [rawValue, setRawValue] = React.useState<string>(value ?? '');

  // Sync external value if provided
  React.useEffect(() => {
    if (typeof value === 'string') {
      setRawValue(value);
    }
  }, [value]);

  // Strip props that must not go on <input>
  const {
    children: _omitChildren,
    dangerouslySetInnerHTML: _omitHtml,
    value: _omitValue,
    ...safeRest
  } = rest;

  const parsedMaxLength =
    typeof maxLength === 'number'
      ? maxLength
      : maxLength != null
      ? Number(maxLength)
      : undefined;

  // Decide decimal behaviour:
  // - currency → decimals allowed by default
  // - card → decimals NOT allowed
  // - plain → controlled by allowDecimal
  const decimalAllowedExplicit =
    allowdecimal === true || allowdecimal === 'true';
  const decimalAllowed =
    format === 'currency'
      ? allowdecimal === 'false' || allowdecimal === false
        ? false
        : true
      : format === 'card'
      ? false
      : decimalAllowedExplicit;

  const sanitizeToRaw = (input: string): string => {
    let next = input;

    if (decimalAllowed) {
      // Remove everything except digits and dot
      next = next.replace(/[^\d.]/g, '');
      // Only first dot
      const firstDotIndex = next.indexOf('.');
      if (firstDotIndex !== -1) {
        // Keep first dot, remove all others
        next =
          next.slice(0, firstDotIndex + 1) +
          next.slice(firstDotIndex + 1).replace(/\./g, '');
      }
      // Leading dot -> 0.x
      if (next.startsWith('.')) {
        next = '0' + next;
      }
    } else {
      // Digits only
      next = next.replace(/\D+/g, '');
    }

    if (
      typeof parsedMaxLength === 'number' &&
      Number.isFinite(parsedMaxLength) &&
      parsedMaxLength > 0 &&
      next.length > parsedMaxLength
    ) {
      next = next.slice(0, parsedMaxLength);
    }

    return next;
  };

  const formatDisplay = (raw: string): string => {
    if (!raw) return '';

    if (format === 'card') {
      // group as "1234 5678 9012 3456"
      const digitsOnly = raw.replace(/\D+/g, '');
      return digitsOnly.replace(/(.{4})/g, '$1 ').trim();
    }

    if (format === 'currency') {
      const num = Number(raw);
      if (!isFinite(num)) return raw;
      try {
        const formatted = new Intl.NumberFormat('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(num);
        return `${currencysymbol} ${formatted}`;
      } catch {
        return raw;
      }
    }

    return raw; // plain
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // User-typed string, including spaces/commas/symbols from previous formatting
    let input = e.target.value;

    // Remove currency symbol and spacing for parsing
    if (format === 'currency' && currencysymbol) {
      const sym = currencysymbol.trim();
      if (sym && input.startsWith(sym)) {
        input = input.slice(sym.length);
      }
    }
    // Strip spaces and commas; sanitizeToRaw will handle digits/dot
    input = input.replace(/[\s,]/g, '');

    const nextRaw = sanitizeToRaw(input);
    const nextDisplay = formatDisplay(nextRaw);

    setRawValue(nextRaw);
    e.target.value = nextDisplay;

    if (onChange) {
      // IMPORTANT: emit raw string (no spaces/commas/symbols)
      onChange(nextRaw);
    }
  };

  const displayValue = formatDisplay(rawValue);

  return React.createElement('input', {
    ref,
    type: 'text',
    inputMode: decimalAllowed ? 'decimal' : 'numeric',
    pattern: decimalAllowed ? '[0-9.]*' : '\\d*',
    value: displayValue,
    placeholder,
    disabled,
    maxLength: parsedMaxLength,
    onChange: handleChange,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '9px 11px',
      borderRadius: '10px',
      border: `1px solid ${colors.borderSubtle}`,
      outline: 'none',
      fontSize: '14px',
      lineHeight: 1.4,
      fontFamily,
      backgroundColor: colors.surface,
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
      color: colors.text,
      transition:
        'border-color 0.16s ease-out, box-shadow 0.16s ease-out, background-color 0.16s ease-out',
    },
    ...safeRest,
  });
});
RadixNumberInput.displayName = 'RadixNumberInput';

const RadixFormMessage = React.forwardRef<
  HTMLDivElement,
  {
    text?: string;
    variant?: 'info' | 'error' | 'success';
    [key: string]: any;
  }
>(({ text, variant = 'info', ...rest }, ref) => {
  let bg = 'rgba(51,65,85,0.55)';
  let border = 'rgba(148,163,184,0.7)';
  let color = '#e5e7eb';

  if (variant === 'error') {
    bg = 'rgba(127,29,29,0.18)';
    border = 'rgba(248,113,113,0.85)';
    color = '#fecaca';
  } else if (variant === 'success') {
    bg = 'rgba(22,163,74,0.16)';
    border = 'rgba(74,222,128,0.85)';
    color = '#bbf7d0';
  }

  const {
    children: _omitChildren,
    dangerouslySetInnerHTML: _omitHtml,
    ...safeRest
  } = rest;

  return React.createElement('div', {
    ref,
    style: {
      marginTop: 8,
      borderRadius: 10,
      padding: '8px 10px',
      fontSize: 12,
      lineHeight: 1.5,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      color,
      fontFamily,
    },
    ...safeRest,
    children: text,
  });
});
RadixFormMessage.displayName = 'RadixFormMessage';

export const radixComponentLibrary: ComponentLibrary = {
  name: 'radix',
  elements: [
    {
      tagName: 'ui-text',
      component: RadixText,
      propMapping: {
        content: 'content',
        htmlFor: 'htmlFor',
        variant: 'variant',
        align: 'align',
      },
      eventMapping: {},
    },
    {
      tagName: 'ui-text-small',
      component: RadixSmallText,
      propMapping: {
        content: 'content',
        htmlFor: 'htmlFor',
        align: 'align',
      },
      eventMapping: {},
    },
    {
      tagName: 'ui-button',
      component: RadixButton,
      propMapping: {
        label: 'label',
        variant: 'variant',
        disabled: 'disabled',
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
        minheight: 'minheight'
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
      tagName: 'ui-separator',
      component: RadixSeparator,
      propMapping: {
        orientation: 'orientation',
        decorative: 'decorative',
      },
      eventMapping: {},
    },
    {
      tagName: 'ui-dialog',
      component: RadixDialog,
      propMapping: {
        trigger: 'trigger',
        title: 'title',
        description: 'description',
        open: 'open',
      },
      eventMapping: {
        openChange: 'onOpenChange',
      },
    },
    {
      tagName: 'ui-text-input',
      component: RadixTextInput,
      propMapping: {
        value: 'value',
        placeholder: 'placeholder',
        type: 'type',
        disabled: 'disabled',
      },
      eventMapping: {
        change: 'onChange',
      },
    },
    {
      tagName: 'ui-checkbox',
      component: RadixCheckbox,
      propMapping: {
        checked: 'checked',
        label: 'label',
        disabled: 'disabled',
      },
      eventMapping: {
        change: 'onChange',
      },
    },
    {
      tagName: 'ui-feedback-form',
      component: RadixFeedbackForm,
      propMapping: {
        title: 'title',
        description: 'description',
        submitlabel: 'submitlabel',
      },
      eventMapping: {
        submit: 'onSubmit',
      },
    },
    {
      tagName: 'ui-checklist-form',
      component: RadixChecklistForm,
      propMapping: {
        title: 'title',
        description: 'description',
        items: 'items',
        submitlabel: 'submitlabel',
      },
      eventMapping: {
        submit: 'onSubmit',
      },
    },
    {
      tagName: 'ui-chart',
      component: RadixChart,
      propMapping: {
        title: 'title',
        labels: 'labels',
        values: 'values',
        showlegend: 'showlegend',
        charttype: 'charttype',
      },
      eventMapping: {},
    },
    {
      tagName: 'ui-badge',
      component: RadixBadge,
      propMapping: {
        label: 'label',
        tone: 'tone',
      },
      eventMapping: {},
    },
    {
      tagName: 'ui-number-input',
      component: RadixNumberInput,
      propMapping: {
        value: 'value',
        placeholder: 'placeholder',
        maxlength: 'maxlength',
        disabled: 'disabled',
        allowdecimal: 'allowdecimal',
        format: 'format',             
        currencysymbol: 'currencysymbol'
      },
      eventMapping: {
        change: 'onChange',
      },
    },
    {
      tagName: 'ui-form-message',
      component: RadixFormMessage,
      propMapping: {
        text: 'text',
        variant: 'variant',
      },
      eventMapping: {},
    },

  ],
};


// remote element definitions
export const remoteFeedbackFormDefinition: RemoteElementConfiguration = {
  tagName: 'ui-feedback-form',
  // Attributes that Remote DOM is allowed to set via setAttribute(...)
  remoteAttributes: ['title', 'description', 'submitlabel'],
  // Events that Remote DOM can listen to via addEventListener(...)
  remoteEvents: ['submit'],
};

export const remoteChecklistFormDefinition: RemoteElementConfiguration = {
  tagName: 'ui-checklist-form',
  remoteAttributes: ['title', 'description', 'items', 'submitlabel'],
  remoteEvents: ['submit'],
};

export const remoteCheckboxDefinition: RemoteElementConfiguration = {
  tagName: 'ui-checkbox',
  remoteAttributes: [ 'checked', 'label', 'disabled'],
  remoteEvents: ['change'],
};

export const remoteSmallTextDefinition: RemoteElementConfiguration = {
  tagName: 'ui-text-small',
  remoteAttributes: [ 'content', 'htmlFor', 'align'],
  remoteEvents: [],
};

export const remoteTextInputDefinition: RemoteElementConfiguration = {
  tagName: 'ui-text-input',
  remoteAttributes: [ 'value', 'placeholder', 'type', 'disabled'],
  remoteEvents: ['change'],
};

export const remoteChartDefinition: RemoteElementConfiguration = {
  tagName: 'ui-chart',
  remoteAttributes: ['title', 'labels', 'values', 'showlegend', 'charttype'],
  remoteEvents: [],
};

export const remoteBadgeDefinition: RemoteElementConfiguration = {
  tagName: 'ui-badge',
  remoteAttributes: ['label', 'tone'],
  remoteEvents: [],
};

export const remoteCustomButtonDefinition: RemoteElementConfiguration = {
  tagName: 'ui-button',
  remoteAttributes: ['label', 'variant', 'disabled'],
  remoteEvents: ['press'],
};

export const remoteCustomStackDefinition: RemoteElementConfiguration = {
  tagName: 'ui-stack',
  remoteAttributes: ['direction', 'spacing', 'align', 'justify', 'minheight'],
  remoteEvents: ['']
};

export const remoteNumberInputDefinition: RemoteElementConfiguration = {
  tagName: 'ui-number-input',
  remoteAttributes: ['value', 'placeholder', 'maxlength', 'disabled', 'allowdecimal', 'format', 'currencysymbol'],
  remoteEvents: ['change'],
};

export const remoteFormMessageDefinition: RemoteElementConfiguration = {
  tagName: 'ui-form-message',
  remoteAttributes: ['text', 'variant'],
  remoteEvents: [],
};

export  const remoteElements = [
  remoteChartDefinition,
  remoteSmallTextDefinition,
  remoteTextDefinition,
  remoteTextInputDefinition,
  remoteCustomButtonDefinition,
  remoteCustomStackDefinition,
  remoteImageDefinition,
  remoteFeedbackFormDefinition,
  remoteChecklistFormDefinition,
  remoteCheckboxDefinition,
  remoteBadgeDefinition,
  remoteNumberInputDefinition,
  remoteFormMessageDefinition
];
