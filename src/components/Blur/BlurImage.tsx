import classNames from 'classnames'
import { memo } from 'react'
import { BlurCanvas } from './BlurCanvas'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  hash: string
  punch?: number

  /**
   * 画布宽度
   * @description 建议不要超过128，默认32
   */
  resolutionWidth?: number

  /**
   * 画布搞
   * @description 建议不要超过128，默认32
   */
  resolutionHeight?: number
}

export const BlurImage = memo<Props>(({
  hash,
  punch,
  className,
  resolutionWidth = 32,
  resolutionHeight = 32,
  ...restProps
}) => {
  return (
    <div {...restProps} className={classNames('relative overflow-hidden', className)}>
      <BlurCanvas
        hash={hash}
        punch={punch}
        width={resolutionWidth}
        height={resolutionHeight}
        className='absolute inset-0 w-full h-full'
      />
    </div>
  )
})