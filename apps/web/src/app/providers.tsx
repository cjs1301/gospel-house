"use client";

import { HeroUIProvider } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <I18nProvider locale="ko">{children}</I18nProvider>
        </HeroUIProvider>
    );
}
