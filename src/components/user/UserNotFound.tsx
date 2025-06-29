"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="flex justify-center items-center flex-col px-4 py-12">
      <div className="text-center">
        <div className="mb-6">
          <User size={120} className="text-gray-300 mx-auto" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          User Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Sorry, we couldn't find that user.
        </p>
        <p className="text-gray-500 mb-8">
          The user may have changed their username or doesn't exist.
        </p>
        <Link href="/">
          <Button className="px-6 py-2">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
