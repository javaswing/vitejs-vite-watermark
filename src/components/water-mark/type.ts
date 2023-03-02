export type WaterMarkProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  watermarkContent?: Partial<WatermarkText>;
  height?: number;
  /**
   * 水印整体透明度，取值[0-1]
   */
  alpha?: number;

  /**
   * 水印旋转度数
   * @default -22
   */
  rotate?: number;
  /** 水印宽度 */
  width?: number;
  /** 水印之间的水平距离 */
  x?: number;
  /** 水印之间的垂直距离 */
  y?: number;
};

export type WatermarkText = {
  /** 水印内容 */
  text: string;
  fontColor: React.CSSProperties["color"];
  fontSize: number;
  fontWeight: React.CSSProperties["fontWeight"];
};
