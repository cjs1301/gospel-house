"use client";

import { Button } from "@heroui/react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default function LogoutButton() {
    return (
        <Button
            variant="light"
            color="danger"
            startContent={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
            className="w-full justify-start"
            onPress={() => signOut({ redirectTo: "/login" })}
        >
            로그아웃
        </Button>
    );
}
