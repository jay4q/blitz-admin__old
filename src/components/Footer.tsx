import classNames from 'classnames'
import { FunctionComponent } from 'react'

type Props = {
  className?: string
}

export const Footer: FunctionComponent<Props> = ({ className }) => {
  return (
    <footer className={classNames('h-12 flex items-center justify-center mt-4', className)}>
      <p className='text-sm text-gray-400 m-0 flex items-center'>
        该服务由
        <a href='https://www.jay4q.com' target='__blank' className='text-gray-400 hover:text-black'>&ensp;jay4q&ensp;</a>
        开源出品&ensp;@{new Date().getFullYear()}
      </p>
    </footer>
  )
}