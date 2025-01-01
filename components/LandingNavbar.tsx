import Link from "next/link";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";

async function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack px-5 m500:h-16 ">
      <div className="mx-auto flex w-[1300px] dark:text-darkText text-text max-w-full items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            className="text-[30px] h-11 w-11 rounded-base flex bg-main text-text border-2 border-black m500:w-9 m500:h-9 m500:text-[22px] items-center justify-center font-heading"
            href={"/"}
          >
            F
          </Link>

          <div className="flex items-center gap-10 m1100:gap-8 m900:hidden">
            <Link className="text-xl m1100:text-base font-base" href="/app">
              Get Started
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-5 m1000:gap-5">
          <div className="flex items-center justify-end gap-5 m800:w-[unset] m400:gap-3">
            <a
              target="_blank"
              href="https://twitter.com/mrloldev"
              className="m800:hidden flex items-center justify-center rounded-base border-2 border-border shadow-nav dark:shadow-navDark dark:border-darkBorder p-2 transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none dark:hover:shadow-none"
            >
              <svg
                className="h-6 w-6 m500:h-4 m500:w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  className="fill-text dark:fill-darkText"
                  d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                />
              </svg>
            </a>

            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
