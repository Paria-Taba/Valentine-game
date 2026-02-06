export class FirestorePermissionError extends Error {
  constructor(message = "Firestore permission denied") {
    super(message)
    this.name = "FirestorePermissionError"
  }
}
