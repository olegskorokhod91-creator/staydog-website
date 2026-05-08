import { ArrowRight, CalendarCheck, ExternalLink } from 'lucide-react'

const iconMap = {
  arrow: ArrowRight,
  calendar: CalendarCheck,
  external: ExternalLink,
}

export default function CtaButton({
  children,
  href,
  onClick,
  variant = 'primary',
  icon = 'arrow',
  className = '',
  ...props
}) {
  const Icon = iconMap[icon] || ArrowRight
  const classes = `cta-button cta-button--${variant} ${className}`.trim()

  if (href) {
    return (
      <a className={classes} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" {...props}>
        <span>{children}</span>
        <Icon aria-hidden="true" size={18} />
      </a>
    )
  }

  return (
    <button className={classes} type="button" onClick={onClick} {...props}>
      <span>{children}</span>
      <Icon aria-hidden="true" size={18} />
    </button>
  )
}
