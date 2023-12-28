export default function Ad() {
  return (
    <div className="grid grid-cols-2  lg:grid-cols-4 gap-6 mb-6">
      <a href="https://avascriptions.com/">
        <div className="flex justify-center items-center h-[110px] rounded-2xl bg-[#171A1F] border border-[#2A2F37] border-solid px-5 py-8">
          <img
            src="/assets/imgs/ava-logo.png"
            alt="ava"
            className="max-h-full"
          />
        </div>
      </a>
      <a href="https://www.etch.market/">
        <div className="flex justify-center items-center h-[110px] rounded-2xl bg-[#171A1F] border border-[#2A2F37] border-solid px-5 py-8">
          <img
            src="/assets/imgs/etch-logo.svg"
            alt="etch-logo.svg"
            className="max-h-full"
          />
        </div>
      </a>
      <a href="https://avascriptions.com/market">
        <div className="flex justify-center items-center h-[110px] rounded-2xl bg-[#171A1F] border border-[#2A2F37] border-solid px-5 py-8">
          <img
            src="/assets/imgs/zk-logo.png"
            alt="zk-logo.png"
            className="max-h-full"
          />
        </div>
      </a>
      <a href="https://unisat.io/">
        <div className="flex justify-center items-center h-[110px] rounded-2xl bg-[#171A1F] border border-[#2A2F37] border-solid px-5 py-9">
          <img
            src="/assets/imgs/unisat-logo.svg"
            alt="unisat-logo"
            className="max-h-full"
          />
        </div>
      </a>
    </div>
  );
}
