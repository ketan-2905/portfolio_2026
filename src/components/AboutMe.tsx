import Render from "./Model";

const AboutMe = () => {
  return (
    <div className="grid md:grid-cols-2 gap-16 items-start">
      <div>
        <div className="inline-block px-3 py-1 border border-green-500/20 bg-green-500/5 text-green-500 text-[10px] font-mono mb-4">
          SYSTEM_BIO_READY
        </div>

        <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
          FullStack Engineer & <br />
          <span className="text-gray-500 italic">Creative Technologist.</span>
        </h3>

        <p className="text-gray-400 text-lg leading-relaxed font-light mb-8">
          B.Tech in{" "}
          <span className="text-white border-b border-green-500/30">
            CSE (Data Science)
          </span>
          . I specialize in building complex systems where robust performance
          meets immersive user experience.
        </p>

        {/* Resume Button */}
        <a
          href="/ketanresume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-sm tracking-wide hover:bg-green-500/20 transition-all duration-300"
        >
          DOWNLOAD_RESUME
        </a>
      </div>

      <div className="flex justify-center relative">
        <Render />
      </div>
    </div>
  );
};

export default AboutMe;
