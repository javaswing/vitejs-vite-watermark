import { CSSProperties, useEffect, useRef } from "react";
import { WaterMarkProps } from "./type";
import useMutationObserver from "./useMutationObserver";

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
    watermarkContent = {},
  } = props;

  const {
    text = "",
    fontColor = "rgba(0, 0, 0, .15)",
    fontSize = 16,
    fontWeight = "normal",
  } = watermarkContent;

  let gapX = x; // 水平间隙
  let gapY = y; // 垂直间隙

  const offsetLeft = gapX / 2;
  const offsetTop = gapY / 2;

  // 获取设备像素比
  const ratio = window.devicePixelRatio | 1;

  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>();
  const stopObserver = useRef(false);

  /**
   * 这里之所以对于canvas的宽和高要加上间隙的距离
   * 是因为在此canvas上画的是一个完整的（水印+水印间距）的整体图片
   */
  const canvasWidth = (gapX + width) * ratio;
  const canvasHeight = (gapY + height) * ratio;

  // 监听当前节点修改的进行修复
  const observerCallBack = (mutations: MutationRecord[]) => {
    if (stopObserver.current) return;
    let rerender = false;
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // 修改节点状态
        const removeNodes = mutation.removedNodes;
        removeNodes.forEach((node) => {
          const e = node as HTMLElement;
          if (e === watermarkRef.current) {
            rerender = true;
          }
        });
      } else if (
        mutation.type === "attributes" &&
        mutation.target === watermarkRef.current
      ) {
        // 修改节点CSS属性
        rerender = true;
      }
    });

    if (rerender) {
      destroyWatermark();
      renderWatermark();
    }
  };

  const renderWatermark = () => {
    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    if (!text) {
      console.warn("watermark text is empty");
      return;
    }

    if (ctx) {
      if (!watermarkRef.current) {
        watermarkRef.current = document.createElement("div");
      }

      canvas.width = width;
      canvas.height = height;

      canvas.setAttribute("width", `${canvasWidth}px`);
      canvas.setAttribute("height", `${canvasHeight}px`);

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
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, markWidth, markHeight);

      ctx.save();

      // 画字
      const markSize = Number(fontSize) * ratio;
      // 参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/font
      // marHeight在这里是行高
      ctx.font = `normal normal ${fontWeight} ${markSize}px/${markHeight}px undefined`;
      ctx.textAlign = "start";
      ctx.textBaseline = "top";
      ctx.fillStyle = fontColor;
      ctx.fillText(text, 0, 0);

      stopObserver.current = true;
      const styles = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: `${gapX + width}px`,
        backgroundImage: `url(${canvas.toDataURL()})`,
      } as CSSProperties;

      Object.assign(watermarkRef.current.style, styles);

      containerRef.current?.appendChild(watermarkRef.current);

      // 暂时不知道为什么添加setTimeout
      setTimeout(() => {
        stopObserver.current = false;
      });
    }
  };

  const destroyWatermark = () => {
    if (watermarkRef.current) {
      watermarkRef.current.remove();
      watermarkRef.current = undefined;
    }
  };

  useEffect(() => {
    renderWatermark();
  }, [
    width,
    height,
    ratio,
    x,
    y,
    rotate,
    fontColor,
    fontSize,
    fontWeight,
    text,
  ]);
  useMutationObserver(containerRef, observerCallBack);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      {children}
    </div>
  );
};

export default WaterMark;
