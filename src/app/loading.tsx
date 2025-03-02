"use client";

import { Spinner } from "@heroui/react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <Spinner
                    size="lg"
                    color="primary"
                    label="Loading..."
                    labelColor="primary"
                    className="mx-auto"
                />
                <p className="mt-4 text-muted-foreground">잠시만 기다려주세요...</p>
            </div>
        </div>
    );
}
