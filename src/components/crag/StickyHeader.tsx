import { useRef } from 'react'
import { useIntersection } from 'react-use'
import clx from 'classnames'

import { GluttenFreeCrumbs } from '../ui/BreadCrumbs'

interface StickyBreadCrumbsProps {
  isClimbPage?: boolean
  ancestors: string[]
  pathTokens: string[]
  /** Additional form action to be display along side with the breadcrumbs */
  formAction: JSX.Element
}

/**
 * Sticky header containing breadcrumbs and save/reset button in edit mode.
 *
 * More on intersecton observer: https://css-tricks.com/an-explanation-of-how-the-intersection-observer-watches/ for
 */
export const StickyHeader = ({ isClimbPage = false, ancestors, pathTokens, formAction }: StickyBreadCrumbsProps): JSX.Element => {
  const intersectionRef = useRef(null)

  /**
   * Creating an intersection hook to be notified when div reaches become 'sticky'
   * aka reaches the top.
   */
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px 0px -100% 0px'
  })
  const atTop = intersection?.isIntersecting ?? false

  return (
    <div ref={intersectionRef} className={clx('sticky top-0 z-40 py-2 lg:min-h-[4rem] block lg:flex lg:items-center lg:justify-between bg-base-100', atTop ? 'border-b bottom-shadow backdrop-blur-sm bg-opacity-90' : '')}>
      <GluttenFreeCrumbs ancestors={ancestors} pathTokens={pathTokens} />
      <div className='hidden lg:block'>
        {/* only visible at lg or wider */}
        {formAction}
      </div>
    </div>
  )
}

export const Skeleton: React.FC = () => (
  <div className='top-0 z-40 py-2 lg:min-h-[4rem] block lg:flex lg:items-center lg:justify-between'>
    <div className='bg-base-200/10 h-6 w-60 lg:w-[800px] rounded-box' />
  </div>)
