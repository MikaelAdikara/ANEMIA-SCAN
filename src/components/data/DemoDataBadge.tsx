import { FlaskConical } from 'lucide-react'
import { DEMO_DATA_LABEL } from '../../data/demoScreenings'

export function DemoDataBadge() {
  return (
    <span className="badge badge-demo" style={{ gap: 4 }}>
      <FlaskConical size={10} />
      {DEMO_DATA_LABEL}
    </span>
  )
}
