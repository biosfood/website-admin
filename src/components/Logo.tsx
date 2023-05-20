const stroke = '#FFF'
const strokeWidth = 16

export default function Logo() {
  return (
    <svg viewBox={`${-strokeWidth/2} ${-strokeWidth/2} ${200+strokeWidth} ${200+strokeWidth/2}`}
        width={200+strokeWidth} height={200+strokeWidth} style={{maxWidth: '2em'}}>
      <path style={{strokeWidth,strokeLinejoin: 'round', stroke, fill: '#0000'}} d="M 50 0 H 200 V 100 H 50 A 50 50 0 0 1 0 50 V 50 A 50 50 0 0 1 50 0 Z" data-bx-shape="rect 0 0 200 100 50 0 0 50 1@30237fab"></path>
      <path style={{strokeWidth,strokeLinejoin: 'round', stroke, fill: '#444'}} d="M 50 100 H 200 V 150 A 50 50 0 0 1 150 200 H 50 A 50 50 0 0 1 0 150 V 150 A 50 50 0 0 1 50 100 Z" data-bx-shape="rect 0 100 200 100 50 0 50 50 1@35ee210e"></path>
      <path style={{fill: '#0072F5', strokeWidth, stroke, strokeLinejoin: 'round'}} d="M 100 0 H 200 V 150 H 150 A 50 50 0 0 1 100 100 V 0 Z" data-bx-shape="rect 100 0 100 150 0 0 0 50 1@503bb962"></path>
    </svg>
  )
}
