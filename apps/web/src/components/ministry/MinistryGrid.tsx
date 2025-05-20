"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
interface Ministry {
    id: string;
    name: string;
    description: string | null;
    _count: {
        members: number;
    };
}

interface MinistryGridProps {
    ministries: Ministry[];
}

export default function MinistryGrid({ ministries }: MinistryGridProps) {
    const router = useRouter();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry: Ministry) => (
                <div key={ministry.id} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">{ministry.name}</h3>
                        {ministry.description && (
                            <p className="text-gray-500 line-clamp-2">{ministry.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                멤버 {ministry._count.members}명
                            </span>

                            <Button
                                color="primary"
                                size="sm"
                                onPress={() => {
                                    router.push(`/ministries/${ministry.id}`);
                                }}
                            >
                                자세히 보기
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
