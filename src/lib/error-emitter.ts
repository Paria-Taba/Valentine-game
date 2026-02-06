import mitt from "mitt"
import type { FirestorePermissionError } from "../lib/firestore-errors"

type Events = {
  "permission-error": FirestorePermissionError
}

export const errorEmitter = mitt<Events>()
