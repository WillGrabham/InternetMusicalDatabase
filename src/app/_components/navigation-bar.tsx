"use client";

import TopNavigation, {
  type TopNavigationProps,
} from "@cloudscape-design/components/top-navigation";
import type { Session } from "next-auth";

interface NavigationBarProps {
  session: Session | null;
}

export function NavigationBar({ session }: NavigationBarProps) {
  const utilityItems: TopNavigationProps.Utility[] = session?.user
    ? [
        {
          type: "menu-dropdown",
          text: session.user?.name ?? "Account",
          iconName: "user-profile",
          items: [{ id: "signout", text: "Sign out", href: "/signout" }],
        },
      ]
    : [
        {
          type: "button",
          text: "Sign in",
          href: "/signin",
        },
        {
          type: "button",
          text: "Sign up",
          href: "/signup",
          external: false,
          variant: "primary-button",
        },
      ];

  return (
    <TopNavigation
      identity={{
        href: "/",
        title: "Musical Database",
      }}
      utilities={utilityItems}
      i18nStrings={{
        searchIconAriaLabel: "Search",
        searchDismissIconAriaLabel: "Close search",
        overflowMenuTriggerText: "More",
        overflowMenuTitleText: "All",
        overflowMenuBackIconAriaLabel: "Back",
        overflowMenuDismissIconAriaLabel: "Close menu",
      }}
    />
  );
}
