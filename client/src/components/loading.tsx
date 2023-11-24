/**
 * Loading组件
 * 用于按需加载时过渡显示等
 */
import ImgLoading from "@/assets/loading.gif";

export default function LoadingComponent(): JSX.Element {
  return (
    <div className=" text-center p-[50px] text-base relative m-auto text-gray-300">
      <img src={ImgLoading} className=" mb-5" />
      <div>加载中...</div>
    </div>
  );
}
