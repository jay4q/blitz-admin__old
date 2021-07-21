import classNames from 'classnames'
import { FunctionComponent, SVGAttributes } from 'react'
import { RiFlashlightFill } from 'react-icons/ri'

type Props = SVGAttributes<SVGElement>

export const Logo: FunctionComponent<Props> = ({ className, ...restProps }) =>
  <RiFlashlightFill className={classNames('text-2xl text-[#fadb14]', className)} {...restProps} />