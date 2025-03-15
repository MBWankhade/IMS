import LeftSidebarr from "./LeftSidebar";

const AppLayout = (MainComponent) => {
  return (
    <div className="w-full md:flex">
      {/* <Topbar /> */}
      <LeftSidebarr />

      <section className="flex flex-1 h-full">
        <MainComponent />
      </section>

      {/* <Bottombar /> */}
    </div>
  );
};

export default AppLayout;
