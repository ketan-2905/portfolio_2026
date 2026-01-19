
interface ContactBtnProps{
  icon: React.ReactNode;
  label: string;
  href: string;
}
const ContactBtn: React.FC<ContactBtnProps> = ({
  icon,
  label,
  href,
})  => {
  return (
    <a
      href={href}
      // Font change
      target="_blank"
      className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/5 
       hover:bg-green-500 hover:text-black hover:border-green-500 transition-all font-mono text-xs uppercase tracking-widest"
    >
      {icon} <span>{label}</span>
    </a>
  );
}

export default ContactBtn