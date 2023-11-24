import ImgLogo from "@/assets/react-logo.jpg";
export default function Home() {
  // console.log("render home");
  return (
    <div className=" h-full">
      <div className=" m-auto text-center">
        <img src={ImgLogo} />
        <div className=" text-xl">React-admin</div>
        <div>标准后台管理系统解决方案，react18、router6、rematch、antd4、vite4、ES6+</div>
        <div className=" text-base">动态菜单配置，权限精确到按钮</div>
      </div>
    </div>
  );
}
