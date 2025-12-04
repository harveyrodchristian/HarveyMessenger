"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <Card className="border-0 shadow-lg text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <svg
            className="h-6 w-6 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <CardTitle className="text-2xl">Account Created!</CardTitle>
        <CardDescription>Please check your email to confirm your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We've sent a confirmation link to your email address. Click the link to verify your account and start
          messaging.
        </p>
        <Link href="/auth/login" className="block">
          <Button variant="outline" className="w-full bg-transparent">
            Back to Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
