<template>
  <section class="w-full h-full bg-[#fff]">
    <div class="relative grid w-full h-full grid-cols-1 lg:grid-cols-2">
      <div :class="['md:h-full relative group order-2 lg:order-1', isLogin && 'active']">
        <div
          class="absolute h-full w-full top-0 left-0 z-20 bg-gradient-to-bl from-darkBlueShades-400 from-10% to-darkBlueShades-800 to-90% shadow-[0px_4px_16px_rgba(0,0,0,0.2), _0px_8px_24px_rgba(0,0,0,0.2), _0px_16px_56px_rgba(0,0,0,0.2)] overflow-hidden pointer-events-none group-[.active]:pointer-events-auto transition-opacity duration-1000 ease-in-out opacity-0 group-[.active]:opacity-100"
        >
          <div
            class="relative h-full w-full flex flex-col items-center justify-center translate-x-full opacity-0 group-[.active]:translate-x-0 group-[.active]:opacity-100 overflow-hidden transition-all duration-500 ease-in-out"
          >
            <div class="flex flex-col items-center justify-center flex-1 gap-8 lg:gap-16">
              <h2 class="font-sans text-4xl font-black text-center text-gray-50">
                <span class="lg:text-6xl"> Salut! </span> <br />
              </h2>
              <p class="max-w-md px-6 text-sm font-light text-center text-gray-200 md:text-base">
                Nous sommes heureux de vous aider à créer un compte. Nous vous souhaitons une bonne
                journée. Si vous avez déjà un compte, vous pouvez vous connecter en cliquant sur le
                bouton ci-dessous.
              </p>
              <div class="">
                <button
                  class="items-center justify-center w-full px-6 py-2.5 text-center text-gray-50 duration-200 bg-none inline-flex hover:bg-white hover:text-darkBlueShades-700 focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-darkBlueShades-700 toggle transition-all ease-in-out"
                  type="button"
                  @click="handleToggle"
                >
                  <span> Se connecter </span>
                  <span class="ml-4">
                    <svg
                      class="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <div class="mt-auto py-1.5 text-orangeShades-200">
              <ul class="flex flex-row items-center justify-center gap-4">
                <li>
                  <a
                    href="#"
                    class="text-xs transition-all duration-500 ease-in-out hover:text-orangeShades-300"
                  >
                    Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-xs transition-all duration-500 ease-in-out hover:text-orangeShades-300"
                  >
                    Politiques
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-xs transition-all duration-500 ease-in-out hover:text-orangeShades-300"
                  >
                    Contacts
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          class="relative z-10 flex flex-col flex-1 px-4 py-10 overflow-hidden bg-white lg:py-24 md:flex-none md:px-28 sm:justify-center md:h-full"
        >
          <div
            class="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4 group-[.active]:translate-x-full group-[.active]:opacity-0 transition-all duration-500 ease-in-out"
          >
            <div class="flex flex-col gap-8">
              <div>
                <h2 class="font-sans text-4xl font-black text-center text-darkBlueShades-700">
                  Connexion
                </h2>
              </div>
              <div class="flex flex-row items-center justify-center gap-8 wrap">
                <a
                  href=""
                  class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-darkBlueShades-700 text-darkBlueShades-700"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 8 19"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.135 3H8V0H6.135a4.147
                         4.147 0 0 0-4.142 
                         4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6
                          0 0 1 5.592 3h.543Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href=""
                  class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-darkBlueShades-700 text-darkBlueShades-700"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841
                         8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0
                          0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0
                           0 0 9.09 3.4a5.882 5.882 0 0 0-.2 
                           11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3
                            11H9V8h8.34c.066.543.095 1.09.088 1.636-.086
                             5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href=""
                  class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-darkBlueShades-700 text-darkBlueShades-700"
                >
                  <svg
                    class="w-4 h-4"
                    version="1.1"
                    id="Calque_1"
                    sodipodi:docname="42_logo.svg"
                    inkscape:version="0.48.2 r9819"
                    x="0px"
                    y="0px"
                    viewBox="0 -200 960 960"
                    enable-background="new 0 -200 960 960"
                    xml:space="preserve"
                  >
                    <polygon
                      id="polygon5"
                      points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1   32,279.1 "
                    />
                    <polygon id="polygon7" points="597.9,114.2 762.7,-51.1 597.9,-51.1 " />
                    <polygon
                      id="polygon9"
                      points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1 "
                    />
                    <polygon id="polygon11" points="928,279.1 762.7,443.9 928,443.9 " />
                  </svg>
                </a>
              </div>

              <p class="text-xs text-center text-orangeShades-300">
                Ou connectez vous avec votre compte
              </p>
            </div>
            <form autocomplete="off">
              <div class="mt-4 space-y-6">
                <div class="relative col-span-full">
                  <label class="block mb-3 text-sm font-medium text-gray-600 sr-only">
                    Email
                  </label>
                  <input
                    class="block w-full px-4 py-1.5 text-darkBlueShades-700 bg-white border-b border-gray-200 appearance-none placeholder:text-gray-300 focus:border-darkBlueShades-700 focus:outline-none focus:ring-darkBlueShades-700 text-xs placeholder:font-light"
                    placeholder="email@moi.com"
                    name="email"
                    type="email"
                  />
                </div>

                <div class="relative col-span-full">
                  <label class="block mb-3 text-sm font-medium text-gray-600 sr-only">
                    Mot de passe
                  </label>
                  <input
                    class="block w-full px-4 py-1.5 text-darkBlueShades-700 bg-white border-b border-gray-200 appearance-none placeholder:text-gray-500 focus:border-darkBlueShades-700 focus:outline-none focus:ring-darkBlueShades-700 text-xs placeholder:font-light"
                    placeholder="Mot de passe"
                    autocomplete="off"
                    name="password"
                    type="password"
                  />
                  <button
                    class="absolute right-0 -translate-y-1/2 group top-1/2 togglePasswordVisibility"
                    type="button"
                  >
                    <span class="hidden group-[.active]:block" id="">
                      <svg
                        class="w-3 h-3 text-darkBlueShades-700/50"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1.933 10.909A4.357 4.357 
                            0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 
                            5.068 0 0 1 19 9c0 1-3 6-9 6-.314 
                            0-.62-.014-.918-.04M2 17 18 1m-5 
                            8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </span>
                    <span class="block group-[.active]:hidden">
                      <svg
                        class="w-3 h-3 text-darkBlueShades-700/50"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 14"
                      >
                        <g
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        >
                          <path
                            d="M10 10a3 3 0 1 0 0-6 
                            3 3 0 0 0 0 6Z"
                          />
                          <path
                            d="M10 13c4.97 0 9-2.686 
                              9-6s-4.03-6-9-6-9 2.686-9 
                              6 4.03 6 9 6Z"
                          />
                        </g>
                      </svg>
                    </span>
                  </button>
                </div>
                <div class="text-right col-span-full">
                  <a
                    href="#"
                    class="text-xs underline transition-all duration-500 ease-in-out text-orangeShades-300 hover:text-orangeShades-300"
                  >
                    Mot de passe oublié
                  </a>
                </div>
                <div class="col-span-full">
                  <div
                    class="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-darkBlueShades-700 border border-darkBlueShades-700 inline-flex hover:bg-transparent hover:border-darkBlueShades-700 hover:text-darkBlueShades-700 focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-darkBlueShades-700 transition-all ease-in-out"
                    type="submit"
                  >
                    Se connecter
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div :class="['md:h-full relative active group order-1 lg:order-2', !isLogin && 'active']">
        <div
          class="absolute h-full w-full top-0 left-0 z-20 bg-gradient-to-br from-darkBlueShades-400 from-10% to-darkBlueShades-800 to-90% shadow-[0px_4px_16px_rgba(0,0,0,0.2),_0px_8px_24px_rgba(0,0,0,0.2),_0px_16px_56px_rgba(0,0,0,0.2)] overflow-hidden pointer-events-none group-[.active]:pointer-events-auto transition-opacity duration-1000 ease-in-out opacity-0 group-[.active]:opacity-100"
        >
          <div
            class="relative h-full w-full flex flex-col items-center justify-center -translate-x-full opacity-0 group-[.active]:translate-x-0 group-[.active]:opacity-100 overflow-hidden transition-all duration-500 ease-in-out"
          >
            <div class="flex flex-col items-center justify-center flex-1 gap-8 lg:gap-16">
              <h2 class="font-sans text-4xl font-black text-center text-gray-50">
                <span class="lg:text-6xl"> Bon retour! </span>
              </h2>
              <p class="max-w-md px-6 text-sm font-light text-center text-gray-200">
                Nous sommes heureux de vous revoir. Nous vous souhaitons une bonne journée. Si vous
                n'avez pas de compte, vous pouvez en créer un en cliquant sur le bouton ci-dessous.
              </p>
              <div class="">
                <button
                  class="items-center justify-center w-full px-6 py-2.5 text-center text-gray-50 duration-200 bg-none inline-flex hover:bg-white hover:text-darkBlueShades-700 focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-darkBlueShades-700 toggle transition-all duration-500 ease-in-out"
                  type="button"
                  @click="handleToggle"
                >
                  <span class="mr-4 rotate-180">
                    <svg
                      class="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  </span>
                  <span> Créer un compte </span>
                </button>
              </div>
            </div>
            <div class="mt-auto py-1.5 text-orangeShades-300">
              <ul class="flex flex-row items-center justify-center gap-4">
                <li>
                  <a
                    href="#"
                    class="text-xs transition-all duration-500 ease-in-out hover:text-orangeShades-300"
                  >
                    Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-xs transition-all duration-500 ease-in-out hover:text-orangeShades-300"
                  >
                    Politiques
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="text-xs transition-all duration-500 ease-in-out hover:text-orangeShades-300"
                  >
                    Contacts
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          class="relative flex flex-col flex-1 px-4 py-10 overflow-hidden bg-white lg:py-24 md:flex-none md:px-28 sm:justify-center md:h-full"
        >
          <div
            class="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4 group-[.active]:-translate-x-full group-[.active]:opacity-0 transition-all duration-500 ease-in-out"
          >
            <div class="flex flex-col gap-8">
              <div>
                <h2 class="font-sans text-4xl font-black text-center text-darkBlueShades-700">
                  Créer un compte
                </h2>
              </div>
              <div class="flex flex-row items-center justify-center gap-8 wrap">
                <a
                  href=""
                  class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-darkBlueShades-700 text-darkBlueShades-700"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 8 19"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href=""
                  class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-darkBlueShades-700 text-darkBlueShades-700"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href=""
                  class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-darkBlueShades-700 text-darkBlueShades-700"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      d="M12.186 8.672 18.743.947h-2.927l-5.005 5.9-4.44-5.9H0l7.434 9.876-6.986 8.23h2.927l5.434-6.4 4.82 6.4H20L12.186 8.672Zm-2.267 2.671L8.544 9.515 3.2 2.42h2.2l4.312 5.719 1.375 1.828 5.731 7.613h-2.2l-4.699-6.237Z"
                    />
                  </svg>
                </a>
              </div>

              <p class="text-xs text-center text-orangeShades-300">
                Ou créer un compte avec votre email
              </p>
            </div>
            <form autocomplete="off">
              <div class="mt-4 space-y-6">
                <div>
                  <label class="block mb-3 text-sm font-medium text-gray-600 sr-only">
                    Email
                  </label>
                  <input
                    class="block w-full px-4 py-1.5 text-darkBlueShades-700 bg-white border-b border-gray-200 appearance-none placeholder:text-gray-300 focus:border-darkBlueShades-700 focus:outline-none focus:ring-darkBlueShades-700 text-xs placeholder:font-light"
                    placeholder="email@moi.com"
                    name="email"
                    type="email"
                  />
                </div>

                <div class="relative col-span-full">
                  <label class="block mb-3 text-sm font-medium text-gray-600 sr-only">
                    Mot de passe
                  </label>
                  <input
                    class="block w-full px-4 py-1.5 text-darkBlueShades-700 bg-white border-b border-gray-200 appearance-none placeholder:text-gray-300 focus:border-darkBlueShades-700 focus:outline-none focus:ring-darkBlueShades-700 text-xs placeholder:font-light"
                    placeholder="Mot de passe"
                    name="password"
                    autocomplete="off"
                    type="password"
                  />
                  <button
                    class="absolute right-0 -translate-y-1/2 group top-1/2 togglePasswordVisibility"
                    type="button"
                  >
                    <span class="hidden group-[.active]:block" id="">
                      <svg
                        class="w-3 h-3 text-darkBlueShades-700/50"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </span>
                    <span class="block group-[.active]:hidden">
                      <svg
                        class="w-3 h-3 text-darkBlueShades-700/50"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 14"
                      >
                        <g
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        >
                          <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                        </g>
                      </svg>
                    </span>
                  </button>
                </div>
                <div class="relative col-span-full">
                  <label class="block mb-3 text-sm font-medium text-gray-600 sr-only">
                    Confirmer le mot de passe
                  </label>
                  <input
                    class="block w-full px-4 py-1.5 text-darkBlueShades-700 bg-white border-b border-gray-200 appearance-none placeholder:text-gray-300 focus:border-darkBlueShades-700 focus:outline-none focus:ring-darkBlueShades-700 text-xs placeholder:font-light"
                    placeholder="Confirmer le mot de passe"
                    autocomplete="off"
                    name="confirmPassword"
                    type="password"
                  />
                  <button
                    class="absolute right-0 -translate-y-1/2 group top-1/2 togglePasswordVisibility"
                    type="button"
                  >
                    <span class="hidden group-[.active]:block" id="">
                      <svg
                        class="w-3 h-3 text-darkBlueShades-700/50"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 18"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1.933 10.909A4.357 4.357 0 0 1 1 9c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 19 9c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M2 17 18 1m-5 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    </span>
                    <span class="block group-[.active]:hidden">
                      <svg
                        class="w-3 h-3 text-darkBlueShades-700/50"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 14"
                      >
                        <g
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                        >
                          <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <path d="M10 13c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6Z" />
                        </g>
                      </svg>
                    </span>
                  </button>
                </div>
                <div class="col-span-full">
                  <button
                    class="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-darkBlueShades-700 border border-darkBlueShades-700 inline-flex hover:bg-transparent hover:border-darkBlueShades-700 hover:text-darkBlueShades-700 focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-darkBlueShades-700 transition-all duration-500 ease-in-out"
                    type="submit"
                  >
                    S'inscrire
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import useAuthStore, { LoginStatus } from '@/stores/AuthStore'
import { ref, onMounted } from 'vue'

const isLogin = ref(false)

const handleToggle = (e: Event) => {
  e.preventDefault()
  isLogin.value = !isLogin.value
}
</script>

<style lang="scss"></style>
