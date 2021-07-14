import { createRef, PureComponent, RefObject } from 'react'
import { decode } from 'blurhash'
import classNames from 'classnames'

type Props = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
  hash: string
  punch?: number
  width?: number
  height?: number
}

export class BlurCanvas extends PureComponent<Props> {
  static defaultProps = {
    height: 32,
    width: 32,
  }

  canvasRef: RefObject<HTMLCanvasElement>

  constructor(props: Props) {
    super(props)
    this.canvasRef = createRef<HTMLCanvasElement>()
  }

  draw = () => {
    const { hash, height, punch, width } = this.props

    if (this.canvasRef.current) {
      const pixels = decode(hash, width!, height!, punch)
      const ctx = this.canvasRef.current.getContext('2d')

      if (ctx) {
        const imageData = ctx.createImageData(width!, height!)
        imageData.data.set(pixels)
        ctx.putImageData(imageData, 0, 0)
      }
    }
  }

  render() {
    const { hash, height, width, className, ...restProps } = this.props

    return (
      <canvas
        ref={this.canvasRef}
        {...restProps}
        width={width}
        height={height}
        className={classNames('block', className)}
      />
    )
  }

  componentDidMount() {
    this.draw()
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.hash !== this.props.hash) {
      this.draw() 
    }
  }
}