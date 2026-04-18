import type { ReactNode } from 'react'

type GradientButtonProps = {
  children: ReactNode
  onClick?: () => void
  ariaLabel?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const GradientButton = ({
  children,
  onClick,
  ariaLabel,
  className,
  disabled,
  type = 'button',
}: GradientButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={[
        'from-primary to-primary-container shadow-primary/40 w-full rounded-[1.5rem] bg-linear-to-br py-5 text-lg font-bold text-white shadow-2xl transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default GradientButton
