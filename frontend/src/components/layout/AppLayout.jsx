import LeftSidebarr from "./LeftSidebar";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

const AppLayout = (MainComponent) => {
  return (
    <div className="w-full md:flex">
      <LeftSidebarr />
      <TopBar />

      <section className="flex flex-1  h-[calc(100vh-8rem)] md:min-h-screen overflow-y-auto scrollbar-hidden">
        <MainComponent />
      </section>

      <BottomBar />
    </div>
  );
};

export default AppLayout;
