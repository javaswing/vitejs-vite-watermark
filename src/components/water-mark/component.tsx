import { useEffect, useMemo, useRef } from 'react';
import { watermarkDefaultProps } from './defaultProps';
import { WaterMarkProps } from './type';

const WaterMark = (props: WaterMarkProps) => {
  const {
    x = 220,
    y = 210,
    width = 120,
    height = 60,
    alpha = watermarkDefaultProps.alpha,
    rotate = watermarkDefaultProps.rotate,
    className,
    style = {},
    children,
    content = '',
  } = props;

  const cavasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. 创建canvas 对象
    if (!cavasRef.current) {
      // cavasRef.current = document.createElement('canvas');
    }
  }, []);

  const ctx = useMemo(() => {
    return cavasRef.current?.getContext('2d');
  }, []);

  // 获取设备像素比
  const ratio = window.devicePixelRatio | 1;

  const canvasWidth = width * ratio;
  const canvasHeight = height * ratio;

  useEffect(() => {
    if (cavasRef.current) {
      cavasRef.current.width = width;
      cavasRef.current.height = height;
      cavasRef.current.setAttribute('width', `${canvasWidth}px`);
      cavasRef.current.setAttribute('height', `${canvasHeight}px`);
    }
  }, []);

  useEffect(() => {
    if (ctx) {
      // 画字
      ctx.font = `normal normal normal 16px undefined`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillText(content, 0, 0, canvasWidth);
    }
  }, []);

  return (
    <div className={className} style={style}>
      <canvas ref={cavasRef} />
      {children}
    </div>
  );
};

export default WaterMark;
