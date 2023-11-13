"use client"
import { Disclosure } from '@headlessui/react'
import { DocumentDuplicateIcon, HomeIcon, Bars3Icon, Cog6ToothIcon, ChevronRightIcon, UsersIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

interface Navigation {
  name: string
  href?: string
  icon?: any
  children?: Navigation[]
}

const navigation : Navigation[] = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'About me', href: '/about', icon: Bars3Icon },
  { name: 'Projects', href: '/projects', icon: DocumentDuplicateIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function LogoWeb({className} : {className: string}) {
  return (
    <img
      className={className}
      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
      alt="Your Company"
    />
  )
}

export default function SideBarNav() {


  const path = usePathname()
  console.log(path)

  return (
    <div className="flex grow flex-col w-40 max-w-[15.5rem] min-w-[15.5rem] bg-primary-base">
      {/* Logo du site web */}
      <div className="w-full min-h-[4rem] flex h-16 shrink-0 items-center bg-primary-dark">
        {/* <LogoWeb className="h-8 w-auto" /> */}
      </div>
      {/* Menu SideBar */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            {/* Navigation */}
            <h2 className="text-primary-text-dark text-xs py-4 px-8">NAVIGATION</h2>
            <ul role="list" className="space-y-1 bg-primary-light py-2">
              {/* Lien de navigation */}
              {navigation.map((item) => (
                <li key={item.name} className="px-2">
                  {!item.children ? (
                    <a
                      href={item.href}
                      className={classNames(
                        item.href === path ? 'bg-primary-dark text-accent-light/75' : 'hover:bg-primary-select',
                        'flex gap-x-3 rounded-md px-5 items-center text-sm leading-6 font-semibold py-4 hover:text-accent-light text-primary-text-light'
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0 mr-4" aria-hidden="true" />
                      {item.name}
                    </a>
                  ) : (
                    <Disclosure as="div">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              item.href === path ? 'bg-primary-dark' : 'hover:bg-primary-select',
                              'flex gap-x-3 rounded-md px-5 items-center text-sm leading-6 font-semibold py-4 w-full hover:text-accent-light text-primary-text-light'
                            )}
                          >
                            <item.icon className="h-5 w-5 shrink-0 mr-4" aria-hidden="true" />
                            {item.name}
                            <ChevronRightIcon
                              className={classNames(
                                open ? 'rotate-90 text-gray-500' : 'text-text-50',
                                'ml-auto h-5 w-5 shrink-0'
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel as="ul" className="mt-1 px-2">
                            {(item.children as Navigation[]).map((subItem) => (
                              <li key={subItem.name}>
                                {/* 44px */}
                                <Disclosure.Button
                                  as="a"
                                  href={subItem.href}
                                  className={classNames(
                                    subItem.href === path ? 'bg-primary-dark' : 'hover:bg-primary-select',
                                    'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-text-50 hover:text-accent-light text-primary-text-light'
                                  )}
                                >
                                  {subItem.name}
                                </Disclosure.Button>
                              </li>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>

          </li>
          <li className="mt-auto">
            <ul role="list" className="space-y-1 py-2">
              <li key="setting" className="px-2 hover:text-accent-light text-primary-text-dark">
                <a
                  href=""
                  className="group flex items-center gap-x-3 rounded-md px-5 text-sm leading-6 font-semibold py-2"
                >
                  <Cog6ToothIcon className="h-5 w-5 shrink-0 mr-4" aria-hidden="true"/>
          Settings
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}