import { useEffect, useMemo, useRef, useState } from 'react';
import { WaterMarkProps } from './type';

const WaterMark = (props: WaterMarkProps) => {
  const {
    x = 220,
    y = 210,
    width = 120,
    height = 60,
    alpha = 1,
    rotate = -22,
    className,
    style = {},
    children,
    content = '',
  } = props;

  let gapX = x; // 水平间隙
  let gapY = y; // 垂直间隙

  const offsetLeft = gapX / 2;
  const offsetTop = gapY / 2;

  const cavasRef = useRef<HTMLCanvasElement | null>(null);
  const [base64Url, setBase64Url] = useState('');

  useEffect(() => {
    // 1. 创建canvas 对象
    if (!cavasRef.current) {
      cavasRef.current = document.createElement('canvas');
    }
  }, []);

  const ctx = useMemo(() => {
    return cavasRef.current?.getContext('2d');
  }, []);

  // 获取设备像素比
  const ratio = window.devicePixelRatio | 1;

  /**
   * 这里之所以对于canvas的宽和高要加上间隙的距离
   * 是因为在此canvas上画的是一个完整的（水印+水印间距）的整体图片
   */
  const canvasWidth = (gapX + width) * ratio;
  const canvasHeight = (gapY + height) * ratio;

  useEffect(() => {
    if (cavasRef.current) {
      cavasRef.current.width = width;
      cavasRef.current.height = height;
      cavasRef.current.style.background = '#d1eee0';
      cavasRef.current.setAttribute('width', `${canvasWidth}px`);
      cavasRef.current.setAttribute('height', `${canvasHeight}px`);
    }
  }, []);

  useEffect(() => {
    if (ctx) {
      /**
       * 平移当前canvas的原点
       * offsetLeft offsetRight为间隙的一半
       * 这段设置的作用是用于调整canvas的画笔位置，让下笔点在对于双边的间隙都是相等（即让水印在canvas居中位置出现）
       */
      ctx.translate(offsetLeft * ratio, offsetTop * ratio);

      /**
       * 旋转canvas，默认顺时针旋转
       * (Math.PI / 180) * number 把角度转换为弧度，canvas API参数类型为弧度
       */
      ctx.rotate((Math.PI / 180) * Number(rotate));

      // 设置画笔的透明度
      ctx.globalAlpha = alpha;

      // 设置水印的位置区域
      const markWidth = width * ratio;
      const markHeight = height * ratio;
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, markWidth, markHeight);

      // 样式默认值
      const fontSize = 16;
      const fontWeight = 'normal';
      const fontColor = 'rgba(0, 0, 0, 0.1)';

      // 画字
      const markSize = Number(fontSize) * ratio;
      // 参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
      // marHeight在这里是行高
      ctx.font = `normal normal ${fontWeight} ${markSize}px/${markHeight}px undefined`;
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';
      ctx.fillStyle = fontColor;
      ctx.fillText(content, 0, 0);

      cavasRef.current && setBase64Url(cavasRef.current.toDataURL());
    }
  }, [ctx, width, height]);

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${base64Url})`,
        }}
      ></div>
      {/* <canvas ref={cavasRef} /> */}
      {children}
    </div>
  );
};

export default WaterMark;
