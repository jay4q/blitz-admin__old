import { useBoolean } from 'ahooks'
import classNames from 'classnames'
import { useNativeLazyLoading } from 'hooks/use-native-lazy-loading'
import mediumZoom from 'medium-zoom'
import { ImgHTMLAttributes, memo, useCallback, useRef, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import qs from 'query-string'
import { BlurImage } from './Blur'

const ZOOM = mediumZoom()

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  hash?: string

  /**
   * 图片主色，用于占位
   */
  color?: string

  /**
   * 是否支持缩放
   */
  zoomable?: boolean

  /**
   * 图片宽高比
   */
  ratio?: number
}

/**
 * 高度优化的图片展示组件
 * @description 支持 模糊占位、主色占位、占位
 */
export const Image = memo<Props>(({
  onLoad,
  onClick,
  className,
  hash: _hash,
  color: _color,
  ratio: _ratio,
  zoomable = true,
  ...restProps
}) => {
  const zoomRef = useRef(ZOOM.clone({ background: 'white' }))

  const supportsLazyLoading = useNativeLazyLoading()
  const { ref, inView } = useInView({
    triggerOnce: true,
    skip: supportsLazyLoading !== false,
  })

  const [isLoaded, { setTrue: setImageLoaded }] = useBoolean(false)
  const [delayLoaded, { setTrue: setDelayLoaded }] = useBoolean(false)

  const { hash, color, ratio } = useMemo(() => {
    try {
      if (!restProps.src) throw new Error()

      // 解析链接中的参数
      const arr = restProps.src.split('?')
      if (arr.length !== 2) throw new Error()

      // const search_result = /(?<=\?).{1,}/.exec(restProps.src)
      // if (!search_result) throw new Error()
      // const search = qs.parse(search_result[0])

      const search = qs.parse(arr[1])
      return {
        hash: search['hash'] as string || _hash,
        color: search['color'] as string || _color,
        ratio: (Number(search['width']) / Number(search['height'])) || _ratio
      }
    } catch (err) {
      return {
        hash: _hash,
        color: _color,
        ratio: _ratio,
      }
    }
  }, [_hash, _color, _ratio, restProps.src])

  /**
   * 兼容图片缩放模式
   */
  const attachZoom = useCallback((ref) => {
    if (zoomable) {
      zoomRef.current.attach(ref)
    } else {
      zoomRef.current.detach(ref)
    }
  }, [zoomable])

  /**
   * 图片加载回调
   */
  const onImageLoad = useCallback((e: any) => {
    setImageLoaded()

    if (onLoad) {
      onLoad(e)
    }

    if (hash) {
      // 如果有模糊图，加载完毕后延迟从视图中移除
      setTimeout(() => {
        setDelayLoaded()
      }, 500)
    }
  }, [hash, onLoad, setImageLoaded, setDelayLoaded])

  /**
   * 图片点击事件
   */
  const onImageClick = useCallback((e: any) => {
    if (!zoomable && onClick) {
      onClick(e)
    }
  }, [zoomable, onClick])

  return (
    <div ref={ref} className={classNames('relative overflow-hidden', className)} onClick={onImageClick}>
      {
        ratio && (
          <div className='w-full' style={{ paddingBottom: (1 / ratio) * 100 + '%' }}></div>
        )
      }
      {
        (inView || supportsLazyLoading) && (
          <img
            alt='img'
            {...restProps}
            ref={attachZoom}
            loading='lazy'
            className='absolute inset-0 w-full h-full object-cover object-center m-0'
            onLoad={onImageLoad}
          />
        )
      }
      {
        !hash && color && (
          <div style={{ background: color }} className={classNames('absolute inset-0 w-full h-full transition-opacity duration-500', isLoaded ? 'opacity-0' : 'opacity-100')}></div>
        )
      }
      {
        hash && !delayLoaded && (
          <BlurImage
            hash={hash}
            className={classNames('!absolute inset-0 w-full h-full transition-opacity duration-500', isLoaded ? 'opacity-0' : 'opacity-100')}
          />
        )
      }
    </div>
  )
})