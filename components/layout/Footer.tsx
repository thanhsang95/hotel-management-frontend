'use client';


// ==========================================
// Footer Component
// ==========================================

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="
      h-12 px-6
      bg-[#F8FAFC] border-t border-[#E2E8F0]
      flex items-center justify-center
    ">
      <p className="text-sm text-[#6B7280]">
        © {currentYear} Hotel Management System | v1.0.0
      </p>
    </footer>
  );
}

export default Footer;
