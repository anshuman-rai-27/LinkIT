import Image from "next/image";
import Link from "next/link";
import React from "react";

export function SimpleFooterWithFourGrids() {
  const platform = [
    {
      title: "Browse Skills",
      href: "#",
    },
    {
      title: "Find Teachers", 
      href: "#",
    },
    {
      title: "Join Community",
      href: "#",
    },
    {
      title: "Success Stories",
      href: "#",
    },
  ];

  const support = [
    {
      title: "Help Center",
      href: "#",
    },
    {
      title: "Community Guidelines",
      href: "#",
    },
    {
      title: "Safety Tips",
      href: "#",
    },
    {
      title: "Contact Us",
      href: "#",
    },
  ];

  const company = [
    {
      title: "About LinkIT",
      href: "#",
    },
    {
      title: "Careers",
      href: "#",
    },
    {
      title: "Press",
      href: "#",
    },
    {
      title: "Blog",
      href: "#",
    },
  ];

  const legal = [
    {
      title: "Privacy Policy",
      href: "#",
    },
    {
      title: "Terms of Service",
      href: "#",
    },
    {
      title: "Cookie Policy",
      href: "#",
    },
    {
      title: "Accessibility",
      href: "#",
    },
  ];

  return (
    <div className="border-t border-slate-200 px-8 py-20 bg-white w-full relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-sm text-slate-500 flex sm:flex-row flex-col justify-between items-start md:px-8">
        <div>
          <div className="mr-0 md:mr-4 md:flex mb-4">
            <Logo />
          </div>

          <div className="mt-2 ml-2 text-slate-600">
            &copy; copyright LinkIT 2024. All rights reserved.
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
          <div className="flex justify-center space-y-4 flex-col w-full">
            <p className="text-slate-900 font-semibold">
              Platform
            </p>
            <ul className="list-none space-y-4">
              {platform.map((item, idx) => (
                <li key={"platform" + idx} className="list-none">
                  <Link
                    className="text-slate-600 hover:text-emerald-600 transition-colors"
                    href={item.href}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="text-slate-900 font-semibold">
              Support
            </p>
            <ul className="list-none space-y-4">
              {support.map((item, idx) => (
                <li key={"support" + idx} className="list-none">
                  <Link
                    className="text-slate-600 hover:text-emerald-600 transition-colors"
                    href={item.href}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="text-slate-900 font-semibold">
              Company
            </p>
            <ul className="list-none space-y-4">
              {company.map((item, idx) => (
                <li key={"company" + idx} className="list-none">
                  <Link
                    className="text-slate-600 hover:text-emerald-600 transition-colors"
                    href={item.href}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center space-y-4 flex-col">
            <p className="text-slate-900 font-semibold">
              Legal
            </p>
            <ul className="list-none space-y-4">
              {legal.map((item, idx) => (
                <li key={"legal" + idx} className="list-none">
                  <Link
                    className="text-slate-600 hover:text-emerald-600 transition-colors"
                    href={item.href}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="text-center mt-20 text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-50 to-slate-200 inset-x-0">
        LinkIT
      </p>
    </div>
  );
}

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4 text-black px-2 py-1 relative z-20"
    >
      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">L</span>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">LinkIT</span>
        <span className="text-xs text-slate-500 -mt-1">Where Skills Connect</span>
      </div>
    </Link>
  );
};