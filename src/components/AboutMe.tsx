import Render from "./Model";

const AboutMe = () => {
  return (
    <div className="grid md:grid-cols-2 gap-16 items-start">
      <div>
        <div className="inline-block px-3 py-1 border border-green-500/20 bg-green-500/5 text-green-500 text-[10px] font-mono mb-4">
          SYSTEM_BIO_READY
        </div>
        <h3 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
          Software Engineer & <br />
          <span className="text-gray-500 italic">Creative Technologist.</span>
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed font-light">
          B.Tech in{" "}
          <span className="text-white border-b border-green-500/30">
            CSE (Data Science)
          </span>
          . I specialize in building complex systems where robust performance
          meets immersive user experience.
        </p>
      </div>
      <div className="flex justify-center relative">
        <Render />
      </div>
    </div>
  );
};

export default AboutMe;
