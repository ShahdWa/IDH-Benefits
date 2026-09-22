'use client';

export default function FooterCTA({ onOpenAuthModal }) {
  return (
    <section className="max-w-[1100px] mx-auto mb-16 px-6">
      <div className="bg-[#23161A] rounded-[24px] p-[36px_40px] flex items-center justify-between gap-6 flex-wrap shadow-xl">
        <div>
          <h3 className="text-white text-[20px] font-bold">Haven't signed up yet?</h3>
          <p className="text-white/60 text-[14px] mt-1">Create your account and unlock every benefit in under a minute.</p>
        </div>
        <button 
          onClick={() => onOpenAuthModal('signup')}
          className="px-6 py-3 rounded-full bg-[#A50D1A] text-white text-[14px] font-semibold shadow-lg shadow-[#A50D1A]/50 hover:scale-[1.02] transition-all"
        >
          Get started
        </button>
      </div>
    </section>
  );
}
