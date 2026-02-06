"use client"

import { useState, useEffect } from "react"
import { errorEmitter } from "@/lib/error-emitter"
import { FirestorePermissionError } from "@/lib/firestore-errors"

export function FirebaseErrorListener() {
  const [error, setError] =
    useState<FirestorePermissionError | null>(null)

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      setError(error)
    }

    errorEmitter.on("permission-error", handleError)
    return () => {
      errorEmitter.off("permission-error", handleError)
    }
  }, [])

  if (error) {
    throw error
  }

  return null
}
